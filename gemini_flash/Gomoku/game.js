const board = document.querySelector('.game-board');
const resetButton = document.getElementById('reset-button');
const currentPlayerDisplay = document.getElementById('current-player');

// 游戏状态
let boardState = Array.from({ length: 15 }, () => Array(15).fill(0));
let currentPlayer = 1; // 1 黑棋，-1 白棋
let gameOver = false;

// 创建游戏棋盘
function createBoard() {
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleClick);
      board.appendChild(cell);
    }
  }
}

// 处理点击事件
function handleClick(event) {
  if (gameOver) return;

  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  // 检查该位置是否为空
  if (boardState[row][col] !== 0) return;

  // 设置棋子
  boardState[row][col] = currentPlayer;
  event.target.classList.add(currentPlayer === 1 ? 'black' : 'white');

  // 检查是否获胜
  if (checkWin(row, col)) {
    gameOver = true;
    alert(`玩家 ${currentPlayer === 1 ? '黑棋' : '白棋'} 获胜!`);
    return;
  }

  // 切换玩家
  currentPlayer *= -1;
  currentPlayerDisplay.textContent = currentPlayer === 1 ? '黑棋' : '白棋';
}

// 检查是否获胜
function checkWin(row, col) {
  // 检查横向
  if (checkLine(row, col, 0, 1)) return true;
  // 检查纵向
  if (checkLine(row, col, 1, 0)) return true;
  // 检查斜向 (左上到右下)
  if (checkLine(row, col, 1, 1)) return true;
  // 检查斜向 (右上到左下)
  if (checkLine(row, col, 1, -1)) return true;
  return false;
}

// 检查指定方向上的连线
function checkLine(row, col, rowDir, colDir) {
  let count = 1; // 当前棋子算一个
  // 向一个方向检查
  for (let i = 1; i < 5; i++) {
    const nextRow = row + i * rowDir;
    const nextCol = col + i * colDir;
    if (nextRow < 0 || nextRow >= 15 || nextCol < 0 || nextCol >= 15) break;
    if (boardState[nextRow][nextCol] === currentPlayer) {
      count++;
    } else {
      break;
    }
  }
  // 向另一个方向检查
  for (let i = 1; i < 5; i++) {
    const nextRow = row - i * rowDir;
    const nextCol = col - i * colDir;
    if (nextRow < 0 || nextRow >= 15 || nextCol < 0 || nextCol >= 15) break;
    if (boardState[nextRow][nextCol] === currentPlayer) {
      count++;
    } else {
      break;
    }
  }
  return count >= 5;
}

// 重新开始游戏
function resetGame() {
  gameOver = false;
  currentPlayer = 1;
  currentPlayerDisplay.textContent = '黑棋';
  boardState = Array.from({ length: 15 }, () => Array(15).fill(0));
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('black');
    cell.classList.remove('white');
  });
}

// 初始化游戏
createBoard();
resetButton.addEventListener('click', resetGame);