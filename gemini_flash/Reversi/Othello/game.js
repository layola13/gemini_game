const boardSize = 8; // 棋盘大小
const board = []; // 棋盘数组
const blackScore = document.getElementById('blackScore');
const whiteScore = document.getElementById('whiteScore');
const currentTurn = document.getElementById('currentTurn');
let currentPlayer = 'Black'; // 当前玩家

// 初始化棋盘
function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = 'empty';
        }
    }
    // 初始化中间四个棋子
    board[3][3] = 'White';
    board[3][4] = 'Black';
    board[4][3] = 'Black';
    board[4][4] = 'White';
    updateBoard();
}

// 更新棋盘显示
function updateBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; // 清空棋盘
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (board[i][j] === 'Black') {
                cell.classList.add('black');
            } else if (board[i][j] === 'White') {
                cell.classList.add('white');
            }
            cell.addEventListener('click', handleClick);
            gameBoard.appendChild(cell);
        }
    }
}

// 点击棋盘格处理
function handleClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (isValidMove(row, col)) {
        makeMove(row, col);
        switchPlayer();
    }
}

// 检查是否为合法落子
function isValidMove(row, col) {
    if (board[row][col] !== 'empty') {
        return false;
    }
    // 检查周围是否有可翻转的棋子
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if (isFlipping(row, col, i, j)) {
                return true;
            }
        }
    }
    return false;
}

// 检查是否可以翻转棋子
function isFlipping(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    let foundOpponent = false;
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        if (board[r][c] === 'empty') {
            return false; // 没有遇到对手
        } else if (board[r][c] === currentPlayer) {
            return foundOpponent; // 遇到自己的棋子，如果之前遇到对手则返回true
        } else {
            foundOpponent = true; // 遇到对手
        }
        r += rowDir;
        c += colDir;
    }
    return false; // 没有遇到自己的棋子
}

// 执行落子
function makeMove(row, col) {
    board[row][col] = currentPlayer;
    // 翻转棋子
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if (isFlipping(row, col, i, j)) {
                flipPieces(row, col, i, j);
            }
        }
    }
    updateScore();
    updateBoard();
}

// 翻转棋子
function flipPieces(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    while (board[r][c] !== currentPlayer) {
        board[r][c] = currentPlayer;
        r += rowDir;
        c += colDir;
    }
}

// 切换玩家
function switchPlayer() {
    currentPlayer = currentPlayer === 'Black' ? 'White' : 'Black';
    currentTurn.textContent = currentPlayer;
}

// 更新得分
function updateScore() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 'Black') {
                blackCount++;
            } else if (board[i][j] === 'White') {
                whiteCount++;
            }
        }
    }
    blackScore.textContent = blackCount;
    whiteScore.textContent = whiteCount;
}

// 初始化游戏
initBoard();