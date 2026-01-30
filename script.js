window.onload = () => { // DOMContentLoadedより確実なwindow.onloadに変更
    const boot = document.getElementById('bootScreen');
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    
    // --- 1. Boot Screenを2秒後に確実に消す ---
    setTimeout(() => {
        if (boot) {
            boot.style.transition = "opacity 0.5s";
            boot.style.opacity = "0";
            setTimeout(() => boot.style.display = "none", 500);
        }
    }, 2000);

    // --- 2. ウィンドウ操作の基本セット ---
    let maxZ = 1000;
    const wins = {
        top: document.getElementById('mainWindow'),
        about: document.getElementById('aboutWindow'),
        work: document.getElementById('workWindow'),
        illust: document.getElementById('illustWindow'),
        contact: document.getElementById('contactWindow'),
        readme: document.getElementById('readmeWindow')
    };

    function openWin(win) {
        if (!win) return;
        win.style.display = 'block';
        maxZ++;
        win.style.zIndex = maxZ;
        // GSAPが読み込まれていない場合のエラー回避
        if (window.gsap) {
            gsap.fromTo(win, {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.2});
        }
    }

    // --- 3. イベント紐付け (IDを一つずつ確実に) ---
    const ids = [
        {btn: 'iconTop', win: wins.top}, {btn: 'menuTop', win: wins.top},
        {btn: 'iconAbout', win: wins.about}, {btn: 'menuAbout', win: wins.about},
        {btn: 'iconWork', win: wins.work}, {btn: 'menuWork', win: wins.work},
        {btn: 'iconIllust', win: wins.illust}, {btn: 'menuIllust', win: wins.illust},
        {btn: 'iconContact', win: wins.contact}, {btn: 'menuContact', win: wins.contact},
        {btn: 'iconReadme', win: wins.readme}
    ];

    ids.forEach(item => {
        document.getElementById(item.btn)?.addEventListener('click', () => {
            openWin(item.win);
            startMenu.style.display = 'none';
        });
    });

    // --- 4. DANGER ---
    let dClicks = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dClicks++;
        if (dClicks < 3) alert(`警告: システム領域です (${dClicks}/3)`);
        else {
            const bsod = document.getElementById('bsodScreen');
            if (bsod) bsod.style.display = 'block';
            setTimeout(() => location.reload(), 3000);
        }
    });

    // --- 5. スタートメニュー ---
    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
    });
    document.addEventListener('click', () => { if(startMenu) startMenu.style.display = 'none'; });

    // --- 6. ドラッグ ---
    document.querySelectorAll('.window-frame').forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;
        header.onmousedown = (e) => {
            if (e.target.closest('.control-btn')) return;
            maxZ++; win.style.zIndex = maxZ;
            let ox = e.clientX - win.offsetLeft, oy = e.clientY - win.offsetTop;
            document.onmousemove = (me) => {
                win.style.left = (me.clientX - ox) + 'px';
                win.style.top = (me.clientY - oy) + 'px';
            };
            document.onmouseup = () => document.onmousemove = null;
        };
        // 閉じるボタン
        win.querySelector('.btn-close')?.addEventListener('click', () => win.style.display = 'none');
    });

    // --- 7. 時計 ---
    setInterval(() => {
        const clock = document.getElementById('taskbarClock');
        if (clock) {
            const d = new Date();
            clock.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
        }
    }, 1000);
};
