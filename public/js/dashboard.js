// URL Doğrulama Fonksiyonu
function validateUrl() {
    const input = document.getElementById('url-input');
    const feedback = document.getElementById('feedback');
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
    const isValid = urlPattern.test(input.value);

    if (input.value && !isValid) {
        input.classList.add('invalid');
        feedback.style.display = 'block';
    } else {
        input.classList.remove('invalid');
        feedback.style.display = 'none';
    }
}

// URL Kopyalama Fonksiyonu
function copyUrl() {
    const input = document.getElementById('url-input');
    if (input.value) {
        navigator.clipboard.writeText(input.value);
        alert('URL copied to clipboard!');
    }
}

// URL Açma Fonksiyonu
function openUrl() {
    const input = document.getElementById('url-input');
    if (input.value && !input.classList.contains('invalid')) {
        window.open(input.value, '_blank');
    }
}

// Karakter Sayısını Güncelleme Fonksiyonu
function updateCharacterCount(textarea) {
    const maxLength = textarea.getAttribute("maxlength");
    const characterCount = textarea.value.length;
    document.getElementById("characterCount").textContent = `${characterCount}/${maxLength}`;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
}

// Sekme Değiştirme Fonksiyonu
let activeTab = 0;
const tabs = [
    { title: 'Dashboard', content: 'This is the Dashboard content.' },
    { title: 'Projects', content: 'Here you can view all your projects.' },
    { title: 'Team', content: 'Manage your team members here.' },
    { title: 'Settings', content: 'Adjust your account settings.' }
];

function changeTab(index) {
    activeTab = index;
    document.querySelectorAll('.tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx === activeTab);
    });
    document.getElementById('tab-title').innerText = tabs[activeTab].title;
    document.getElementById('tab-description').innerText = tabs[activeTab].content;
}

// Sosyal Medya Linki Ekleme Fonksiyonu
function addSocialLink() {
    const container = document.getElementById('social-media-links');
    const index = container.children.length;
    const div = document.createElement('div');
    div.classList.add('social-link');
    div.id = `link-${index}`;
    div.innerHTML = `
      <input type="text" class="social-name" name="socialMedia[${index}][platform]" placeholder="Platform">
      <input type="text" class="social-url" name="socialMedia[${index}][url]" placeholder="URL">
      <button type="button" class="delete-soc" onclick="removeSocialLink(${index})"><i class="fa-light fa-trash"></i></button>
    `;
    container.appendChild(div);
}

// Sosyal Medya Linki Silme Fonksiyonu
function removeSocialLink(index) {
    const linkDiv = document.getElementById(`link-${index}`);
    if (linkDiv) {
        linkDiv.remove();
    }
}

// Tema Seçim Fonksiyonu
const themes = [
    { name: 'Default' }, { name: 'Los Angeles Morning' }, { name: 'Los Angeles Night' },
    { name: 'Dolphin' }, { name: 'Cat' }, { name: 'Valorant' }, { name: 'XP' },
    { name: 'Sky' }, { name: 'Tree' }, { name: 'Nature' }, { name: 'Greens' },
    { name: 'Apartment' }, { name: 'Photography' }, { name: 'Mountains' }, { name: 'Bird' }
];

let selectedTheme = null;

// Tema Seçimi
function selectTheme(theme, themeItem) {
    selectedTheme = theme;
    document.querySelector('.theme-select-button').textContent = theme;
    document.querySelectorAll('.theme-item').forEach((item) => {
        item.classList.remove('active');
        item.querySelector('.checkmark').style.visibility = 'hidden';
    });
    themeItem.classList.add('active');
    themeItem.querySelector('.checkmark').style.visibility = 'visible';
}

// Tema Listesini Doldurma
function populateThemes() {
    const themeList = document.getElementById('themeList');
    themeList.innerHTML = ''; // Mevcut listeyi temizle
    themes.forEach((theme) => {
        const themeItem = document.createElement('div');
        themeItem.className = 'theme-item';
        themeItem.textContent = theme.name;

        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        checkmark.innerHTML = '✔';
        checkmark.style.visibility = theme.name === selectedTheme ? 'visible' : 'hidden';

        themeItem.appendChild(checkmark);
        themeItem.onclick = () => selectTheme(theme.name, themeItem);

        themeList.appendChild(themeItem);
    });
}

// Modal'ı Açma
function openModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.style.display = 'flex';
        populateThemes(); // Temalar yüklensin
    } else {
        console.error("Modal element with id 'themeModal' not found.");
    }
}

// Modal'ı Kapatma
function closeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal element with id 'themeModal' not found.");
    }
}

// Tema Arama Fonksiyonu
function filterThemes() {
    const filter = document.getElementById('themeSearchInput').value.toLowerCase();
    const themeItems = document.querySelectorAll('.theme-item');
    themeItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? 'flex' : 'none';
    });
}
