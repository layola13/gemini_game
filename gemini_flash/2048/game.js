const gridSize = 4;
const board = [];
let score = 0;

const gameBoard = document.querySelector('.game-board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

// 初始化游戏
function initGame() {
    // 创建游戏棋盘
    for (let i = 0; i < gridSize; i++) {
        board[i] = [];
        for (let j = 0; j < gridSize; j++) {
            board[i][j] = 0;
        }
    }

    // 初始化分数
    score = 0;
    scoreDisplay.textContent = score;

    // 生成两个随机数字
    generateRandomTile();
    generateRandomTile();

    // 渲染游戏棋盘
    renderBoard();
}

// 生成随机数字
function generateRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];
        board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// 渲染游戏棋盘
function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (board[i][j] !== 0) {
                tile.textContent = board[i][j];
                tile.classList.add(`tile-${board[i][j]}`);
            }
            gameBoard.appendChild(tile);
        }
    }
}

// 处理用户输入
function handleInput(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            moved = moveTilesUp();
            break;
        case 'down':
            moved = moveTilesDown();
            break;
        case 'left':
            moved = moveTilesLeft();
            break;
        case 'right':
            moved = moveTilesRight();
            break;
    }

    if (moved) {
        generateRandomTile();
        renderBoard();
        checkGameOver();
    }
}

// 移动棋盘上的数字
function moveTilesUp() {
    let moved = false;
    for (let j = 0; j < gridSize; j++) {
        for (let i = 1; i < gridSize; i++) {
            if (board[i][j] !== 0) {
                let k = i;
                while (k > 0 && board[k - 1][j] === 0) {
                    board[k - 1][j] = board[k][j];
                    board[k][j] = 0;
                    k--;
                    moved = true;
                }
                if (k > 0 && board[k - 1][j] === board[k][j]) {
                    board[k - 1][j] *= 2;
                    score += board[k - 1][j];
                    board[k][j] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// 其他方向的移动函数类似，代码省略

// 检查游戏是否结束
function checkGameOver() {
    // 检查是否还有空闲的格子
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }

    // 检查是否还有可以合并的数字
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (i > 0 && board[i][j] === board[i - 1][j]) {
                return false;
            }
            if (i < gridSize - 1 && board[i][j] === board[i + 1][j]) {
                return false;
            }
            if (j > 0 && board[i][j] === board[i][j - 1]) {
                return false;
            }
            if (j < gridSize - 1 && board[i][j] === board[i][j + 1]) {
                return false;
            }
        }
    }

    // 游戏结束
    alert('Game Over!');
    return true;
}

// 监听键盘事件
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            handleInput('up');
            break;
        case 'ArrowDown':
            handleInput('down');
            break;
        case 'ArrowLeft':
            handleInput('left');
            break;
        case 'ArrowRight':
            handleInput('right');
            break;
    }
});

// 重置游戏
resetButton.addEventListener('click', () => {
    initGame();
});

// 初始化游戏
initGame();