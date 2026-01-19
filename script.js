// --- Elements ---
const mainWindow = document.getElementById('mainWindow');

// Icons
const iconTop = document.getElementById('iconTop');
const iconAbout = document.getElementById('iconAbout');
const iconWork = document.getElementById('iconWork');
const iconIllust = document.getElementById('iconIllust');
const iconContact = document.getElementById('iconContact');

// Sub Windows
const aboutWindow = document.getElementById('aboutWindow');
const workWindow = document.getElementById('workWindow');
const illustWindow = document.getElementById('illustWindow');
const contactWindow = document.getElementById('contactWindow');

// Buttons
const contactSendBtn = document.getElementById('contactSendBtn');
const aboutOkBtn = document.getElementById('aboutOkBtn');
const gameStartBtn = document.getElementById('gameStartBtn');

// Popup Elements
const sentPopup = document.getElementById('sentPopup');
const sentCloseX = document.getElementById('sentCloseX');
const sentBtnOk = document.getElementById('sentBtnOk');

// RPG Elements
const rpgOverlay = document.getElementById('rpgOverlay');
const rpgEnemy = document.getElementById('rpgEnemy');
const rpgText = document.getElementById('rpgText');
const rpgDamage = document.getElementById('rpgDamage');
const cmdAttack = document.getElementById('cmdAttack');
const cmdSkill = document.getElementById('cmdSkill');
const cmdRun = document.getElementById('cmdRun');

// --- Functions ---
let maxZIndex = 100;
function bringToFront(el) {
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

const openWindow = (win) => {
    win.style.display = 'block';
    win.classList.remove('minimized');
    bringToFront(win);
    gsap.fromTo(win, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)"});
};

const closeWindow = (win) => {
    win.style.display = 'none';
};

const closeAllPopups = () => {
    sentPopup.style.display = 'none';
};

const setupWindowActions = (win, minBtnId, maxBtnId, closeBtnId) => {
    const minBtn = document.getElementById(minBtnId);
    const maxBtn = document.getElementById(maxBtnId);
    const closeBtn = document.getElementById(closeBtnId);

    if(minBtn) {
        minBtn.addEventListener('click', () => {
            win.classList.add('minimized');
        });
    }

    if(maxBtn) {
        maxBtn.addEventListener('click', () => {
            if (win.classList.contains('minimized')) {
                win.classList.remove('minimized');
            } else {
                win.style.width = (win.style.width === '100%') ? '90%' : '100%';
            }
        });
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeWindow(win);
        });
    }
};

setupWindowActions(mainWindow, 'minBtn', 'maxBtn', 'closeBtn');
setupWindowActions(aboutWindow, 'aboutMinBtn', 'aboutMaxBtn', 'aboutCloseBtn');
setupWindowActions(workWindow, 'workMinBtn', 'workMaxBtn', 'workCloseBtn');
setupWindowActions(illustWindow, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(contactWindow, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');


// --- Drag Functionality ---
const setupDrag = (selector, handleSelector = null) => {
    document.querySelectorAll(selector).forEach(el => {
        const handle = handleSelector ? el.querySelector(handleSelector) : el;
        let isDragging = false;
        let startX, startY;

        const startDrag = (e, clientX, clientY) => {
            if (window.innerWidth <= 600 && el.classList.contains('draggable-icon')) return;
            if (e.target.closest('.no-drag')) return;

            isDragging = true;
            el.classList.add('dragging');
            el.classList.add('moved');
            bringToFront(el);
            const rect = el.getBoundingClientRect();
            startX = clientX;
            startY = clientY;
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.transform = 'none';
            el.style.margin = '0';
        };

        const moveDrag = (e, clientX, clientY) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = clientX - startX;
            const dy = clientY - startY;
            el.style.left = (parseFloat(el.style.left) + dx) + 'px';
            el.style.top = (parseFloat(el.style.top) + dy) + 'px';
            startX = clientX;
            startY = clientY;
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                el.classList.remove('dragging');
            }
        };

        handle.addEventListener('mousedown', (e) => startDrag(e, e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => moveDrag(e, e.clientX, e.clientY));
        window.addEventListener('mouseup', endDrag);

        handle.addEventListener('touchstart', (e) => startDrag(e, e.touches[0].clientX, e.touches[0].clientY), { passive: false });
        window.addEventListener('touchmove', (e) => moveDrag(e, e.touches[0].clientX, e.touches[0].clientY), { passive: false });
        window.addEventListener('touchend', endDrag);
        
        el.addEventListener('mousedown', () => bringToFront(el));
        el.addEventListener('touchstart', () => bringToFront(el), { passive: true });
    });
};

setupDrag('.draggable-window', '.window-header');
setupDrag('.draggable-icon');


// --- Tab Functionality ---
const propTabs = document.querySelectorAll('.prop-tab');
const propContents = document.querySelectorAll('.prop-content');

propTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        propTabs.forEach(t => t.classList.remove('active'));
        propContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
});


// --- Icon Click Events ---
iconTop.addEventListener('click', () => openWindow(mainWindow));
iconAbout.addEventListener('click', () => openWindow(aboutWindow));
iconWork.addEventListener('click', () => openWindow(workWindow));
iconIllust.addEventListener('click', () => openWindow(illustWindow));
iconContact.addEventListener('click', () => openWindow(contactWindow));


// --- Button Events ---
aboutOkBtn.addEventListener('click', () => closeWindow(aboutWindow));
contactSendBtn.addEventListener('click', () => {
    closeWindow(contactWindow);
    sentPopup.style.display = 'flex';
});
sentCloseX.addEventListener('click', closeAllPopups);
sentBtnOk.addEventListener('click', closeAllPopups);


// --- RPG Battle Logic ---
gameStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    rpgOverlay.style.display = 'block';
    typeText("あ！　やせいの　バグが　とびだしてきた！");
});

// 文字を1文字ずつ表示する関数
function typeText(text) {
    rpgText.textContent = "";
    let i = 0;
    const speed = 50; 
    function type() {
        if (i < text.length) {
            rpgText.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// たたかう
cmdAttack.addEventListener('click', () => {
    typeText("TOYBOXの　こうげき！　しかし　バグは　ビクともしない！");
});

// スキル（デバッグ）
cmdSkill.addEventListener('click', () => {
    typeText("TOYBOXは　デバッグツールを　きどうした！");
    setTimeout(() => {
        // ダメージ演出
        gsap.to(rpgDamage, {opacity: 1, y: -50, duration: 0.5, onComplete: () => {
            gsap.to(rpgDamage, {opacity: 0, duration: 0.2});
        }});
        
        // 敵の消滅
        gsap.to(rpgEnemy, {scale: 0, opacity: 0, rotation: 360, duration: 1, delay: 0.5});
        
        setTimeout(() => {
            typeText("バグを　かんぜんに　しゅうせいした！　YOU WIN!");
            setTimeout(() => {
                rpgOverlay.style.display = 'none';
                // リセット
                gsap.set(rpgEnemy, {scale: 1, opacity: 1, rotation: 0});
            }, 3000);
        }, 1500);
    }, 1000);
});

// にげる
cmdRun.addEventListener('click', () => {
    typeText("TOYBOXは　デスクトップへ　にげだした！");
    setTimeout(() => {
        rpgOverlay.style.display = 'none';
    }, 1500);
});