// --- DOM Elements ---
const mainWindow = document.getElementById('mainWindow');

const iconTop = document.getElementById('iconTop');
const iconAbout = document.getElementById('iconAbout');
const iconWork = document.getElementById('iconWork');
const iconIllust = document.getElementById('iconIllust');
const iconContact = document.getElementById('iconContact');

const aboutWindow = document.getElementById('aboutWindow');
const workWindow = document.getElementById('workWindow');
const illustWindow = document.getElementById('illustWindow');
const contactWindow = document.getElementById('contactWindow');

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

const iconDanger = document.getElementById('iconDanger');
const bsodScreen = document.getElementById('bsodScreen');
const bsodPercent = document.getElementById('bsodPercent');

const startMenu = document.getElementById('startMenu');
const shutdownScreen = document.getElementById('shutdownScreen');


// --- Global Functions & Utilities ---
let maxZIndex = 100;
function bringToFront(el) {
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// --- Window Management ---
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
setupWindowActions(workWindow, null, null, 'workCloseBtn');
setupWindowActions(illustWindow, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(contactWindow, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');


// --- Draggable System ---
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
    await wait(500);

    for (let msg of bootMessages) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = "> " + msg;
        bootContainer.appendChild(line);

        const randomDelay = Math.floor(Math.random() * 400) + 100;
        await wait(randomDelay);
    }

    await wait(800);
    bootScreen.classList.add('fade-out');

    setTimeout(() => {
        bootScreen.style.display = 'none';
    }, 1000);
}

window.addEventListener('load', runBootSequence);


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
    const enemyPercent = Math.max(0, (battleState.enemyHp / MAX_ENEMY_HP) * 100);
    enemyHpBar.style.width = `${enemyPercent}%`;
    if(enemyPercent < 20) enemyHpBar.style.background = "#ff0000";
    else if(enemyPercent < 50) enemyHpBar.style.background = "#ffff00";
    else enemyHpBar.style.background = "#ff3333";

    const playerPercent = Math.max(0, (battleState.playerHp / MAX_PLAYER_HP) * 100);
    playerHpBar.style.width = `${playerPercent}%`;
    playerHpNum.textContent = `${Math.max(0, battleState.playerHp)}/${MAX_PLAYER_HP}`;
    if(playerPercent < 20) playerHpBar.style.background = "#ff0000";
    else if(playerPercent < 50) playerHpBar.style.background = "#ffff00";
    else playerHpBar.style.background = "#00ff00";
};

function typeText(text, callback = null) {
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
    rpgDamage.textContent = amount;
    rpgDamage.style.color = color;
    
    if(target === "enemy") {
        gsap.to(rpgDamage, {opacity: 1, y: -50, duration: 0.5, onComplete: () => {
            gsap.to(rpgDamage, {opacity: 0, duration: 0.2, y: 0});
        }});
        rpgEnemy.classList.add('damage-anim');
        setTimeout(() => rpgEnemy.classList.remove('damage-anim'), 300);
    } else {
        rpgOverlay.classList.add('shake-screen');
        setTimeout(() => rpgOverlay.classList.remove('shake-screen'), 500);
    }
}

function endPlayerTurn() {
    battleState.isPlayerTurn = false;
    if(battleState.enemyHp <= 0) {
        battleState.isBattleOver = true;
        battleState.enemyHp = 0;
        updateBattleUI();
        gsap.to(rpgEnemy, {scale: 0, opacity: 0, rotation: 360, duration: 1});
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

gameStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    battleState.playerHp = MAX_PLAYER_HP;
    battleState.enemyHp = MAX_ENEMY_HP;
    battleState.isPlayerTurn = true;
    battleState.isBattleOver = false;
    
    mainCommandBox.style.display = 'flex';
    skillCommandBox.style.display = 'none';
    gsap.set(rpgEnemy, {scale: 1, opacity: 1, rotation: 0});
    rpgOverlay.style.display = 'block';
    
    updateBattleUI();
    typeText("あ！　やせいの　バグが　とびだしてきた！");
});

cmdAttack.addEventListener('click', () => {
    if(!battleState.isPlayerTurn) return;
    typeText("TOYBOXの　こうげき！ キーボードを　たたいた！", () => {
        const dmg = 20 + Math.floor(Math.random() * 10);
        battleState.enemyHp -= dmg;
        showDamage("enemy", dmg);
        endPlayerTurn();
    });
});

cmdSkill.addEventListener('click', () => {
    if(!battleState.isPlayerTurn) return;
    mainCommandBox.style.display = 'none';
    skillCommandBox.style.display = 'flex';
    typeText("どの　スキルを　つかう？");
});

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

skillBack.addEventListener('click', () => {
    mainCommandBox.style.display = 'flex';
    skillCommandBox.style.display = 'none';
    typeText("どうする？");
});

cmdRun.addEventListener('click', () => {
    if(!battleState.isPlayerTurn) return;
    typeText("TOYBOXは　ウィンドウを　とじて　にげだした！", () => {
        setTimeout(() => {
            rpgOverlay.style.display = 'none';
        }, 1000);
    });
});


