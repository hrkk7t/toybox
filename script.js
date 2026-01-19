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


let maxZIndex = 100;
function bringToFront(el) {
    maxZIndex++;
    el.style.zIndex = maxZIndex;
}

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
setupWindowActions(workWindow, 'workMinBtn', 'workMaxBtn', 'workCloseBtn');
setupWindowActions(illustWindow, 'illustMinBtn', 'illustMaxBtn', 'illustCloseBtn');
setupWindowActions(contactWindow, 'contactMinBtn', 'contactMaxBtn', 'contactCloseBtn');


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