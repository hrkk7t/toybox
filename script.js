// --- DOM Elements ---
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
const taskbarClock = document.querySelector('.taskbar-time'); 

// 各ウィンドウ
const wins = {
    readme: document.getElementById('readmeWindow'),
    contact: document.getElementById('contactWindow'),
    about: document.getElementById('aboutWindow'),
    work: document.getElementById('workWindow'),
    illust: document.getElementById('illustWindow'),
    main: document.getElementById('mainWindow')
};

// --- Global Functions ---
let maxZIndex = 100;
function bringToFront(el) {
    if (!el) return;
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Window Management ---
const openWindow = (win) => {
    if(!win) return;
    win.style.display = 'block';
    win.classList.remove('minimized');
    bringToFront(win);
    gsap.fromTo(win, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)"});
};

const closeWindow = (win) => {
    if(win) win.style.display = 'none';
};

// ボタン類のイベント登録
const setupWindowActions = (win, minBtnId, maxBtnId, closeBtnId) => {
    const minBtn = document.getElementById(minBtnId);
    const maxBtn = document.getElementById(maxBtnId);
    const closeBtn = document.getElementById(closeBtnId);

    if(minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); win.classList.add('minimized'); });
    if(maxBtn) maxBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        win.style.width = (win.style.width === '100%') ? '90%' : '100%'; 
    });
    if(closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win); });
};

setupWindowActions(wins.main, 'minBtn', 'maxBtn', 'closeBtn');
setupWindowActions(wins.about, 'aboutMinBtn', 'aboutMaxBtn', 'aboutCloseBtn');
setupWindowActions(wins.work, null, null, 'workCloseBtn');
setupWindowActions(wins.illust, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(wins.contact, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');
setupWindowActions(wins.readme, 'readmeMinBtn', 'readmeMaxBtn', 'readmeCloseBtn');

// --- Draggable System (クリックを邪魔しない修正版) ---
const setupDrag = (selector, handleSelector) => {
    document.querySelectorAll(selector).forEach(el => {
        const handle = el.querySelector(handleSelector);
        if(!handle) return;
        
        let isDragging = false;
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            // ボタン（最小化・閉じるなど）をクリックした時はドラッグを開始しない
            if (e.target.closest('.control-btn')) return;
            
            isDragging = true;
            el.classList.add('dragging');
            el.classList.add('moved');
            bringToFront(el);
            
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            el.style.position = 'fixed';
            el.style.margin = '0';
            el.style.transform = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = (initialX + dx) + 'px';
            el.style.top = (initialY + dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            el.classList.remove('dragging');
        });
    });
};

setupDrag('.draggable-window', '.window-header');

// --- Taskbar & Clock (確実に動く版) ---
function updateClock() {
    const clockEl = document.querySelector('.taskbar-time') || document.getElementById('taskbarClock');
    if (clockEl) {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Start Menu ---
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = startMenu.style.display;
        startMenu.style.display = (current === 'flex') ? 'none' : 'flex';
    });
}

document.addEventListener('click', (e) => {
    // スタートメニューの中身をクリックした時は閉じないようにする
    if (startMenu && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
    }
});

// スタートメニュー内のアイテムをクリック可能にする
document.querySelectorAll('#startMenu .menu-item, #startMenu li').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = item.id;
        if(targetId === 'menuTop') openWindow(wins.main);
        if(targetId === 'menuAbout') openWindow(wins.about);
        if(targetId === 'menuWork') openWindow(wins.work);
        if(targetId === 'menuContact') openWindow(wins.contact);
        startMenu.style.display = 'none';
    });
});

// --- Boot Sequence ---
async function runBootSequence() {
    if (!bootScreen) return;
    await wait(1000);
    bootScreen.classList.add('fade-out');
    setTimeout(() => { bootScreen.style.display = 'none'; }, 1000);
}
window.addEventListener('load', runBootSequence);

// --- Icons ---
document.getElementById('iconReadme')?.addEventListener('click', () => openWindow(wins.readme));
document.getElementById('iconContact')?.addEventListener('click', () => openWindow(wins.contact));
document.getElementById('iconAbout')?.addEventListener('click', () => openWindow(wins.about));
document.getElementById('iconWork')?.addEventListener('click', () => openWindow(wins.work));
