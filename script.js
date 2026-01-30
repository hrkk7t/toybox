// --- DOM Elements ---
const mainWindow = document.getElementById('mainWindow');
const aboutWindow = document.getElementById('aboutWindow');
const workWindow = document.getElementById('workWindow');
const illustWindow = document.getElementById('illustWindow');
const contactWindow = document.getElementById('contactWindow');
const readmeWindow = document.getElementById('readmeWindow');

const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
// CSSで新しく作ったクラス名に合わせて取得
const taskbarClock = document.querySelector('.taskbar-time'); 

const bootScreen = document.getElementById('bootScreen');
const bootContainer = document.getElementById('bootContainer');

// --- Global Functions ---
let maxZIndex = 100;
function bringToFront(el) {
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

// 各ウィンドウのアクション設定
setupWindowActions(mainWindow, 'minBtn', 'maxBtn', 'closeBtn');
setupWindowActions(aboutWindow, 'aboutMinBtn', 'aboutMaxBtn', 'aboutCloseBtn');
setupWindowActions(workWindow, null, null, 'workCloseBtn');
setupWindowActions(illustWindow, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(contactWindow, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');
setupWindowActions(readmeWindow, 'readmeMinBtn', 'readmeMaxBtn', 'readmeCloseBtn');

// --- Draggable System ---
const setupDrag = (selector, handleSelector = null) => {
    document.querySelectorAll(selector).forEach(el => {
        const handle = handleSelector ? el.querySelector(handleSelector) : el;
        if(!handle) return;
        
        let isDragging = false;
        let startX, startY;

        const startDrag = (e, clientX, clientY) => {
            if (window.innerWidth <= 600) return;
            if (e.target.closest('.control-btn')) return;

            isDragging = true;
            el.classList.add('dragging');
            el.classList.add('moved');
            bringToFront(el);
            
            const rect = el.getBoundingClientRect();
            startX = clientX - rect.left;
            startY = clientY - rect.top;
            
            el.style.position = 'fixed';
            el.style.margin = '0';
            el.style.transform = 'none';
        };

        const moveDrag = (e, clientX, clientY) => {
            if (!isDragging) return;
            el.style.left = (clientX - startX) + 'px';
            el.style.top = (clientY - startY) + 'px';
        };

        handle.addEventListener('mousedown', (e) => startDrag(e, e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => moveDrag(e, e.clientX, e.clientY));
        window.addEventListener('mouseup', () => { isDragging = false; el.classList.remove('dragging'); });
    });
};

setupDrag('.draggable-window', '.window-header');

// --- Taskbar & Clock ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (taskbarClock) {
        taskbarClock.textContent = `${hours}:${minutes}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Start Menu ---
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = startMenu.style.display === 'flex';
        startMenu.style.display = isVisible ? 'none' : 'flex';
    });
}

document.addEventListener('click', () => {
    if (startMenu) startMenu.style.display = 'none';
});

// --- Boot Sequence ---
async function runBootSequence() {
    const bootMessages = ["System Check...", "Memory OK", "Welcome to TOYBOX"];
    for (let msg of bootMessages) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = "> " + msg;
        bootContainer.appendChild(line);
        await wait(300);
    }
    await wait(500);
    bootScreen.classList.add('fade-out');
    setTimeout(() => { bootScreen.style.display = 'none'; }, 1000);
}
window.addEventListener('load', runBootSequence);

// --- Icon Events ---
document.getElementById('iconReadme')?.addEventListener('click', () => openWindow(readmeWindow));
document.getElementById('iconContact')?.addEventListener('click', () => openWindow(contactWindow));
document.getElementById('iconAbout')?.addEventListener('click', () => openWindow(aboutWindow));
document.getElementById('iconWork')?.addEventListener('click', () => openWindow(workWindow));
