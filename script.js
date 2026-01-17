// --- Elements ---
const mainWindow = document.getElementById('mainWindow');
const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');
const closeBtn = document.getElementById('closeBtn');

// About Window Elements
const aboutWindow = document.getElementById('aboutWindow');
const aboutCloseBtn = document.getElementById('aboutCloseBtn');
const aboutOkBtn = document.getElementById('aboutOkBtn');
const propTabs = document.querySelectorAll('.prop-tab');
const propContents = document.querySelectorAll('.prop-content');

// New Windows Elements (WORK, ILLUST, CONTACT)
const workWindow = document.getElementById('workWindow');
const workCloseBtn = document.getElementById('workCloseBtn');

const illustWindow = document.getElementById('illustWindow');
const illustCloseBtn = document.getElementById('illustCloseBtn');

const contactWindow = document.getElementById('contactWindow');
const contactCloseBtn = document.getElementById('contactCloseBtn');
const contactSendBtn = document.getElementById('contactSendBtn');


// Icons
const iconAbout = document.getElementById('iconAbout');
const iconWork = document.getElementById('iconWork');
const iconIllust = document.getElementById('iconIllust');
const iconContact = document.getElementById('iconContact');

// Popup Elements
const customPopup = document.getElementById('customPopup');
const popupCloseX = document.getElementById('popupCloseX');
const popupBtnSend = document.getElementById('popupBtnSend');
const popupBtnCancel = document.getElementById('popupBtnCancel');
const sentPopup = document.getElementById('sentPopup');
const sentCloseX = document.getElementById('sentCloseX');
const sentBtnOk = document.getElementById('sentBtnOk');


// --- Functions ---
const closeAllPopups = () => {
    customPopup.style.display = 'none';
    sentPopup.style.display = 'none';
};

// Z-index管理
let maxZIndex = 100;
function bringToFront(el) {
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

// 汎用ウィンドウオープナー
const openWindow = (win) => {
    win.style.display = 'block';
    win.classList.remove('minimized');
    bringToFront(win);
    gsap.fromTo(win, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)"});
};

const closeWindow = (win) => {
    win.style.display = 'none';
};


// --- Drag Functionality (Touch対応 & スマホメニュー除外) ---
const setupDrag = (selector, handleSelector = null) => {
    document.querySelectorAll(selector).forEach(el => {
        const handle = handleSelector ? el.querySelector(handleSelector) : el;
        
        let isDragging = false;
        let startX, startY;

        // --- Mouse Events ---
        handle.addEventListener('mousedown', (e) => {
            if (window.innerWidth <= 600 && el.classList.contains('draggable-icon')) return;
            if (e.target.closest('.no-drag')) return;

            isDragging = true;
            el.classList.add('dragging');
            el.classList.add('moved');
            bringToFront(el);

            const rect = el.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.transform = 'none';
            el.style.margin = '0';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = (parseFloat(el.style.left) + dx) + 'px';
            el.style.top = (parseFloat(el.style.top) + dy) + 'px';
            startX = e.clientX;
            startY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                el.classList.remove('dragging');
            }
        });

        // --- Touch Events ---
        handle.addEventListener('touchstart', (e) => {
            if (window.innerWidth <= 600 && el.classList.contains('draggable-icon')) return;
            if (e.target.closest('.no-drag')) return;
            
            isDragging = true;
            el.classList.add('dragging');
            el.classList.add('moved');
            bringToFront(el);

            const rect = el.getBoundingClientRect();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.transform = 'none';
            el.style.margin = '0';
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); 
            
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            el.style.left = (parseFloat(el.style.left) + dx) + 'px';
            el.style.top = (parseFloat(el.style.top) + dy) + 'px';
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                el.classList.remove('dragging');
            }
        });
        
        el.addEventListener('mousedown', () => bringToFront(el));
        el.addEventListener('touchstart', () => bringToFront(el), { passive: true });
    });
};

setupDrag('.draggable-window', '.window-header');
setupDrag('.draggable-icon');


// --- Tab Functionality ---
propTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        propTabs.forEach(t => t.classList.remove('active'));
        propContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
});


// --- Icon Click Events (Open Windows) ---
iconAbout.addEventListener('click', () => openWindow(aboutWindow));
iconWork.addEventListener('click', () => openWindow(workWindow));
iconIllust.addEventListener('click', () => openWindow(illustWindow));
iconContact.addEventListener('click', () => openWindow(contactWindow));


// --- Window Control Events ---
// Main Window
closeBtn.addEventListener('click', () => customPopup.style.display = 'flex');
minBtn.addEventListener('click', () => mainWindow.classList.add('minimized'));
maxBtn.addEventListener('click', () => {
    if (mainWindow.classList.contains('minimized')) {
        mainWindow.classList.remove('minimized');
    } else {
        mainWindow.style.width = (mainWindow.style.width === '100%') ? '90%' : '100%';
    }
});

// Close Buttons for Sub Windows
aboutCloseBtn.addEventListener('click', () => closeWindow(aboutWindow));
aboutOkBtn.addEventListener('click', () => closeWindow(aboutWindow));

workCloseBtn.addEventListener('click', () => closeWindow(workWindow));
illustCloseBtn.addEventListener('click', () => closeWindow(illustWindow));

contactCloseBtn.addEventListener('click', () => closeWindow(contactWindow));
contactSendBtn.addEventListener('click', () => {
    closeWindow(contactWindow);
    sentPopup.style.display = 'flex'; // 送信完了ポップアップを出す
});


// Popups
popupCloseX.addEventListener('click', closeAllPopups);
popupBtnCancel.addEventListener('click', closeAllPopups);
popupBtnSend.addEventListener('click', () => {
    customPopup.style.display = 'none';
    sentPopup.style.display = 'flex';
});
sentCloseX.addEventListener('click', closeAllPopups);
sentBtnOk.addEventListener('click', closeAllPopups);