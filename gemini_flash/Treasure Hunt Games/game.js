const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const infoPanel = document.getElementById('info-panel');

let playerPosition = { x: 0, y: 0 };
let treasurePosition = { x: 0, y: 0 };
let traps = [];

startButton.addEventListener('click', startGame);

function startGame() {
    // 初始化游戏设置
    infoPanel.style.display = 'none';
    gameBoard.innerHTML = ''; // 清除之前的游戏区域
    createGameBoard();
    generateTreasure();
    generateTraps();
    // 玩家初始位置
    playerPosition = { x: 0, y: 0 };
    // 创建玩家
    createPlayer();
}

function createGameBoard() {
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(i, j));
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function generateTreasure() {
    treasurePosition = {
        x: Math.floor(Math.random() * 5),
        y: Math.floor(Math.random() * 5)
    };
    // 在宝藏位置添加宝藏图片
    const treasureCell = gameBoard.children[treasurePosition.y].children[treasurePosition.x];
    treasureCell.innerHTML = '<img src="treasure.png" alt="宝藏">';
}

function generateTraps() {
    // 生成随机陷阱
    for (let i = 0; i < 3; i++) {
        let trapX, trapY;
        do {
            trapX = Math.floor(Math.random() * 5);
            trapY = Math.floor(Math.random() * 5);
        } while (trapX === treasurePosition.x && trapY === treasurePosition.y);
        traps.push({ x: trapX, y: trapY });
        const trapCell = gameBoard.children[trapY].children[trapX];
        trapCell.innerHTML = '<img src="trap.png" alt="陷阱">';
    }
}

function createPlayer() {
    const playerCell = gameBoard.children[playerPosition.y].children[playerPosition.x];
    playerCell.innerHTML = '<img src="player.png" alt="玩家">';
}

function handleCellClick(row, col) {
    if (row === treasurePosition.y && col === treasurePosition.x) {
        // 找到宝藏
        alert('恭喜你找到宝藏！');
        startGame(); // 重置游戏
    } else if (traps.some(trap => trap.x === col && trap.y === row)) {
        // 踩到陷阱
        alert('你踩到陷阱了！');
        startGame(); // 重置游戏
    } else {
        // 移动玩家
        const oldCell = gameBoard.children[playerPosition.y].children[playerPosition.x];
        oldCell.innerHTML = ''; // 清除之前玩家位置的图片
        playerPosition = { x: col, y: row };
        createPlayer();
    }
}