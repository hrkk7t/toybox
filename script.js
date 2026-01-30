document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 各要素の取得 ---
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    const taskbarClock = document.getElementById('taskbarClock');

    // ウィンドウ要素
    const winMain = document.getElementById('mainWindow');
    const winAbout = document.getElementById('aboutWindow');
    const winWork = document.getElementById('workWindow');
    const winIllust = document.getElementById('illustWindow');
    const winContact = document.getElementById('contactWindow');
    const winReadme = document.getElementById('readmeWindow');

    let maxZ = 1000;

    // --- 2. ウィンドウ操作関数 ---
    const openWin = (win) => {
        if (!win) return;
        win.style.display = 'block';
        maxZ++;
        win.style.zIndex = maxZ;
        gsap.fromTo(win, {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.2});
    };

    const closeWin = (win) => { if(win) win.style.display = 'none'; };

    // --- 3. アイコンクリックイベント (HTMLのIDと完全一致) ---
    document.getElementById('iconTop')?.addEventListener('click', () => openWin(winMain));
    document.getElementById('iconAbout')?.addEventListener('click', () => openWin(winAbout));
    document.getElementById('iconWork')?.addEventListener('click', () => openWin(winWork));
    document.getElementById('iconIllust')?.addEventListener('click', () => openWin(winIllust));
    document.getElementById('iconContact')?.addEventListener('click', () => openWin(winContact));
    document.getElementById('iconReadme')?.addEventListener('click', () => openWin(winReadme));

    // --- 4. DANGERアイコン (HTML: iconDanger) ---
    let dangerClicks = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dangerClicks++;
        if (dangerClicks < 3) {
            alert(`警告: システム領域です (${dangerClicks}/3)`);
        } else {
            const bsod = document.getElementById('bsodScreen');
            bsod.style.display = 'block';
            let p = 0;
            const timer = setInterval(() => {
                p += 2;
                document.getElementById('bsodPercent').textContent = p;
                if (p >= 100) { clearInterval(timer); location.reload(); }
            }, 50);
        }
    });

    // --- 5. スタートメニュー制御 ---
    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShow = startMenu.style.display === 'flex';
        startMenu.style.display = isShow ? 'none' : 'flex';
    });

    // メニュー項目クリック
    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'menuTop') openWin(winMain);
            if (item.id === 'menuAbout') openWin(winAbout);
            if (item.id === 'menuWork') openWin(winWork);
            if (item.id === 'menuIllust') openWin(winIllust);
            if (item.id === 'menuContact') openWin(winContact);
            if (item.id === 'menuShutdown') location.reload();
            startMenu.style.display = 'none';
        });
    });

    document.addEventListener('click', () => { if(startMenu) startMenu.style.display = 'none'; });

    // --- 6. 時計 (HTML: taskbarClock) ---
    const updateTime = () => {
        if (!taskbarClock) return;
        const now = new Date();
        taskbarClock.textContent = now.getHours().toString().padStart(2, '0') + ":" + 
                                 now.getMinutes().toString().padStart(2, '0');
    };
    setInterval(updateTime, 1000);
    updateTime();

    // --- 7. ウィンドウ内の閉じるボタン等 ---
    const setupBtns = (win, closeId) => {
        document.getElementById(closeId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWin(win);
        });
    };
    setupBtns(winMain, 'closeBtn');
    setupBtns(winAbout, 'aboutCloseBtn');
    setupBtns(winWork, 'workCloseBtn');
    setupBtns(winIllust, 'illustCloseBtn');
    setupBtns(winContact, 'contactCloseBtn');
    setupBtns(winReadme, 'readmeCloseBtn');

    // --- 8. ドラッグ (ハンドルのみ) ---
    const makeDraggable = (win, headerId) => {
        const header = document.getElementById(headerId);
        if (!header) return;
        let isMoving = false;
        let offset = {x: 0, y: 0};

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn')) return;
            isMoving = true;
            maxZ++;
            win.style.zIndex = maxZ;
            const rect = win.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            win.style.margin = "0";
            win.style.transform = "none";
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMoving) return;
            win.style.left = (e.clientX - offset.x) + "px";
            win.style.top = (e.clientY - offset.y) + "px";
        });

        window.addEventListener('mouseup', () => isMoving = false);
    };

    makeDraggable(winMain, 'mainHeader');
    makeDraggable(winAbout, 'aboutHeader');
    makeDraggable(winWork, 'workHeader');
    makeDraggable(winIllust, 'illustHeader');
    makeDraggable(winContact, 'contactHeader');
    makeDraggable(winReadme, 'readmeHeader');
});
