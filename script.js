document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 要素の取得 ---
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    const taskbarClock = document.getElementById('taskbarClock');
    const bsodScreen = document.getElementById('bsodScreen');
    const bsodPercent = document.getElementById('bsodPercent');

    // ウィンドウ
    const wins = {
        top: document.getElementById('mainWindow'),
        about: document.getElementById('aboutWindow'),
        work: document.getElementById('workWindow'),
        illust: document.getElementById('illustWindow'),
        contact: document.getElementById('contactWindow'),
        readme: document.getElementById('readmeWindow')
    };

    // ギャラリーデータ (画像が表示されない問題を解決)
    const galleryData = [
        { src: 'images/illust1.png', title: 'Character Design 01' },
        { src: 'images/illust2.png', title: 'Background Concept' },
        { src: 'images/illust3.png', title: 'Pixel Art Work' }
    ];
    let galleryIdx = 0;

    let maxZ = 1000;

    // --- 2. 共通関数 ---
    const bringToFront = (win) => {
        if (!win) return;
        maxZ++;
        win.style.zIndex = maxZ;
    };

    const openWin = (win) => {
        if (!win) return;
        win.style.display = 'block';
        bringToFront(win);
        gsap.fromTo(win, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 });
        if (win.id === 'illustWindow') updateGallery();
    };

    const closeWin = (win) => { if (win) win.style.display = 'none'; };

    // --- 3. ギャラリー制御 ---
    const updateGallery = () => {
        const img = document.getElementById('galleryImg');
        const title = document.getElementById('galleryTitle');
        const count = document.getElementById('galleryCounter');
        if (img && galleryData[galleryIdx]) {
            img.src = galleryData[galleryIdx].src;
            title.textContent = galleryData[galleryIdx].title;
            count.textContent = `${galleryIdx + 1}/${galleryData.length}`;
        }
    };

    document.getElementById('galleryNextBtn')?.addEventListener('click', () => {
        galleryIdx = (galleryIdx + 1) % galleryData.length;
        updateGallery();
    });
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => {
        galleryIdx = (galleryIdx - 1 + galleryData.length) % galleryData.length;
        updateGallery();
    });

    // --- 4. アイコンイベント (DANGER含む) ---
    const setupIcon = (id, win) => {
        document.getElementById(id)?.addEventListener('click', () => openWin(win));
    };
    setupIcon('iconTop', wins.top);
    setupIcon('iconAbout', wins.about);
    setupIcon('iconWork', wins.work);
    setupIcon('iconIllust', wins.illust);
    setupIcon('iconContact', wins.contact);
    setupIcon('iconReadme', wins.readme);

    let dangerCount = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dangerCount++;
        if (dangerCount < 3) {
            alert(`SYSTEM WARNING: Unauthorized Access Attempt (${dangerCount}/3)`);
        } else {
            bsodScreen.style.display = 'block';
            let p = 0;
            const timer = setInterval(() => {
                p += Math.floor(Math.random() * 10);
                if (p > 100) p = 100;
                bsodPercent.textContent = p;
                if (p >= 100) { clearInterval(timer); location.reload(); }
            }, 100);
        }
    });

    // --- 5. スタートメニュー ---
    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
    });

    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'menuTop') openWin(wins.top);
            if (item.id === 'menuAbout') openWin(wins.about);
            if (item.id === 'menuWork') openWin(wins.work);
            if (item.id === 'menuIllust') openWin(wins.illust);
            if (item.id === 'menuContact') openWin(wins.contact);
            if (item.id === 'menuShutdown') location.reload();
            startMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', () => { startMenu.style.display = 'none'; });

    // --- 6. 時計 ---
    const updateClock = () => {
        if (!taskbarClock) return;
        const d = new Date();
        taskbarClock.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
    };
    setInterval(updateClock, 1000);
    updateClock();

    // --- 7. ドラッグ & ウィンドウ操作 ---
    const makeDraggable = (win, headerId, closeId) => {
        const header = document.getElementById(headerId);
        if (!header) return;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn')) return;
            bringToFront(win);
            let shiftX = e.clientX - win.getBoundingClientRect().left;
            let shiftY = e.clientY - win.getBoundingClientRect().top;

            win.style.margin = "0";
            win.style.transform = "none";

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) { moveAt(event.clientX, event.clientY); }
            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = () => { document.removeEventListener('mousemove', onMouseMove); };
        });

        document.getElementById(closeId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWin(win);
        });
    };

    makeDraggable(wins.top, 'mainHeader', 'closeBtn');
    makeDraggable(wins.about, 'aboutHeader', 'aboutCloseBtn');
    makeDraggable(wins.work, 'workHeader', 'workCloseBtn');
    makeDraggable(wins.illust, 'illustHeader', 'illustCloseBtn');
    makeDraggable(wins.contact, 'contactHeader', 'contactCloseBtn');
    makeDraggable(wins.readme, 'readmeHeader', 'readmeCloseBtn');
});
