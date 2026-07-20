// ===== LOAD DATA DARI JSON =====
let DATA = {};

async function loadData() {
    const res = await fetch('data.json');
    DATA = await res.json();
    renderAll();
}

// ===== RENDER SEMUA =====
function renderAll() {
    renderProfile();
    renderNav();
    renderAlbums();
    renderRandom('all'); // Render semua foto saat awal
    setupFilters();      // Aktifkan tombol filter
}

function renderProfile() {
    const p = DATA.profile;
    document.getElementById('profilePhoto').src = p.photo;
    document.getElementById('profileName').textContent = p.name;
    document.getElementById('profileBio').textContent = p.bio;

    const socialsEl = document.getElementById('socials');
    socialsEl.innerHTML = '';
    const icons = { tiktok: '🎵', whatsapp: '💬', instagram: '📸' };
    Object.entries(p.socials).forEach(([key, url]) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'social-btn';
        a.innerHTML = icons[key] || '🔗';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            showAlert(`Membuka ${key}...`);
            setTimeout(() => window.open(url, '_blank'), 600);
        });
        socialsEl.appendChild(a);
    });
}

function renderNav() {
    const nav = document.getElementById('navLinks');
    nav.innerHTML = '';
    DATA.albums.forEach(album => {
        const btn = document.createElement('div');
        btn.className = 'nav-link';
        btn.innerHTML = `<span>${album.name}</span>`;
        btn.addEventListener('click', () => {
            showAlert(`Album: ${album.name}`);
            showAlbumPhotos(album);
        });
        nav.appendChild(btn);
    });
}

function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    grid.innerHTML = '';
    DATA.albums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card glass-panel';
        card.innerHTML = `
      <img src="${album.photos[0]}" alt="${album.name}" />
      <div class="album-label">${album.name}</div>
    `;
        card.addEventListener('click', () => {
            showAlert(`Membuka album ${album.name}`);
            setTimeout(() => showAlbumPhotos(album), 400);
        });
        grid.appendChild(card);
    });
}

function renderRandom(category = 'all') {
    const grid = document.getElementById('randomGrid');
    grid.innerHTML = ''; // Kosongkan dulu

    // Filter foto berdasarkan kategori
    const filteredPhotos = category === 'all'
        ? DATA.randomPhotos
        : DATA.randomPhotos.filter(photo => photo.category === category);

    // Render foto yang sudah difilter
    filteredPhotos.forEach(photo => {
        const div = document.createElement('div');
        div.className = 'random-photo glass-panel';
        div.innerHTML = `<img src="${photo.src}" alt="photo" />`;
        div.addEventListener('click', () => openPopup(photo.src));
        grid.appendChild(div);
    });
}

// Fungsi untuk menangani klik tombol filter
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Hapus class 'active' dari semua tombol
            buttons.forEach(b => b.classList.remove('active'));
            // 2. Tambah class 'active' ke tombol yang diklik
            btn.classList.add('active');

            // 3. Tampilkan alert glass
            const categoryName = btn.textContent;
            showAlert(`Menampilkan: ${categoryName}`);

            // 4. Render ulang foto berdasarkan kategori
            renderRandom(btn.dataset.category);
        });
    });
}

// ===== TAMPILKAN FOTO ALBUM =====
function showAlbumPhotos(album) {
    // Ganti konten random grid dengan foto album (simple approach)
    const grid = document.getElementById('randomGrid');
    const title = document.querySelector('#randomSection .section-title');
    grid.innerHTML = '';
    title.textContent = album.name;
    album.photos.forEach(src => {
        const div = document.createElement('div');
        div.className = 'random-photo glass-panel';
        div.innerHTML = `<img src="${src}" alt="photo" />`;
        div.addEventListener('click', () => openPopup(src));
        grid.appendChild(div);
    });
    document.getElementById('randomSection').scrollIntoView({ behavior: 'smooth' });
}

// ===== POPUP =====
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popupImg');
const popupClose = document.getElementById('popupClose');

function openPopup(src) {
    popupImg.src = src;
    popup.classList.add('active');
}

popupClose.addEventListener('click', () => popup.classList.remove('active'));
popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.remove('active');
});

// ===== ALERT GLASS =====
const alertEl = document.getElementById('glassAlert');
let alertTimer;
function showAlert(text) {
    document.getElementById('alertText').textContent = text;
    alertEl.classList.add('show');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => alertEl.classList.remove('show'), 2000);
}

// ===== TOMBOL "LIHAT SAYA" =====
document.getElementById('seeMeBtn').addEventListener('click', () => {
    showAlert('Selamat menikmati ✨');
    document.getElementById('albumSection').scrollIntoView({ behavior: 'smooth' });
});

// ===== INIT =====
loadData();