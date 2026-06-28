// ===== PARTICLE NETWORK =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 191, 255, 0.15)';
        ctx.fill();
    });
    // koneksi garis
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 191, 255, ${0.04 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== AOS =====
AOS.init({ once: true, duration: 600 });

// ===== DEVICE DATA =====
const devices = [
    { name: 'Samsung A53', status: 'online', ping: '12ms', battery: '87%', signal: '4G' },
    { name: 'Xiaomi Redmi Note 10', status: 'offline', ping: '--', battery: '0%', signal: '--' },
    { name: 'Oppo Reno 8', status: 'online', ping: '8ms', battery: '63%', signal: '5G' },
];

function renderDevices(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.map(d => `
        <div class="device-item" data-aos="fade-up" data-aos-delay="100">
            <div class="info">
                <div class="name">📱 ${d.name}</div>
                <div class="detail">📡 ${d.ping} · 🔋 ${d.battery} · 📶 ${d.signal}</div>
            </div>
            <div class="status ${d.status === 'online' ? '' : 'offline'}">
                <span class="dot"></span> ${d.status === 'online' ? 'Online' : 'Offline'}
            </div>
        </div>
    `).join('');
}

renderDevices('deviceGrid', devices);
renderDevices('deviceGridAll', devices);

// ===== SEARCH =====
document.getElementById('searchDevice')?.addEventListener('input', function(e) {
    const q = e.target.value.toLowerCase();
    const filtered = devices.filter(d => d.name.toLowerCase().includes(q));
    renderDevices('deviceGridAll', filtered);
});

// ===== BOTTOM NAV =====
const navItems = document.querySelectorAll('.nav-item');
const pages = {
    pageHome: document.getElementById('pageHome'),
    pageDevice: document.getElementById('pageDevice'),
    pageControl: document.getElementById('pageControl'),
    pageMonitor: document.getElementById('pageMonitor'),
};

navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const pageId = item.dataset.page;
        Object.keys(pages).forEach(key => pages[key].classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        // Indicator
        const indicator = document.querySelector('.nav-indicator');
        const offset = index * 60 + 10;
        indicator.style.transform = `translateX(${offset}px)`;
    });
});

// ===== VIDEO CONTROLS =====
const video = document.getElementById('videoPlayer');
document.getElementById('playBtn')?.addEventListener('click', () => {
    if (video.paused) { video.play(); } else { video.pause(); }
});
document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (video.requestFullscreen) video.requestFullscreen();
});

// ===== CHART =====
if (document.getElementById('cpuChart')) {
    new Chart(document.getElementById('cpuChart'), {
        type: 'doughnut',
        data: { labels: ['Used', 'Free'], datasets: [{ data: [45, 55], backgroundColor: ['#00bfff', '#1a1a3a'] }] },
        options: { cutout: '70%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: true }
    });
    new Chart(document.getElementById('ramChart'), {
        type: 'doughnut',
        data: { labels: ['Used', 'Free'], datasets: [{ data: [62, 38], backgroundColor: ['#7b2ffc', '#1a1a3a'] }] },
        options: { cutout: '70%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: true }
    });
    new Chart(document.getElementById('batteryChart'), {
        type: 'doughnut',
        data: { labels: ['Used', 'Free'], datasets: [{ data: [87, 13], backgroundColor: ['#00e676', '#1a1a3a'] }] },
        options: { cutout: '70%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: true }
    });
}

// ===== CONTROL BUTTONS =====
document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        gsap.to(this, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 });
        const label = this.textContent.trim();
        alert(`Perintah ${label} dikirim ke target!`);
    });
});

// ===== TOGGLE =====
document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const label = this.closest('.toggle-item').querySelector('span').textContent;
        console.log(`${label} ${this.checked ? 'ON' : 'OFF'}`);
    });
});

// ===== COUNTER =====
document.getElementById('deviceCount').textContent = devices.filter(d => d.status === 'online').length;

console.log('ByVoid Dashboard Loaded!');
