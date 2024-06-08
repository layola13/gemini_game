const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const moveCountElement = document.getElementById('move-count');
const levelInfoElement = document.getElementById('level-info');

let moveCount = 0;
let currentLevel = 1;
let levelData = {
    1: {
        // 关卡 1 的地图数据
        grid: [
            "#####",
            "#   #",
            "# $ #",
            "#   #",
            "#####"
        ],
        playerPosition: [2, 2],
        boxPositions: [[2, 1]],
        targetPositions: [[2, 3]]
    },
    // 其他关卡数据
};

function createBoard(grid) {
    board.innerHTML = '';
    for (let row = 0; row < grid.length; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for (let col = 0; col < grid[row].length; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            switch (grid[row][col]) {
                case '#':
                    cellElement.classList.add('wall');
                    break;
                case '$':
                    cellElement.classList.add('box');
                    break;
                case '.':
                    cellElement.classList.add('target');
                    break;
                case '@':
                    cellElement.classList.add('player');
                    break;
            }
            rowElement.appendChild(cellElement);
        }
        board.appendChild(rowElement);
    }
}

function updateMoveCount() {
    moveCountElement.textContent = `步数: ${moveCount}`;
}

function updateLevelInfo() {
    levelInfoElement.textContent = `关卡: ${currentLevel}`;
}

function resetGame() {
    moveCount = 0;
    updateMoveCount();
    createBoard(levelData[currentLevel].grid);
    // 初始化玩家和箱子的位置
    // ...
}

function checkWinCondition() {
    // 检查所有箱子是否都在目标位置上
    // ...
}

function handleKeyDown(event) {
    const direction = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1]
    }[event.key];

    if (direction) {
        // 移动玩家，检查是否可以移动箱子
        // ...
        moveCount++;
        updateMoveCount();
        checkWinCondition();
    }
}

// 初始化游戏
resetGame();
updateLevelInfo();
document.addEventListener('keydown', handleKeyDown);
resetButton.addEventListener('click', resetGame);