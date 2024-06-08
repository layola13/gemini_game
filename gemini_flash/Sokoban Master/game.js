const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const undoButton = document.getElementById('undo-button');

// 地图数据
const mapData = [
    "########",
    "#  ..  #",
    "#  .  #",
    "# . # #",
    "#$  $ #",
    "#  .  #",
    "########"
];

// 游戏状态
let currentLevel = 1;
let moves = 0;
let history = [];

// 游戏元素
const cellSize = 40;
const boxImage = "📦";
const playerImage = "👨‍💼";
const wallImage = "🧱";
const targetImage = "🎯";
const emptyImage = " ";

// 初始化游戏
function initGame() {
    createBoard();
    resetGame();
    updateMovesDisplay();
}

// 创建游戏面板
function createBoard() {
    const level = mapData[currentLevel - 1];
    for (let i = 0; i < level.length; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < level.length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = j;
            cell.dataset.y = i;
            cell.textContent = level[j];
            renderCell(cell);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// 重置游戏
function resetGame() {
    moves = 0;
    history = [];
    updateMovesDisplay();
    renderGame();
}

// 撤销操作
function undoMove() {
    if (history.length > 0) {
        const lastMove = history.pop();
        const [x, y, targetX, targetY] = lastMove;
        const targetCell = document.querySelector(`.cell[data-x="${targetX}"][data-y="${targetY}"]`);
        const currentCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        targetCell.textContent = currentCell.textContent;
        currentCell.textContent = playerImage;
        moves--;
        updateMovesDisplay();
    }
}

// 更新移动次数显示
function updateMovesDisplay() {
    // TODO: Implement moves display
}

// 渲染游戏状态
function renderGame() {
    // TODO: Implement rendering based on mapData and game state
}

// 渲染单元格
function renderCell(cell) {
    const content = cell.textContent;
    switch (content) {
        case boxImage:
            cell.style.backgroundImage = `url("box.png")`;
            break;
        case playerImage:
            cell.style.backgroundImage = `url("player.png")`;
            break;
        case wallImage:
            cell.style.backgroundImage = `url("wall.png")`;
            break;
        case targetImage:
            cell.style.backgroundImage = `url("target.png")`;
            break;
        case emptyImage:
            cell.style.backgroundImage = "none";
            break;
    }
}

// 监听按键事件
document.addEventListener('keydown', (event) => {
    // TODO: Implement key press handling for movement
});

// 监听按钮点击事件
resetButton.addEventListener('click', resetGame);
undoButton.addEventListener('click', undoMove);

// 初始化游戏
initGame();