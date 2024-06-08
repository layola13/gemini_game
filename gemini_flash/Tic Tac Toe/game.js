const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameStatusDisplay = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// 初始化游戏
function initGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayerDisplay.textContent = currentPlayer;
  gameStatusDisplay.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
  });
}

// 处理点击事件
function handleClick(event) {
  const cellIndex = parseInt(event.target.dataset.index);

  if (board[cellIndex] === '' && gameActive) {
    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkWin();
    switchPlayer();
  }
}

// 切换玩家
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerDisplay.textContent = currentPlayer;
}

// 检查是否获胜
function checkWin() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      gameStatusDisplay.textContent = `${currentPlayer} 获胜！`;
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
      return;
    }
  }

  // 检查平局
  if (!board.includes('') && gameActive) {
    gameActive = false;
    gameStatusDisplay.textContent = '平局！';
  }
}

// 重置游戏
function resetGame() {
  initGame();
}

// 初始化游戏
initGame();

// 重置按钮事件监听
resetButton.addEventListener('click', resetGame);