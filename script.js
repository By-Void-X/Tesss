* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
    background: #090909;
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
}

/* Particle Canvas */
#particleCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

/* App */
#app {
    position: relative;
    z-index: 1;
    max-width: 480px;
    margin: 0 auto;
    padding: 16px 16px 80px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* HEADER */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    margin-bottom: 16px;
    animation: fadeDown 0.8s ease forwards;
}

.logo h1 {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #00bfff, #7b2ffc, #00bfff);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 4s ease-in-out infinite, float 3s ease-in-out infinite;
    letter-spacing: 0.06em;
}

@keyframes shine {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
}
@keyframes fadeDown {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
}

.logo .glow-line {
    display: block;
    width: 40px;
    height: 2px;
    background: #00bfff;
    box-shadow: 0 0 20px #00bfff;
    margin-top: 4px;
    border-radius: 10px;
}

.status-badge {
    font-size: 11px;
    color: #00e676;
    background: rgba(0, 230, 118, 0.1);
    padding: 4px 12px;
    border-radius: 30px;
    border: 1px solid rgba(0, 230, 118, 0.2);
}
.status-badge i {
    font-size: 8px;
    margin-right: 4px;
    color: #00e676;
    animation: pulse 1.5s infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
}

.version {
    font-size: 11px;
    color: #333;
    margin-left: 10px;
}

/* CARDS */
.card {
    background: rgba(20, 20, 40, 0.6);
    backdrop-filter: blur(16px);
    border-radius: 20px;
    padding: 18px 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    transition: 0.3s ease;
}
.card:hover {
    border-color: rgba(0, 191, 255, 0.2);
    box-shadow: 0 8px 40px rgba(0, 191, 255, 0.08);
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.card-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: #ccc;
    letter-spacing: 0.04em;
}
.card-header h2 i {
    color: #00bfff;
    margin-right: 8px;
}
.badge {
    background: #00bfff;
    color: #090909;
    padding: 2px 12px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 700;
}

/* VIDEO */
.video-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0, 191, 255, 0.15);
}
.video-wrapper video {
    width: 100%;
    display: block;
    border-radius: 12px;
}

/* DEVICE GRID */
.device-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.device-item {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 14px;
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 3px solid #00bfff;
    transition: 0.3s;
    animation: slideUp 0.5s ease forwards;
}
.device-item:hover {
    background: rgba(0, 191, 255, 0.05);
}
.device-item .info .name {
    font-weight: 600;
    font-size: 14px;
}
.device-item .info .detail {
    font-size: 11px;
    color: #888;
}
.device-item .status {
    font-size: 12px;
    color: #00e676;
}
.device-item .status .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #00e676;
    border-radius: 50%;
    margin-right: 4px;
    animation: pulse 1.5s infinite;
}

/* CONTROL */
.control-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}
.ctrl-btn {
    padding: 14px 0;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.ctrl-btn:hover { transform: scale(1.02); }
.ctrl-btn:active { transform: scale(0.95); }
.ctrl-btn.lock { background: rgba(211, 47, 47, 0.2); color: #ff6b6b; }
.ctrl-btn.ping { background: rgba(255, 87, 34, 0.2); color: #ff8a65; }
.ctrl-btn.screenshot { background: rgba(255, 152, 0, 0.2); color: #ffb74d; }
.ctrl-btn.camera { background: rgba(123, 47, 252, 0.2); color: #b388ff; }

.toggle-grid {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    gap: 12px;
}
.toggle-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    padding: 10px 14px;
    border-radius: 12px;
}
.switch {
    position: relative;
    width: 42px;
    height: 24px;
}
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2a2a4a;
    transition: 0.3s;
    border-radius: 30px;
}
.slider::before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    transition: 0.3s;
    border-radius: 50%;
}
.switch input:checked + .slider {
    background: #00bfff;
}
.switch input:checked + .slider::before {
    transform: translateX(18px);
}

/* MONITOR CHART */
.chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
}
.chart-item {
    background: rgba(0, 0, 0, 0.3);
    padding: 12px 8px;
    border-radius: 14px;
    text-align: center;
}
.chart-item canvas {
    max-width: 100%;
    height: 60px;
}
.chart-item p {
    font-size: 10px;
    color: #888;
    margin-top: 4px;
}

/* SEARCH */
.search-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 14px;
    margin-bottom: 16px;
}
.search-input::placeholder {
    color: #555;
}

/* BOTTOM NAV */
#bottomNav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    background: rgba(10, 10, 20, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    display: flex;
    justify-content: space-around;
    padding: 8px 0 12px;
    z-index: 100;
}
.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
    color: #555;
    cursor: pointer;
    transition: 0.3s;
    padding: 4px 12px;
    position: relative;
}
.nav-item i {
    font-size: 20px;
    margin-bottom: 2px;
}
.nav-item.active {
    color: #00bfff;
}
.nav-item.active i {
    text-shadow: 0 0 20px rgba(0, 191, 255, 0.4);
}
.nav-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: #00bfff;
    border-radius: 10px;
    transition: 0.3s;
    box-shadow: 0 0 20px #00bfff;
}

/* PAGE */
.page {
    display: none;
    animation: fadeUp 0.4s ease forwards;
}
.page.active {
    display: block;
}
@keyframes fadeUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE */
@media (max-width: 480px) {
    #app { padding: 12px 12px 80px; }
    .chart-grid { grid-template-columns: 1fr 1fr; }
}
