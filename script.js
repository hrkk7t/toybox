document.addEventListener('DOMContentLoaded', () => {
    // 1. 各要素の取得
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    const taskbarClock = document.getElementById('taskbarClock');
    const bsodScreen = document.getElementById('bsodScreen');
    const bsodPercent = document.getElementById('bsodPercent');

    const wins = {
        top: document.getElementById('mainWindow'),
        about: document.getElementById('aboutWindow'),
        work: document.getElementById('workWindow'),
        illust: document.getElementById('illustWindow'),
        contact: document.getElementById('contactWindow'),
        readme: document.getElementById('readmeWindow')
    };

    // ギャラリーデータ (ファイル名が違っても壊れないよう修正)
    const galleryData = [
        { src: 'images/loading.png', title: 'Loading Graphic' }, // loading.pngはあるはず
        { src: 'images/illust1.png', title: 'My Work 01' }
    ];
    let galleryIdx = 0;
    let maxZ = 1000;

    // 2. ウィンドウ操作
    const openWin = (win) => {
        if (!win) return;
        win.style.display = 'block';
        maxZ++;
        win.style.zIndex = maxZ;
        if (win.id === 'illustWindow') updateGallery();
        gsap.fromTo(win, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" });
    };

    const updateGallery = () => {
        const img = document.getElementById('galleryImg');
        const title = document.getElementById('galleryTitle');
        const counter = document.getElementById('galleryCounter');
        if (img && galleryData[galleryIdx]) {
            img.src = galleryData[galleryIdx].src;
            title.textContent = galleryData[galleryIdx].title;
            counter.textContent = `${galleryIdx + 1}/${galleryData.length}`;
        }
    };

    // 3. クリックイベント（アイコン）
    document.getElementById('iconTop')?.addEventListener('click', () => openWin(wins.top));
    document.getElementById('iconAbout')?.addEventListener('click', () => openWin(wins.about));
    document.getElementById('iconWork')?.addEventListener('click', () => openWin(wins.work));
    document.getElementById('iconIllust')?.addEventListener('click', () => openWin(wins.illust));
    document.getElementById('iconContact')?.addEventListener('click', () => openWin(wins.contact));
    document.getElementById('iconReadme')?.addEventListener('click', () => openWin(wins.readme));

    // DANGER
    let dangerCount = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dangerCount++;
        if (dangerCount < 3) {
            alert(`SYSTEM ERROR: Access Denied (${dangerCount}/3)`);
        } else {
            bsodScreen.style.display = 'block';
            let p = 0;
            const t = setInterval(() => {
                p += 5;
                bsodPercent.textContent = p;
                if (p >= 100) { clearInterval(t); location.reload(); }
            }, 100);
        }
    });

    // 4. スタートメニュー
    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
    });
    document.addEventListener('click', () => startMenu.style.display = 'none');

    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', () => {
            const idMap = { 'menuTop': wins.top, 'menuAbout': wins.about, 'menuWork': wins.work, 'menuIllust': wins.illust, 'menuContact': wins.contact };
            if (idMap[item.id]) openWin(idMap[item.id]);
            if (item.id === 'menuShutdown') location.reload();
        });
    });

    // 5. 時計
    const updateTime = () => {
        const d = new Date();
        if (taskbarClock) taskbarClock.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
    };
    setInterval(updateTime, 1000); updateTime();

    // 6. ドラッグ
    const setDrag = (win, head, close) => {
        const h = document.getElementById(head);
        if (!h) return;
        h.onmousedown = (e) => {
            if (e.target.closest('.control-btn')) return;
            maxZ++; win.style.zIndex = maxZ;
            let ox = e.clientX - win.offsetLeft, oy = e.clientY - win.offsetTop;
            document.onmousemove = (me) => { win.style.left = (me.clientX - ox) + 'px'; win.style.top = (me.clientY - oy) + 'px'; };
            document.onmouseup = () => document.onmousemove = null;
        };
        document.getElementById(close)?.addEventListener('click', () => win.style.display = 'none');
    };
    setDrag(wins.top, 'mainHeader', 'closeBtn');
    setDrag(wins.about, 'aboutHeader', 'aboutCloseBtn');
    setDrag(wins.work, 'workHeader', 'workCloseBtn');
    setDrag(wins.illust, 'illustHeader', 'illustCloseBtn');
    setDrag(wins.contact, 'contactHeader', 'contactCloseBtn');
    setDrag(wins.readme, 'readmeHeader', 'readmeCloseBtn');

    // ギャラリー送り
    document.getElementById('galleryNextBtn')?.addEventListener('click', () => { galleryIdx = (galleryIdx + 1) % galleryData.length; updateGallery(); });
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => { galleryIdx = (galleryIdx - 1 + galleryData.length) % galleryData.length; updateGallery(); });
});
