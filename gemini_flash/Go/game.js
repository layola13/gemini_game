const boardSize = 19; // 棋盘大小
const board = []; // 棋盘数组
const black = 1; // 黑棋
const white = 2; // 白棋
const empty = 0; // 空格

// 初始化棋盘
function initBoard() {
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = empty;
    }
  }
  // 初始化棋盘中心
  board[boardSize / 2 - 1][boardSize / 2 - 1] = black;
  board[boardSize / 2][boardSize / 2] = black;
  board[boardSize / 2 - 1][boardSize / 2] = white;
  board[boardSize / 2][boardSize / 2 - 1] = white;
}

// 绘制棋盘
function drawBoard() {
  const boardContainer = document.getElementById('game-board');
  boardContainer.innerHTML = ''; // 清空棋盘

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.gridRow = i + 1;
      cell.style.gridColumn = j + 1;
      if (board[i][j] === black) {
        cell.classList.add('black');
      } else if (board[i][j] === white) {
        cell.classList.add('white');
      }
      cell.addEventListener('click', () => {
        placeStone(i, j);
      });
      boardContainer.appendChild(cell);
    }
  }
}

// 落子
function placeStone(row, col) {
  // 检查是否为空格
  if (board[row][col] !== empty) {
    return;
  }

  // 落子
  board[row][col] = currentPlayer;

  // 绘制棋盘
  drawBoard();

  // 切换玩家
  currentPlayer = currentPlayer === black ? white : black;
}

// 游戏逻辑
let currentPlayer = black; // 当前玩家

initBoard();
drawBoard();