// --- Gallery Viewer System ---
const galleryData = [
    { src: 'images/loading.png', title: 'Loading Ghost' }
];

let currentGalleryIndex = 0;

function updateGallery() {
    if (galleryData.length === 0) return;

    const data = galleryData[currentGalleryIndex];
    
    gsap.to(galleryImg, { opacity: 0, duration: 0.1, onComplete: () => {
        galleryImg.src = data.src;
        galleryTitle.textContent = data.title;
        galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
        
        galleryImg.onload = () => {
            gsap.to(galleryImg, { opacity: 1, duration: 0.2 });
        };
    }});
}

galleryPrevBtn.addEventListener('click', () => {
    currentGalleryIndex--;
    if (currentGalleryIndex < 0) {
        currentGalleryIndex = galleryData.length - 1;
    }
    updateGallery();
});

galleryNextBtn.addEventListener('click', () => {
    currentGalleryIndex++;
    if (currentGalleryIndex >= galleryData.length) {
        currentGalleryIndex = 0;
    }
    updateGallery();
});

updateGallery();


// --- Works Password System (簡易版) ---
workPasswordSubmitBtn.addEventListener('click', async () => {
    const password = workPasswordInput.value;
    passwordErrorMsg.style.display = 'none';

    if (!password) return;

    // ボタンを一時的に無効化（演出）
    workPasswordSubmitBtn.disabled = true;
    workPasswordSubmitBtn.textContent = '照合中...';
    
    // ちょっと待たせる演出（0.5秒）
    await wait(500);

    // ★ここにパスワードを設定（toybox2026）
    if (password === "toybox2026") {
        // パスワード正解！中身を表示するHTMLを作成
        const secretHtml = `
            <div class="work-list-container">
                <p style="color:green; font-weight:bold;">>> Access Granted.</p>
                
                <div class="work-item">
                    <div class="work-thumbnail">
                        <a href="#" target="_blank"><img src="images/hp-01.jpg" alt="Work 01"></a>
                    </div>
                    <div class="work-details">
                        <h3>Secret Project A</h3>
                        <ul class="work-info-list">
                            <li><span class="label">Role:</span>Design, Coding</li>
                            <li><span class="label">Year:</span>2024</li>
                        </ul>
                    </div>
                </div>

                <div class="work-item">
                     <div class="work-details">
                        <h3>Confidential Data B</h3>
                        <p>詳細は面談にてお話しします。</p>
                    </div>
                </div>
            </div>
        `;
        
        secretWorkContent.innerHTML = secretHtml;
        passwordFormSection.style.display = 'none';
        secretWorkContent.style.display = 'block';
        document.querySelector('#workHeader .window-title').textContent = '📁 Projects';
    } else {
        // 間違い
        passwordErrorMsg.style.display = 'block';
        workPasswordInput.select();
    }

    workPasswordSubmitBtn.disabled = false;
    workPasswordSubmitBtn.textContent = '解除';
});


// --- General Event Listeners ---
iconTop.addEventListener('click', () => openWindow(mainWindow));
iconAbout.addEventListener('click', () => openWindow(aboutWindow));
iconWork.addEventListener('click', () => openWindow(workWindow));
iconIllust.addEventListener('click', () => openWindow(illustWindow));
iconContact.addEventListener('click', () => openWindow(contactWindow));

aboutOkBtn.addEventListener('click', () => closeWindow(aboutWindow));

contactSendBtn.addEventListener('click', () => {
    closeWindow(contactWindow);
    sentPopup.style.display = 'flex';
});

sentCloseX.addEventListener('click', closeAllPopups);
sentBtnOk.addEventListener('click', closeAllPopups);


// --- Taskbar & Clock ---
function updateClock() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const timeString = `${year}/${month}/${day} ${hours}:${minutes}`;
    
    taskbarClock.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();


// --- BSOD System ---
let dangerClickCount = 0;

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

function triggerBSOD() {
    bsodScreen.style.display = 'block';
    
    let percent = 0;
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 10) + 1;
        if (percent > 100) percent = 100;
        bsodPercent.textContent = percent;

        if (percent === 100) {
            clearInterval(interval);
            setTimeout(rebootSystem, 1000);
        }
    }, 200);
}

function rebootSystem() {
    bsodScreen.style.display = 'none';
    
    dangerClickCount = 0;

    bootScreen.style.display = 'flex';
    bootScreen.classList.remove('fade-out');
    bootContainer.innerHTML = '';
    runBootSequence();
}

// --- Start Menu ---
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

document.addEventListener('click', (e) => {
    if (startMenu.style.display !== 'none' && !startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
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
    document.getElementById(id).addEventListener('click', () => {
        openWindow(menuActions[id]);
        startMenu.style.display = 'none';
    });
});

document.getElementById('menuShutdown').addEventListener('click', () => {
    startMenu.style.display = 'none';
    shutdownScreen.style.display = 'block';
    
    gsap.to(shutdownScreen, { opacity: 1, duration: 0.5, onComplete: () => {
        setTimeout(() => {
            location.reload();
        }, 1500);
    }});
});