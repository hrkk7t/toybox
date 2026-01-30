document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Boot Screen Control (確実に消す) ---
    const bootScreen = document.getElementById('bootScreen');
    if (bootScreen) {
        setTimeout(() => {
            bootScreen.classList.add('fade-out'); // CSSのフェードアウトクラスを追加
            setTimeout(() => {
                bootScreen.style.display = 'none'; // 完全に非表示にする
            }, 1000);
        }, 2500); // 2.5秒後に開始
    }

    // --- 2. Window Management (開閉・最前面) ---
    let maxZIndex = 100;
    const wins = {
        top: document.getElementById('mainWindow'),
        about: document.getElementById('aboutWindow'),
        work: document.getElementById('workWindow'),
        illust: document.getElementById('illustWindow'),
        contact: document.getElementById('contactWindow'),
        readme: document.getElementById('readmeWindow')
    };

    function openWindow(win) {
        if (!win) return;
        win.style.display = 'block';
        maxZIndex++;
        win.style.zIndex = maxZIndex;
        win.classList.remove('minimized');
        win.classList.add('active-window');
        
        // ギャラリーウィンドウなら画像を更新
        if (win.id === 'illustWindow') updateGallery();
    }

    // Close Buttons
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const win = e.target.closest('.window-frame');
            if (win) win.style.display = 'none';
        });
    });

    // --- 3. Click Events (アイコン & メニュー) ---
    const linkId = (id, win) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => {
            openWindow(win);
            document.getElementById('startMenu').style.display = 'none'; // メニューを閉じる
        });
    };

    linkId('iconTop', wins.top); linkId('menuTop', wins.top);
    linkId('iconAbout', wins.about); linkId('menuAbout', wins.about);
    linkId('iconWork', wins.work); linkId('menuWork', wins.work);
    linkId('iconIllust', wins.illust); linkId('menuIllust', wins.illust);
    linkId('iconContact', wins.contact); linkId('menuContact', wins.contact);
    linkId('iconReadme', wins.readme);

    // --- 4. Dragging Logic (CSSのtransformに対応) ---
    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn')) return; // ボタンならドラッグしない
            
            const win = header.closest('.window-frame');
            maxZIndex++;
            win.style.zIndex = maxZIndex;

            // ドラッグ開始時の座標計算
            const shiftX = e.clientX - win.getBoundingClientRect().left;
            const shiftY = e.clientY - win.getBoundingClientRect().top;

            // CSSのtransform解除用クラスを追加
            win.classList.add('moved');
            win.classList.add('dragging');

            function moveAt(pageX, pageY) {
                // transformが外れるので、現在のマウス位置に追従させる
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            // 初期位置合わせ
            moveAt(e.pageX, e.pageY);

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                win.classList.remove('dragging');
                document.onmouseup = null;
            };
        });
    });

    // --- 5. Start Menu & Clock ---
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
        });
        document.addEventListener('click', () => startMenu.style.display = 'none');
    }

    const clock = document.getElementById('taskbarClock');
    setInterval(() => {
        if(clock) {
            const now = new Date();
            clock.textContent = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        }
    }, 1000);

    // --- 6. Gallery System ---
    const galleryData = [
        { src: 'images/illust1.png', title: 'Work 01' },
        { src: 'images/illust2.png', title: 'Work 02' }
    ];
    let currentIdx = 0;

    function updateGallery() {
        const img = document.getElementById('galleryImg');
        const title = document.getElementById('galleryTitle');
        const counter = document.getElementById('galleryCounter');
        
        if (img && galleryData[currentIdx]) {
            img.src = galleryData[currentIdx].src;
            if(title) title.textContent = galleryData[currentIdx].title;
            if(counter) counter.textContent = `${currentIdx + 1}/${galleryData.length}`;
        }
    }

    document.getElementById('galleryNextBtn')?.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % galleryData.length;
        updateGallery();
    });
    
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + galleryData.length) % galleryData.length;
        updateGallery();
    });

    // --- 7. Danger & BSOD ---
    let dangerCount = 0;
    document.getElementById('iconDanger')?.addEventListener('click', () => {
        dangerCount++;
        if (dangerCount < 3) {
            alert(`警告: システム領域にアクセスしないでください (${dangerCount}/3)`);
        } else {
            const bsod = document.getElementById('bsodScreen');
            if (bsod) bsod.style.display = 'block';
            setTimeout(() => location.reload(), 3000);
        }
    });
});
