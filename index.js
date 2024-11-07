require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs= require('fs');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio'); // Assuming you have a Portfolio model

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});
// Route to increment the click count for a social media link
app.post('/increment-click/:userId/:socialMediaId', async (req, res) => {
  try {
    const { userId, socialMediaId } = req.params;
    
    // Find the user by userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the social media link by socialMediaId and increment the clicks
    const socialMedia = user.socialMedia.id(socialMediaId);
    
    if (!socialMedia) {
      return res.status(404).json({ message: 'Social media link not found' });
    }

    // Increment the click counter
    socialMedia.clicks += 1;
    
    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Click count updated', clicks: socialMedia.clicks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const user = await User.findById(req.session.userId).lean();
    const portfolios = await Portfolio.find({ userId: req.session.userId }).lean();

    // Fetch social media logos for dashboard (same logic as profile)
    const socialMediaWithLogos = await Promise.all(user.socialMedia.map(async (link) => {
      if (link.url) {  // Ensure URL is valid
        try {
          const domain = new URL(link.url).hostname;
          const response = await axios.get(`https://logo.clearbit.com/${domain}`);
          link.logo = response.config.url;
        } catch (error) {
          console.error(`Error fetching logo for ${link.url}:`, error);
          link.logo = null;  // Fallback if logo fetching fails
        }
      } else {
        link.logo = null;  // If the URL is invalid, clear the logo
      }
      return link;
    }));

    user.socialMedia = socialMediaWithLogos;

    res.render('dashboard', { user, portfolios });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.post('/dashboard/edit-profile', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const { bio, socialMedia, profileImage, theme } = req.body; // Include theme in the destructuring
    const formattedSocialMedia = socialMedia 
      ? socialMedia.map(link => ({ platform: link.platform, url: link.url }))
      : [];

    await User.findByIdAndUpdate(req.session.userId, {
      bio,
      socialMedia: formattedSocialMedia,
      profileImage,
      theme, // Save the selected theme
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the profile.');
  }
});

const axios = require('axios');

app.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send('User not found');

    // Increment total views
    user.totalViews += 1;

    // Reset daily views if last viewed was on a different day
    const today = new Date().setHours(0, 0, 0, 0);
    const lastViewedDay = new Date(user.lastViewed).setHours(0, 0, 0, 0);
    if (today !== lastViewedDay) {
      user.dailyViews = 1; // New day, reset daily views
    } else {
      user.dailyViews += 1;
    }
    user.lastViewed = Date.now();

    // Save the updated user
    await user.save();

    // Fetch social media logos (you can use your existing logic)
    const socialMediaWithLogos = await Promise.all(user.socialMedia.map(async (link) => {
      if (link.url) {  // URL'nin geçerli olup olmadığını kontrol edin
        try {
          const domain = new URL(link.url).hostname;
          const response = await axios.get(`https://logo.clearbit.com/${domain}`);
          link.logo = response.config.url;
        } catch (error) {
          console.error(`Error fetching logo for ${link.url}:`, error);
          link.logo = null;
        }
      } else {
        link.logo = null;  // Geçersiz URL ise, logoyu boş bırakın
      }
      return link;
    }));
    

    user.socialMedia = socialMediaWithLogos;
    res.render('profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
app.post('/increment-click/:linkId', async (req, res) => {
  try {
    const user = await User.findOne({ "socialMedia._id": req.params.linkId });
    if (user) {
      const link = user.socialMedia.id(req.params.linkId);
      link.clicks += 1;
      await user.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
