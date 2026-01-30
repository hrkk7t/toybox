document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const mainWindow = document.getElementById('mainWindow');
    const iconTop = document.getElementById('iconTop');
    const iconAbout = document.getElementById('iconAbout');
    const iconWork = document.getElementById('iconWork');
    const iconIllust = document.getElementById('iconIllust');
    const iconContact = document.getElementById('iconContact');
    const iconReadme = document.getElementById('iconReadme');

    const aboutWindow = document.getElementById('aboutWindow');
    const workWindow = document.getElementById('workWindow');
    const illustWindow = document.getElementById('illustWindow');
    const contactWindow = document.getElementById('contactWindow');
    const readmeWindow = document.getElementById('readmeWindow');

    const contactSendBtn = document.getElementById('contactSendBtn');
    const aboutOkBtn = document.getElementById('aboutOkBtn');
    const gameStartBtn = document.getElementById('gameStartBtn');

    const sentPopup = document.getElementById('sentPopup');
    const sentCloseX = document.getElementById('sentCloseX');
    const sentBtnOk = document.getElementById('sentBtnOk');

    const rpgOverlay = document.getElementById('rpgOverlay');
    const rpgEnemy = document.getElementById('rpgEnemy');
    const rpgText = document.getElementById('rpgText');
    const rpgDamage = document.getElementById('rpgDamage');
    const mainCommandBox = document.getElementById('mainCommandBox');
    const skillCommandBox = document.getElementById('skillCommandBox');
    const cmdAttack = document.getElementById('cmdAttack');
    const cmdSkill = document.getElementById('cmdSkill');
    const cmdRun = document.getElementById('cmdRun');
    const skillBack = document.getElementById('skillBack');
    const skillItems = document.querySelectorAll('.skill-item');
    const enemyHpBar = document.getElementById('enemyHpBar');
    const playerHpBar = document.getElementById('playerHpBar');
    const playerHpNum = document.getElementById('playerHpNum');

    const bootScreen = document.getElementById('bootScreen');
    const bootContainer = document.getElementById('bootContainer');

    const galleryImg = document.getElementById('galleryImg');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryCounter = document.getElementById('galleryCounter');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');

    const workPasswordInput = document.getElementById('workPasswordInput');
    const workPasswordSubmitBtn = document.getElementById('workPasswordSubmitBtn');
    const passwordFormSection = document.getElementById('passwordFormSection');
    const secretWorkContent = document.getElementById('secretWorkContent');
    const passwordErrorMsg = document.getElementById('passwordErrorMsg');

    const taskbarClock = document.getElementById('taskbarClock');
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    const shutdownScreen = document.getElementById('shutdownScreen');

    const iconDanger = document.getElementById('iconDanger');
    const bsodScreen = document.getElementById('bsodScreen');
    const bsodPercent = document.getElementById('bsodPercent');


    // --- Global Functions & Utilities ---
    let maxZIndex = 100;
    function bringToFront(el) {
        maxZIndex++;
        el.style.zIndex = maxZIndex;
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    // --- Window Management ---
    const openWindow = (win) => {
        if(!win) return;
        win.style.display = 'flex'; // CSSでflex指定しているので合わせる
        win.classList.remove('minimized');
        bringToFront(win);
        // GSAPがあればアニメーション
        if(typeof gsap !== 'undefined') {
            gsap.fromTo(win, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)"});
        }
    };

    const closeWindow = (win) => {
        if(win) win.style.display = 'none';
    };

    const closeAllPopups = () => {
        if(sentPopup) sentPopup.style.display = 'none';
    };

    const setupWindowActions = (win, minBtnId, maxBtnId, closeBtnId) => {
        if(!win) return;
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
    setupWindowActions(workWindow, null, null, 'workCloseBtn');
    setupWindowActions(illustWindow, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
    setupWindowActions(contactWindow, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');
    setupWindowActions(readmeWindow, 'readmeMinBtn', 'readmeMaxBtn', 'readmeCloseBtn');


    // --- Draggable System ---
    const setupDrag = (selector, handleSelector = null) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const handle = handleSelector ? el.querySelector(handleSelector) : el;
            if(!handle) return;

            let isDragging = false;
            let startX, startY;
            let initialLeft, initialTop;

            const startDrag = (e) => {
                const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
                const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

                // スマホでアイコン等のドラッグ制限
                if (window.innerWidth <= 600 && el.classList.contains('desktop-icon')) return;
                if (e.target.closest('.no-drag') || e.target.closest('button') || e.target.closest('input')) return;

                isDragging = true;
                el.classList.add('dragging');
                bringToFront(el);
                
                // 現在の位置を取得
                const rect = el.getBoundingClientRect();
                
                // transformの影響を排除してtop/leftに変換
                el.style.transform = 'none';
                el.style.left = rect.left + 'px';
                el.style.top = rect.top + 'px';
                
                startX = clientX;
                startY = clientY;
            };

            const moveDrag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
                const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
                
                const dx = clientX - startX;
                const dy = clientY - startY;
                
                const currentLeft = parseFloat(el.style.left) || 0;
                const currentTop = parseFloat(el.style.top) || 0;

                el.style.left = (currentLeft + dx) + 'px';
                el.style.top = (currentTop + dy) + 'px';
                
                startX = clientX;
                startY = clientY;
            };

            const endDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    el.classList.remove('dragging');
                }
            };

            handle.addEventListener('mousedown', startDrag);
            window.addEventListener('mousemove', moveDrag);
            window.addEventListener('mouseup', endDrag);

            handle.addEventListener('touchstart', startDrag, { passive: false });
            window.addEventListener('touchmove', moveDrag, { passive: false });
            window.addEventListener('touchend', endDrag);
            
            el.addEventListener('mousedown', () => bringToFront(el));
            el.addEventListener('touchstart', () => bringToFront(el), { passive: true });
        });
    };

    setupDrag('.draggable-window', '.window-header');
    setupDrag('.desktop-icon');


    // --- About Window Tabs ---
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


    // --- Boot Sequence Animation ---
    const bootMessages = [
        "Initialising TOYBOX kernel...",
        "Loading memory... 64KB OK",
        "Mounting volumes... OK",
        "Checking user profile... Verified",
        "Loading graphical interface...",
        "Starting TOYBOX.exe...",
        "Welcome, Administrator."
    ];

    async function runBootSequence() {
        if(!bootContainer) return;
        await wait(500);

        for (let msg of bootMessages) {
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.textContent = "> " + msg;
            bootContainer.appendChild(line);

            const randomDelay = Math.floor(Math.random() * 200) + 100;
            await wait(randomDelay);
        }

        await wait(800);
        if(bootScreen) {
            bootScreen.classList.add('fade-out');
            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 1000);
        }
    }

    runBootSequence();


    // --- RPG Battle System ---
    const MAX_PLAYER_HP = 100;
    const MAX_ENEMY_HP = 500;

    let battleState = {
        playerHp: MAX_PLAYER_HP,
        enemyHp: MAX_ENEMY_HP,
        isPlayerTurn: true,
        isBattleOver: false
    };

    const updateBattleUI = () => {
        if(!enemyHpBar || !playerHpBar) return;
        const enemyPercent = Math.max(0, (battleState.enemyHp / MAX_ENEMY_HP) * 100);
        enemyHpBar.style.width = `${enemyPercent}%`;
        
        const playerPercent = Math.max(0, (battleState.playerHp / MAX_PLAYER_HP) * 100);
        playerHpBar.style.width = `${playerPercent}%`;
        playerHpNum.textContent = `${Math.max(0, battleState.playerHp)}/${MAX_PLAYER_HP}`;
    };

    function typeText(text, callback = null) {
        if(!rpgText) return;
        rpgText.textContent = "";
        let i = 0;
        const speed = 30; 
        function type() {
            if (i < text.length) {
                rpgText.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) setTimeout(callback, 500);
            }
        }
        type();
    }

    function showDamage(target, amount, color = "red") {
        if(!rpgDamage) return;
        rpgDamage.textContent = amount;
        rpgDamage.style.color = color;
        
        if(target === "enemy") {
            if(typeof gsap !== 'undefined') {
                gsap.to(rpgDamage, {opacity: 1, y: -50, duration: 0.5, onComplete: () => {
                    gsap.to(rpgDamage, {opacity: 0, duration: 0.2, y: 0});
                }});
                rpgEnemy.classList.add('damage-anim');
                setTimeout(() => rpgEnemy.classList.remove('damage-anim'), 300);
            } else {
                rpgDamage.style.opacity = 1;
                setTimeout(() => rpgDamage.style.opacity = 0, 1000);
            }
        }
    }

    function endPlayerTurn() {
        battleState.isPlayerTurn = false;
        if(battleState.enemyHp <= 0) {
            battleState.isBattleOver = true;
            battleState.enemyHp = 0;
            updateBattleUI();
            if(typeof gsap !== 'undefined') gsap.to(rpgEnemy, {scale: 0, opacity: 0, rotation: 360, duration: 1});
            typeText("バグを　かんぜんに　しゅうせいした！　YOU WIN!", () => {
                setTimeout(() => rpgOverlay.style.display = 'none', 2000);
            });
            return;
        }
        updateBattleUI();
        setTimeout(enemyTurn, 1000);
    }

    function enemyTurn() {
        if(battleState.isBattleOver) return;
        typeText("バグの　こうげき！", () => {
            const rand = Math.random();
            let damage = 0;
            if (rand < 0.2) {
                typeText("バグは　もじばけしている…　なにもしてこない！");
                damage = 0;
            } else if (rand < 0.6) {
                typeText("バグは　エラーメッセージを　はきだした！");
                damage = 15 + Math.floor(Math.random() * 10);
            } else {
                typeText("バグは　フリーズこうせんを　はナった！");
                damage = 30 + Math.floor(Math.random() * 10);
            }
            
            if (damage > 0) {
                setTimeout(() => {
                    showDamage("player", damage);
                    battleState.playerHp -= damage;
                    updateBattleUI();
                    if (battleState.playerHp <= 0) {
                        battleState.playerHp = 0;
                        battleState.isBattleOver = true;
                        updateBattleUI();
                        typeText("めのまえが　まっくらに　なった… (GAME OVER)", () => {
                            setTimeout(() => rpgOverlay.style.display = 'none', 3000);
                        });
                        return;
                    }
                    setTimeout(() => {
                        battleState.isPlayerTurn = true;
                        typeText("どうする？");
                    }, 1000);
                }, 1000);
            } else {
                setTimeout(() => {
                    battleState.isPlayerTurn = true;
                    typeText("どうする？");
                }, 1000);
            }
        });
    }

    if(gameStartBtn) {
        gameStartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            battleState.playerHp = MAX_PLAYER_HP;
            battleState.enemyHp = MAX_ENEMY_HP;
            battleState.isPlayerTurn = true;
            battleState.isBattleOver = false;
            
            mainCommandBox.style.display = 'flex';
            skillCommandBox.style.display = 'none';
            if(typeof gsap !== 'undefined') gsap.set(rpgEnemy, {scale: 1, opacity: 1, rotation: 0});
            rpgOverlay.style.display = 'block';
            
            updateBattleUI();
            typeText("あ！　やせいの　バグが　とびだしてきた！");
        });
    }

    if(cmdAttack) {
        cmdAttack.addEventListener('click', () => {
            if(!battleState.isPlayerTurn) return;
            typeText("TOYBOXの　こうげき！ キーボードを　たたいた！", () => {
                const dmg = 20 + Math.floor(Math.random() * 10);
                battleState.enemyHp -= dmg;
                showDamage("enemy", dmg);
                endPlayerTurn();
            });
        });
    }

    if(cmdSkill) {
        cmdSkill.addEventListener('click', () => {
            if(!battleState.isPlayerTurn) return;
            mainCommandBox.style.display = 'none';
            skillCommandBox.style.display = 'flex';
            typeText("どの　スキルを　つかう？");
        });
    }

    skillItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const skillType = e.target.getAttribute('data-skill');
            mainCommandBox.style.display = 'flex';
            skillCommandBox.style.display = 'none';
            
            if (skillType === 'debug') {
                typeText("デバッグツールを　きどうした！", () => {
                    const dmg = 80 + Math.floor(Math.random() * 20);
                    battleState.enemyHp -= dmg;
                    showDamage("enemy", dmg, "cyan");
                    endPlayerTurn();
                });
            } else if (skillType === 'reload') {
                typeText("ブラウザを　さいよみこみした！ HPがかいふくした！", () => {
                    const heal = 50;
                    battleState.playerHp = Math.min(MAX_PLAYER_HP, battleState.playerHp + heal);
                    updateBattleUI();
                    endPlayerTurn();
                });
            } else if (skillType === 'force') {
                typeText("タスクマネージャーで　きょうせいしゅうりょう！", () => {
                    if(Math.random() > 0.5) {
                        const dmg = 9999;
                        battleState.enemyHp -= dmg;
                        showDamage("enemy", dmg, "purple");
                    } else {
                        showDamage("enemy", "MISS", "white");
                        typeText("しかし　おうとうが　ない！");
                    }
                    endPlayerTurn();
                });
            }
        });
    });

    if(skillBack) {
        skillBack.addEventListener('click', () => {
            mainCommandBox.style.display = 'flex';
            skillCommandBox.style.display = 'none';
            typeText("どうする？");
        });
    }

    if(cmdRun) {
        cmdRun.addEventListener('click', () => {
            if(!battleState.isPlayerTurn) return;
            typeText("TOYBOXは　ウィンドウを　とじて　にげだした！", () => {
                setTimeout(() => {
                    rpgOverlay.style.display = 'none';
                }, 1000);
            });
        });
    }


    // --- Gallery Viewer System ---
    // ここに画像のリストを入れてください
    const galleryData = [
        { src: 'https://placehold.co/400x300/111/fff?text=Image1', title: 'Work 01' },
        { src: 'https://placehold.co/400x300/222/fff?text=Image2', title: 'Work 02' },
        { src: 'https://placehold.co/400x300/333/fff?text=Image3', title: 'Work 03' }
    ];

    let currentGalleryIndex = 0;

    function updateGallery() {
        if (!galleryData.length || !galleryImg) return;
        const data = galleryData[currentGalleryIndex];
        
        galleryImg.src = data.src;
        if(galleryTitle) galleryTitle.textContent = data.title;
        if(galleryCounter) galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
    }

    if(galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', () => {
            currentGalleryIndex--;
            if (currentGalleryIndex < 0) currentGalleryIndex = galleryData.length - 1;
            updateGallery();
        });
    }

    if(galleryNextBtn) {
        galleryNextBtn.addEventListener('click', () => {
            currentGalleryIndex++;
            if (currentGalleryIndex >= galleryData.length) currentGalleryIndex = 0;
            updateGallery();
        });
    }

    updateGallery();


    // --- Works Password System ---
    if(workPasswordSubmitBtn) {
        workPasswordSubmitBtn.addEventListener('click', async () => {
            const password = workPasswordInput.value;
            passwordErrorMsg.style.display = 'none';
            if (!password) return;

            workPasswordSubmitBtn.disabled = true;
            workPasswordSubmitBtn.textContent = '照合中...';

            // ★注意: ローカル環境だとこのFetchはエラーになります。
            // 本番環境(Netlify)でのみ動作します。
            // テスト用に「1234」なら開くように仮実装しておきます。
            try {
                // 仮の実装
                if (password === "1234") {
                     await wait(1000);
                     secretWorkContent.innerHTML = "<p>🎉 認証成功！秘密のプロジェクトです。</p>";
                     passwordFormSection.style.display = 'none';
                     secretWorkContent.style.display = 'block';
                     document.querySelector('#workHeader .window-title').textContent = '📁 Projects (Unlocked)';
                } else {
                     throw new Error("Wrong password");
                }
                
                /* 本番用コード (Netlify Functions)
                const response = await fetch("/.netlify/functions/getwork", {
                    method: "POST",
                    body: JSON.stringify({ password: password }),
                });
                if (response.ok) {
                    const data = await response.json();
                    secretWorkContent.innerHTML = data.html;
                    passwordFormSection.style.display = 'none';
                    secretWorkContent.style.display = 'block';
                } else {
                    passwordErrorMsg.style.display = 'block';
                }
                */

            } catch (error) {
                passwordErrorMsg.style.display = 'block';
            } finally {
                workPasswordSubmitBtn.disabled = false;
                workPasswordSubmitBtn.textContent = '解除';
            }
        });
    }


    // --- General Event Listeners ---
    if(iconTop) iconTop.addEventListener('click', () => openWindow(mainWindow));
    if(iconAbout) iconAbout.addEventListener('click', () => openWindow(aboutWindow));
    if(iconWork) iconWork.addEventListener('click', () => openWindow(workWindow));
    if(iconIllust) iconIllust.addEventListener('click', () => openWindow(illustWindow));
    if(iconContact) iconContact.addEventListener('click', () => openWindow(contactWindow));
    if(iconReadme) iconReadme.addEventListener('click', () => openWindow(readmeWindow));

    if(aboutOkBtn) aboutOkBtn.addEventListener('click', () => closeWindow(aboutWindow));

    if(contactSendBtn) {
        contactSendBtn.addEventListener('click', () => {
            closeWindow(contactWindow);
            if(sentPopup) sentPopup.style.display = 'flex';
        });
    }

    if(sentCloseX) sentCloseX.addEventListener('click', closeAllPopups);
    if(sentBtnOk) sentBtnOk.addEventListener('click', closeAllPopups);


    // --- Taskbar & Clock ---
    function updateClock() {
        if(!taskbarClock) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        taskbarClock.textContent = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();


    // --- BSOD System ---
    let dangerClickCount = 0;
    if(iconDanger) {
        iconDanger.addEventListener('click', () => {
            dangerClickCount++;
            if (dangerClickCount === 1) {
                alert("【警告】システムファイルです。\n触らないでください。");
            } else if (dangerClickCount === 2) {
                alert("【警告】本当に危険です。\nデータが破損する可能性があります。");
            } else if (dangerClickCount >= 3) {
                triggerBSOD();
            }
        });
    }

    function triggerBSOD() {
        if(!bsodScreen) return;
        bsodScreen.style.display = 'block';
        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 10) + 1;
            if (percent > 100) percent = 100;
            if(bsodPercent) bsodPercent.textContent = percent;

            if (percent === 100) {
                clearInterval(interval);
                setTimeout(rebootSystem, 1000);
            }
        }, 200);
    }

    function rebootSystem() {
        bsodScreen.style.display = 'none';
        dangerClickCount = 0;
        if(bootScreen) {
            bootScreen.style.display = 'flex';
            bootScreen.classList.remove('fade-out');
            if(bootContainer) bootContainer.innerHTML = '';
        }
        runBootSequence();
    }

    // --- Start Menu ---
    if(startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (startMenu.style.display === 'none') {
                startMenu.style.display = 'flex';
                startBtn.classList.add('active');
            } else {
                startMenu.style.display = 'none';
                startBtn.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (startMenu && startMenu.style.display !== 'none' && !startMenu.contains(e.target) && e.target !== startBtn) {
            startMenu.style.display = 'none';
            if(startBtn) startBtn.classList.remove('active');
        }
    });

    const menuActions = {
        'menuTop': mainWindow,
        'menuAbout': aboutWindow,
        'menuWork': workWindow,
        'menuIllust': illustWindow,
        'menuContact': contactWindow
    };

    Object.keys(menuActions).forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('click', () => {
                openWindow(menuActions[id]);
                if(startMenu) startMenu.style.display = 'none';
            });
        }
    });

    const menuShutdown = document.getElementById('menuShutdown');
    if(menuShutdown) {
        menuShutdown.addEventListener('click', () => {
            if(startMenu) startMenu.style.display = 'none';
            if(shutdownScreen) {
                shutdownScreen.style.display = 'block';
                if(typeof gsap !== 'undefined') {
                    gsap.to(shutdownScreen, { opacity: 1, duration: 0.5, onComplete: () => {
                        setTimeout(() => location.reload(), 1500);
                    }});
                } else {
                    shutdownScreen.style.opacity = 1;
                    setTimeout(() => location.reload(), 2000);
                }
            }
        });
    }
});

function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    if(modal && modalImg) {
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if(modal) modal.style.display = 'none';
}
