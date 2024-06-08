const board = document.querySelector(".board");
const playerTurnElement = document.querySelector(".player-turn");
const gameStatusElement = document.querySelector(".game-status");

// 游戏棋盘
const boardSize = 8;
const boardData = [];

// 初始化游戏棋盘
function initBoard() {
  for (let i = 0; i < boardSize; i++) {
    boardData[i] = [];
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      if ((i + j) % 2 === 0) {
        cell.classList.add("light");
      } else {
        cell.classList.add("dark");
      }
      board.appendChild(cell);
      boardData[i][j] = null;
    }
  }
  // 设置初始棋子位置
  // ...
}

// 玩家回合
let currentPlayer = 1;
function changePlayerTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  playerTurnElement.textContent = `玩家 ${currentPlayer} 的回合`;
}

// 检查游戏结束
function checkGameOver() {
  // ...
}

// 游戏逻辑
// ...

// 初始化游戏
initBoard();
changePlayerTurn();