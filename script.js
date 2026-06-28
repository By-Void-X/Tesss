/* ==========================================================================
   ByVoid — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticles();
  initRipple();
  initBottomNav();
  initCounters();
  initDevices();
  initVideoPlayer();
  initSearchFilter();
  initControlButtons();
  initCharts();
  initAOSGSAP();
});

/* ----------------------------------------------------------------
   PRELOADER
---------------------------------------------------------------- */
function initPreloader(){
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => pre.classList.add('done'), 600);
  });
  // fallback in case load already fired
  setTimeout(() => pre.classList.add('done'), 2500);
}

/* ----------------------------------------------------------------
   PARTICLE BACKGROUND (canvas)
---------------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 700 ? 45 : 90;

  class Particle{
    constructor(){ this.reset(); }
    reset(){
      this.x = Math.random()*w;
      this.y = Math.random()*h;
      this.r = Math.random()*1.8 + 0.4;
      this.vx = (Math.random()-0.5)*0.35;
      this.vy = (Math.random()-0.5)*0.35;
      this.alpha = Math.random()*0.5 + 0.15;
    }
    update(){
      this.x += this.vx; this.y += this.vy;
      if(this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,191,255,${this.alpha})`;
      ctx.shadowColor = 'rgba(0,191,255,0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  }

  for(let i=0;i<COUNT;i++) particles.push(new Particle());

  function connect(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 110){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,191,255,${0.12 * (1 - dist/110)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ----------------------------------------------------------------
   RIPPLE EFFECT (delegated)
---------------------------------------------------------------- */
function initRipple(){
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.ripple');
    if(!target) return;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size/2) + 'px';
    circle.style.top = (e.clientY - rect.top - size/2) + 'px';
    target.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
}

/* ----------------------------------------------------------------
   BOTTOM NAVIGATION + PAGE ROUTING
---------------------------------------------------------------- */
function initBottomNav(){
  const navItems = document.querySelectorAll('.nav-item');
  const indicator = document.getElementById('navIndicator');
  const pages = document.querySelectorAll('.page');

  function moveIndicator(item){
    const navRect = item.parentElement.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = itemRect.left - navRect.left;
    indicator.style.transform = `translateX(${offset - 6}px)`;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      moveIndicator(item);

      const target = item.dataset.page;
      pages.forEach(p => p.classList.remove('active'));
      const targetPage = document.getElementById('page-' + target);
      targetPage.classList.add('active');

      // re-trigger AOS animations on new page
      if(window.AOS) setTimeout(() => AOS.refreshHard(), 60);

      // scale bounce animation via GSAP
      if(window.gsap){
        gsap.fromTo(item.querySelector('i'), {scale:0.7}, {scale:1.12, duration:.35, ease:'back.out(3)'});
      }
    });
  });

  // init indicator position
  window.addEventListener('load', () => moveIndicator(document.querySelector('.nav-item.active')));
  window.addEventListener('resize', () => moveIndicator(document.querySelector('.nav-item.active')));
}

/* ----------------------------------------------------------------
   ANIMATED COUNTERS (stat cards)
---------------------------------------------------------------- */
function initCounters(){
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    let current = 0;
    const step = Math.max(1, Math.round(target/40));
    const tick = () => {
      current += step;
      if(current >= target){ el.textContent = target; return; }
      el.textContent = current;
      requestAnimationFrame(() => setTimeout(tick, 16));
    };
    setTimeout(tick, 400);
  });
}

/* ----------------------------------------------------------------
   DEVICE DATA + RENDERING
---------------------------------------------------------------- */
const DEVICES = [
  { name:'Node Alpha-01', type:'Edge Server', status:'online', ping:'12ms', battery:'98%', signal:'Excellent', icon:'fa-server' },
  { name:'Sensor Beta-07', type:'IoT Sensor', status:'online', ping:'34ms', battery:'76%', signal:'Strong', icon:'fa-satellite-dish' },
  { name:'Cam Drone-X', type:'Surveillance', status:'warning', ping:'88ms', battery:'42%', signal:'Weak', icon:'fa-video' },
  { name:'Relay Gamma', type:'Network Relay', status:'online', ping:'9ms', battery:'100%', signal:'Excellent', icon:'fa-tower-broadcast' },
  { name:'Tracker Delta', type:'GPS Module', status:'offline', ping:'--', battery:'0%', signal:'None', icon:'fa-location-crosshairs' },
  { name:'Hub Core-9', type:'Central Hub', status:'online', ping:'5ms', battery:'89%', signal:'Excellent', icon:'fa-microchip' },
];

