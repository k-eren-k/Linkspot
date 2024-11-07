const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: String,
  socialMedia: [
    {
      platform: String,
      url: String,
      clicks: { type: Number, default: 0 }, // Add a click counter for each social media link
    }
  ],
  profileImage: String,
  theme: { type: String, default: 'default.css' },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  workplace: String,
  address: String,
  totalViews: { type: Number, default: 0 }, // Total view count
  dailyViews: { type: Number, default: 0 }, // Daily view count
  lastViewed: { type: Date, default: Date.now } // Track the last view date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
