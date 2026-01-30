document.addEventListener('DOMContentLoaded', () => {
    // 1. 各要素取得
    const elements = {
        startBtn: document.getElementById('startBtn'),
        startMenu: document.getElementById('startMenu'),
        clock: document.getElementById('taskbarClock'),
        boot: document.getElementById('bootScreen'),
        bsod: document.getElementById('bsodScreen'),
        bsodP: document.getElementById('bsodPercent')
    };

    const wins = {
        top: document.getElementById('mainWindow'),
        about: document.getElementById('aboutWindow'),
        work: document.getElementById('workWindow'),
        illust: document.getElementById('illustWindow'),
        contact: document.getElementById('contactWindow'),
        readme: document.getElementById('readmeWindow')
    };

    let maxZ = 1000;

    // 2. ブート画面（自動で消える設定）
    setTimeout(() => {
        if (elements.boot) elements.boot.style.display = 'none';
    }, 2000);

    // 3. ウィンドウ制御
    const openWin = (win) => {
        if (!win) return;
        win.style.display = 'block';
        maxZ++;
        win.style.zIndex = maxZ;
        if (win.id === 'illustWindow') updateGallery();
        gsap.fromTo(win, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 });
    };

    // 4. ギャラリー（画像表示の核）
    const galleryData = [
        { src: 'images/illust1.png', title: 'Work 01' },
        { src: 'images/illust2.png', title: 'Work 02' }
    ];
    let gIdx = 0;

    const updateGallery = () => {
        const img = document.getElementById('galleryImg');
        const title = document.getElementById('galleryTitle');
        const counter = document.getElementById('galleryCounter');
        if (img && galleryData[gIdx]) {
            img.src = galleryData[gIdx].src;
            title.textContent = galleryData[gIdx].title;
            counter.textContent = `${gIdx + 1}/${galleryData.length}`;
        }
    };

    document.getElementById('galleryNextBtn')?.addEventListener('click', () => { gIdx = (gIdx + 1) % galleryData.length; updateGallery(); });
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => { gIdx = (gIdx - 1 + galleryData.length) % galleryData.length; updateGallery(); });

    // 5. アイコン・メニュークリック
    const bindClick = (id, win) => document.getElementById(id)?.addEventListener('click', () => openWin(win));
    
    // アイコン
    bindClick('iconTop', wins.top);
    bindClick('iconAbout', wins.about);
    bindClick('iconWork', wins.work);
    bindClick('iconIllust', wins.illust);
    bindClick('iconContact', wins.contact);
    bindClick('iconReadme', wins.readme);

    // スタートメニュー内
    bindClick('menuTop', wins.top);
    bindClick('menuAbout', wins.about);
    bindClick('menuWork', wins.work);
    bindClick('menuIllust', wins.illust);
    bindClick('menuContact', wins.contact);

    // DANGER
    let dCount = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dCount++;
        if (dCount < 3) alert(`警告: システム領域 (${dCount}/3)`);
        else {
            elements.bsod.style.display = 'block';
            let p = 0;
            const t = setInterval(() => {
                p += 5; elements.bsodP.textContent = p;
                if (p >= 100) { clearInterval(t); location.reload(); }
            }, 50);
        }
    });

    // 6. スタートメニュー開閉
    elements.startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.startMenu.style.display = (elements.startMenu.style.display === 'flex') ? 'none' : 'flex';
    });
    document.addEventListener('click', () => elements.startMenu.style.display = 'none');

    // 7. 時計
    const setTime = () => {
        const d = new Date();
        if (elements.clock) elements.clock.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
    };
    setInterval(setTime, 1000); setTime();

    // 8. ドラッグ機能
    const makeDraggable = (win, headId, closeId) => {
        const h = document.getElementById(headId);
        if (!h) return;
        h.onmousedown = (e) => {
            if (e.target.closest('.control-btn')) return;
            maxZ++; win.style.zIndex = maxZ;
            let sx = e.clientX - win.offsetLeft, sy = e.clientY - win.offsetTop;
            document.onmousemove = (m) => { win.style.left = (m.clientX - sx) + 'px'; win.style.top = (m.clientY - sy) + 'px'; };
            document.onmouseup = () => document.onmousemove = null;
        };
        document.getElementById(closeId)?.addEventListener('click', () => win.style.display = 'none');
    };

    makeDraggable(wins.top, 'mainHeader', 'closeBtn');
    makeDraggable(wins.about, 'aboutHeader', 'aboutCloseBtn');
    makeDraggable(wins.work, 'workHeader', 'workCloseBtn');
    makeDraggable(wins.illust, 'illustHeader', 'illustCloseBtn');
    makeDraggable(wins.contact, 'contactHeader', 'contactCloseBtn');
    makeDraggable(wins.readme, 'readmeHeader', 'readmeCloseBtn');
});
