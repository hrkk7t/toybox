window.onload = function() {
    // --- 1. Boot Screen (ロード画面) ---
    const bootScreen = document.getElementById('bootScreen');
    const loadBar = document.querySelector('.loading-fill');
    
    // ロードバーのアニメーション
    if(loadBar) {
        setTimeout(() => loadBar.style.width = "50%", 500);
        setTimeout(() => loadBar.style.width = "100%", 1500);
    }

    // 2.5秒後に画面を消す（これで固まらなくなります）
    setTimeout(() => {
        if(bootScreen) {
            bootScreen.style.transition = "opacity 0.5s";
            bootScreen.style.opacity = "0";
            setTimeout(() => bootScreen.style.display = "none", 500);
        }
    }, 2500);


    // --- 2. Window Management (ウィンドウ管理) ---
    let maxZIndex = 100;
    
    // ウィンドウを開く関数
    window.openWindow = function(id) {
        const win = document.getElementById(id);
        if(!win) return;
        
        win.style.display = 'flex';
        maxZIndex++;
        win.style.zIndex = maxZIndex;
        
        // 画面中央にリセット（初回のみ、または変な位置に行ったとき用）
        if(!win.hasAttribute('data-moved')) {
            win.style.top = '50%';
            win.style.left = '50%';
            win.style.transform = 'translate(-50%, -50%)';
        }
        
        // スタートメニューを閉じる
        const menu = document.getElementById('startMenu');
        if(menu) menu.style.display = 'none';
    };

    // ウィンドウを閉じる関数
    window.closeWindow = function(btn) {
        const win = btn.closest('.window-frame');
        if(win) win.style.display = 'none';
    };

    // --- 3. Dragging Function (ドラッグ移動) ---
    const headers = document.querySelectorAll('.window-header');
    
    headers.forEach(header => {
        header.onmousedown = function(e) {
            // ボタンを押したときはドラッグしない
            if(e.target.closest('.win-controls')) return;

            const win = header.closest('.window-frame');
            maxZIndex++;
            win.style.zIndex = maxZIndex; // クリックで最前面へ

            // translateの影響を消して絶対配置に切り替える計算
            const rect = win.getBoundingClientRect();
            const shiftX = e.clientX - rect.left;
            const shiftY = e.clientY - rect.top;

            // translateを解除して、現在の見た目の位置をtop/leftに固定する
            win.style.transform = 'none';
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
            win.setAttribute('data-moved', 'true');

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            header.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                header.onmouseup = null;
            };
        };
    });


    // --- 4. Start Menu & Clock ---
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');

    if(startBtn) {
        startBtn.onclick = function(e) {
            e.stopPropagation();
            if(startMenu.style.display === 'flex') {
                startMenu.style.display = 'none';
            } else {
                startMenu.style.display = 'flex';
                maxZIndex++;
                startMenu.style.zIndex = maxZIndex;
            }
        };
    }
    
    // デスクトップをクリックしたらメニューを閉じる
    document.addEventListener('click', function(e) {
        if(startMenu && e.target !== startBtn && !startBtn.contains(e.target)) {
            startMenu.style.display = 'none';
        }
    });

    // 時計の更新
    setInterval(() => {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
        const clock = document.getElementById('clock');
        if(clock) clock.innerText = timeStr;
    }, 1000);


    // --- 5. Gallery Logic (ギャラリー) ---
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // ※実際の画像パスに変えてください
    let currentIdx = 0;
    const galleryImg = document.getElementById('galleryImg');
    
    window.nextImage = function() {
        currentIdx = (currentIdx + 1) % images.length;
        // 画像がある場合のみ切り替え
        // if(galleryImg) galleryImg.src = images[currentIdx];
        // alert('次の画像へ (画像ファイルをセットすれば動きます)'); 
        console.log('Next Image');
    };
    
    window.prevImage = function() {
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        // if(galleryImg) galleryImg.src = images[currentIdx];
        console.log('Prev Image');
    };


    // --- 6. Danger / Hidden Features ---
    const dangerIcon = document.getElementById('iconDanger');
    let clickCount = 0;
    
    if(dangerIcon) {
        dangerIcon.ondblclick = function() {
            clickCount++;
            if(clickCount < 3) {
                alert('警告: システム領域です。アクセスしないでください。');
            } else {
                document.getElementById('bsod').style.display = 'block';
                setTimeout(() => location.reload(), 3000);
            }
        };
    }
};
