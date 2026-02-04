// 1. 倒计时核心逻辑
function updateCountdown() {
    const targetDate = new Date('2026-02-17T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
}

// 2. 风格切换函数
function changeCountdownTheme(themeName) {
    const content = document.getElementById('countdown-main-content');
    // 移除所有旧主题类
    content.className = 'countdown-content theme-' + themeName;
    // 关闭菜单
    document.getElementById('countdown-menu').classList.remove('show');
    // 保存选择到本地存储
    localStorage.setItem('countdown-theme', themeName);

    // 如果是金耀风格，启动特效
    if (themeName === 'golden') {
        startGoldenEffect();
    } else {
        stopGoldenEffect();
    }
}

function toggleCountdownMenu() {
    document.getElementById('countdown-menu').classList.toggle('show');
}

// 3. 金耀特效：飘落的“福”字
let goldenInterval;
function startGoldenEffect() {
    const container = document.getElementById('fu-container');
    if (!container) return;
    stopGoldenEffect();
    goldenInterval = setInterval(() => {
        const fu = document.createElement('div');
        fu.className = 'fu-item';
        fu.innerText = '福';
        fu.style.left = Math.random() * 100 + '%';
        container.appendChild(fu);
        setTimeout(() => fu.remove(), 3000);
    }, 500);
}

function stopGoldenEffect() {
    clearInterval(goldenInterval);
    const container = document.getElementById('fu-container');
    if (container) container.innerHTML = '';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateCountdown, 1000);
    const savedTheme = localStorage.getItem('countdown-theme') || 'traditional';
    changeCountdownTheme(savedTheme);
});