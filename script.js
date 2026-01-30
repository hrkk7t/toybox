// --- DOM Elements ---
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
const taskbarClock = document.getElementById('taskbarClock'); // HTMLのIDと一致

// 各ウィンドウをオブジェクトで管理
const wins = {
    main: document.getElementById('mainWindow'),
    about: document.getElementById('aboutWindow'),
    work: document.getElementById('workWindow'),
    illust: document.getElementById('illustWindow'),
    contact: document.getElementById('contactWindow'),
    readme: document.getElementById('readmeWindow')
};

// --- Global Functions ---
let maxZIndex = 1000; // タスクバーが9999なので、それ以下で前面に
function bringToFront(el) {
    if (!el) return;
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

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

// ウィンドウ操作ボタンの設定
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

// 全ウィンドウに適用
setupWindowActions(wins.main, 'minBtn', 'maxBtn', 'closeBtn');
setupWindowActions(wins.about, 'aboutMinBtn', 'aboutMaxBtn', 'aboutCloseBtn');
setupWindowActions(wins.work, null, null, 'workCloseBtn');
setupWindowActions(wins.illust, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(wins.contact, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');
setupWindowActions(wins.readme, 'readmeMinBtn', 'readmeMaxBtn', 'readmeCloseBtn');

// --- Draggable System (修正版) ---
const setupDrag = (selector, handleSelector) => {
    document.querySelectorAll(selector).forEach(el => {
        const handle = el.querySelector(handleSelector) || el;
        
        let isDragging = false;
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn') || e.target.closest('.no-drag')) return;
            
            isDragging = true;
            bringToFront(el);
            
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            el.style.margin = "0";
            el.style.transform = "none";
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = (initialX + dx) + 'px';
            el.style.top = (initialY + dy) + 'px';
        });

        window.addEventListener('mouseup', () => { isDragging = false; });
    });
};

setupDrag('.draggable-window', '.window-header');
setupDrag('.draggable-icon');

// --- Clock ---
function updateClock() {
    if (taskbarClock) {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        taskbarClock.textContent = `${h}:${m}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Start Menu & Shutdown ---
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isNone = startMenu.style.display === 'none';
        startMenu.style.display = isNone ? 'flex' : 'none';
    });
}

document.addEventListener('click', (e) => {
    if (startMenu && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
    }
});

// スタートメニューの中身
document.querySelectorAll('.start-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const id = item.id;
        if(id === 'menuTop') openWindow(wins.main);
        if(id === 'menuAbout') openWindow(wins.about);
        if(id === 'menuWork') openWindow(wins.work);
        if(id === 'menuIllust') openWindow(wins.illust);
        if(id === 'menuContact') openWindow(wins.contact);
        if(id === 'menuShutdown') location.reload();
        startMenu.style.display = 'none';
    });
});

// --- Danger / BSOD ---
let dangerCount = 0;
document.getElementById('iconDanger')?.addEventListener('click', () => {
    dangerCount++;
    if(dangerCount < 3) alert("システムファイルに触らないでください。");
    else {
        document.getElementById('bsodScreen').style.display = 'block';
        let p = 0;
        const itv = setInterval(() => {
            p += 5;
            document.getElementById('bsodPercent').textContent = p;
            if(p >= 100) { clearInterval(itv); location.reload(); }
        }, 100);
    }
});

// --- Boot Sequence ---
window.addEventListener('load', () => {
    const boot = document.getElementById('bootScreen');
    const container = document.getElementById('bootContainer');
    const msgs = ["System Initializing...", "Loading TOYBOX.exe...", "User Verified."];
    
    msgs.forEach((m, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.textContent = "> " + m;
            container.appendChild(div);
        }, i * 400);
    });

    setTimeout(() => {
        boot.style.opacity = '0';
        setTimeout(() => boot.style.display = 'none', 1000);
    }, 2000);
});

// --- Icon Click Events ---
document.getElementById('iconTop')?.addEventListener('click', () => openWindow(wins.main));
document.getElementById('iconAbout')?.addEventListener('click', () => openWindow(wins.about));
document.getElementById('iconWork')?.addEventListener('click', () => openWindow(wins.work));
document.getElementById('iconIllust')?.addEventListener('click', () => openWindow(wins.illust));
document.getElementById('iconContact')?.addEventListener('click', () => openWindow(wins.contact));
document.getElementById('iconReadme')?.addEventListener('click', () => openWindow(wins.readme));

// RPG起動
document.getElementById('gameStartBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('rpgOverlay').style.display = 'block';
});
