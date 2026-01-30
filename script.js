// --- Start Menu Control ---
// 初期状態を明示的に指定してトグルが効くようにします
startMenu.style.display = 'none';

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (startMenu.style.display === 'none') {
        startMenu.style.display = 'flex';
        startBtn.classList.add('active');
    } else {
        startMenu.style.display = 'none';
        startBtn.classList.remove('active');
    }
});

// メニューの外をクリックしたら閉じる
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
        startBtn.classList.remove('active');
    }
});

// メニュー項目の動作
const menuActions = {
    'menuTop': mainWindow,
    'menuAbout': aboutWindow,
    'menuWork': workWindow,
    'menuIllust': illustWindow,
    'menuContact': contactWindow
};

Object.keys(menuActions).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', () => {
            openWindow(menuActions[id]);
            startMenu.style.display = 'none';
            startBtn.classList.remove('active');
        });
    }
});

// --- Clock System ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    if (taskbarClock) {
        taskbarClock.textContent = timeString;
    }
}
setInterval(updateClock, 1000);
updateClock();
