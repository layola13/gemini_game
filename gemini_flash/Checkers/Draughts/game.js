const board = document.querySelector('.board');
const player1Count = document.querySelector('.player1-count');
const player2Count = document.querySelector('.player2-count');

// 棋盘尺寸
const boardSize = 8;

// 棋子颜色
const player1Color = 'black';
const player2Color = 'white';

// 棋盘数据
let boardData = [];
for (let i = 0; i < boardSize; i++) {
  boardData[i] = [];
  for (let j = 0; j < boardSize; j++) {
    boardData[i][j] = null;
  }
}

// 初始化棋盘
function initBoard() {
  // 初始化棋盘数据
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (i <= 2 && (i + j) % 2 === 1) {
        boardData[i][j] = { color: player1Color, isKing: false };
      } else if (i >= 5 && (i + j) % 2 === 1) {
        boardData[i][j] = { color: player2Color, isKing: false };
      }
    }
  }

  // 渲染棋盘
  renderBoard();
}

// 渲染棋盘
function renderBoard() {
  board.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if ((i + j) % 2 === 0) {
        cell.classList.add('light');
      } else {
        cell.classList.add('dark');
        if (boardData[i][j]) {
          const piece = document.createElement('div');
          piece.classList.add('piece');
          piece.classList.add(boardData[i][j].color);
          if (boardData[i][j].isKing) {
            piece.classList.add('king');
          }
          cell.appendChild(piece);
        }
      }
      board.appendChild(cell);
    }
  }
}

// 游戏逻辑
function gameLogic() {
  // ...
}

// 初始化游戏
initBoard();
gameLogic();