function deviceCardHTML(d){
  return `
  <div class="device-card glass hover-lift" data-status="${d.status}" data-name="${d.name.toLowerCase()}">
    <div class="device-card-top">
      <div class="device-icon"><i class="fa-solid ${d.icon}"></i></div>
      <div>
        <div class="device-name">${d.name}</div>
        <div class="device-type">${d.type}</div>
      </div>
    </div>
    <div class="device-status-row">
      <span class="status-dot ${d.status}"></span>
      <span>${d.status === 'online' ? 'Online' : d.status === 'warning' ? 'Warning' : 'Offline'}</span>
    </div>
    <div class="device-meta">
      <span><i class="fa-solid fa-bolt-lightning"></i>Ping: <b>${d.ping}</b></span>
      <span><i class="fa-solid fa-battery-three-quarters"></i>Batt: <b>${d.battery}</b></span>
      <span><i class="fa-solid fa-signal"></i>Sinyal: <b>${d.signal}</b></span>
      <span><i class="fa-solid fa-clock"></i>Sync: <b>Live</b></span>
    </div>
  </div>`;
}

function initDevices(){
  const homeGrid = document.getElementById('deviceGrid');
  const fullGrid = document.getElementById('deviceGridFull');
  const tag = document.getElementById('deviceCountTag');

  // Home: show first 4
  homeGrid.innerHTML = DEVICES.slice(0,4).map(deviceCardHTML).join('');
  fullGrid.innerHTML = DEVICES.map(deviceCardHTML).join('');

  const onlineCount = DEVICES.filter(d => d.status === 'online').length;
  tag.textContent = `${onlineCount} ACTIVE`;

  // slide-in animation for cards
  [...homeGrid.children, ...fullGrid.children].forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      card.style.transition = 'opacity .5s ease, transform .5s ease';
      card.style.opacity = 1;
      card.style.transform = 'translateX(0)';
    }, 80 * i);
  });

  // Status table for Monitor page
  const table = document.getElementById('statusTable');
  table.innerHTML = `
    <thead>
      <tr><th>Device</th><th>Type</th><th>Status</th><th>Ping</th><th>Battery</th></tr>
    </thead>
    <tbody>
      ${DEVICES.map(d => `
        <tr>
          <td>${d.name}</td>
          <td>${d.type}</td>
          <td><span class="pill ${d.status}">${d.status.toUpperCase()}</span></td>
          <td>${d.ping}</td>
          <td>${d.battery}</td>
        </tr>`).join('')}
    </tbody>`;
}

/* ----------------------------------------------------------------
   SEARCH + FILTER (Device page)
---------------------------------------------------------------- */
function initSearchFilter(){
  const input = document.getElementById('deviceSearch');
  const chips = document.querySelectorAll('.chip');
  const grid = document.getElementById('deviceGridFull');

  function applyFilter(){
    const query = input.value.trim().toLowerCase();
    const activeChip = document.querySelector('.chip.active').dataset.filter;
    [...grid.children].forEach(card => {
      const matchesText = card.dataset.name.includes(query);
      const matchesStatus = activeChip === 'all' || card.dataset.status === activeChip;
      card.style.display = (matchesText && matchesStatus) ? '' : 'none';
    });
  }

  input.addEventListener('input', applyFilter);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter();
    });
  });
}

/* ----------------------------------------------------------------
   CONTROL PAGE BUTTON FEEDBACK
---------------------------------------------------------------- */
function initControlButtons(){
  document.querySelectorAll('.btn-neon').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'RUNNING...';
      btn.style.opacity = '.7';
      setTimeout(() => {
        btn.textContent = 'DONE ✓';
        setTimeout(() => { btn.textContent = original; btn.style.opacity = '1'; }, 1400);
      }, 900);
    });
  });
}

/* ----------------------------------------------------------------
   VIDEO PLAYER (custom HTML5 controls)
---------------------------------------------------------------- */
function initVideoPlayer(){
  const video = document.getElementById('mainVideo');
  const wrapper = document.getElementById('videoWrapper');
  const centerPlay = document.getElementById('centerPlay');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressHandle = document.getElementById('progressHandle');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  function fmt(t){
    if(isNaN(t)) return '00:00';
    const m = Math.floor(t/60).toString().padStart(2,'0');
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function togglePlay(){
    if(video.paused){ video.play(); } else { video.pause(); }
  }

  centerPlay.addEventListener('click', togglePlay);
  playPauseBtn.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    wrapper.classList.add('playing');
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    centerPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
  });
  video.addEventListener('pause', () => {
    wrapper.classList.remove('playing');
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    centerPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
  });

  video.addEventListener('loadedmetadata', () => { durTime.textContent = fmt(video.duration); });
  video.addEventListener('timeupdate', () => {
    const pct = (video.currentTime / video.duration) * 100 || 0;
    progressFill.style.width = pct + '%';
    progressHandle.style.left = pct + '%';
    curTime.textContent = fmt(video.currentTime);
  });

  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
  });

  volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value / 100;
    video.muted = false;
    muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  });

  fullscreenBtn.addEventListener('click', () => {
    if(wrapper.requestFullscreen) wrapper.requestFullscreen();
    else if(wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
  });
}

/* ----------------------------------------------------------------
   CHART.JS — MONITOR PAGE
---------------------------------------------------------------- */
function initCharts(){
  if(!window.Chart) return;
  Chart.defaults.color = '#7e8b96';
  Chart.defaults.font.family = "'Share Tech Mono', monospace";

  const labels = Array.from({length:20}, (_,i) => i);

  function makeDataset(seed, max){
    return Array.from({length:20}, () => Math.floor(Math.random()*max*0.4 + seed));
  }

  function lineChart(ctx, color, dataArr, suffix){
    return new Chart(ctx, {
      type:'line',
      data:{
        labels,
        datasets:[{
          data:dataArr,
          borderColor:color,
          backgroundColor: hexToRgba(color, 0.12),
          borderWidth:2,
          fill:true,
          tension:0.4,
          pointRadius:0,
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        animation:{duration:600},
        plugins:{ legend:{display:false}, tooltip:{enabled:true, callbacks:{label:(c)=>c.parsed.y+suffix}} },
        scales:{
          x:{ display:false },
          y:{ grid:{color:'rgba(255,255,255,.05)'}, ticks:{callback:(v)=>v+suffix} }
        }
      }
    });
  }

  function hexToRgba(hex, alpha){
    const v = hex.replace('#','');
    const r = parseInt(v.substring(0,2),16), g = parseInt(v.substring(2,4),16), b = parseInt(v.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const cpuData = makeDataset(30, 60);
  const ramData = makeDataset(40, 50);
  const netData = makeDataset(10, 90);
  const battData = makeDataset(50, 40);

  const cpuChart = lineChart(document.getElementById('cpuChart'), '#00bfff', cpuData, '%');
  const ramChart = lineChart(document.getElementById('ramChart'), '#7b2ff7', ramData, '%');
  const netChart = lineChart(document.getElementById('netChart'), '#00ff9c', netData, 'Mb');
  const battChart = lineChart(document.getElementById('battChart'), '#ffb800', battData, '%');

  document.getElementById('cpuNow').textContent = cpuData[cpuData.length-1] + '%';
  document.getElementById('ramNow').textContent = ramData[ramData.length-1] + '%';
  document.getElementById('netNow').textContent = netData[netData.length-1] + ' Mb/s';
  document.getElementById('battNow').textContent = battData[battData.length-1] + '%';

  // Realtime simulation
  setInterval(() => {
    [
      {chart:cpuChart, data:cpuData, el:'cpuNow', max:60, base:30, suffix:'%'},
      {chart:ramChart, data:ramData, el:'ramNow', max:50, base:40, suffix:'%'},
      {chart:netChart, data:netData, el:'netNow', max:90, base:10, suffix:' Mb/s'},
      {chart:battChart, data:battData, el:'battNow', max:40, base:50, suffix:'%'},
    ].forEach(({chart, data, el, max, base, suffix}) => {
      data.shift();
      const val = Math.floor(Math.random()*max*0.4 + base);
      data.push(val);
      chart.update();
      document.getElementById(el).textContent = val + suffix;
    });
  }, 2200);
}

/* ----------------------------------------------------------------
   AOS + GSAP INIT
---------------------------------------------------------------- */
function initAOSGSAP(){
  if(window.AOS){
    AOS.init({ duration:800, once:true, easing:'ease-out-cubic', offset:40 });
  }

  if(window.gsap){
    gsap.from('.brand-logo-wrap', { y:-20, opacity:0, duration:1, ease:'bounce.out' });

    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        opacity:0, y:30, duration:.6, delay:i*0.08, ease:'power3.out'
      });
    });
  }
}
