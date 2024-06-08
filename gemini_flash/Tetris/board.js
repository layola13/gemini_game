// board.js
export const blockSize = 30;
export const boardWidth = 10;
export const boardHeight = 20;
export let board = [];

// 初始化游戏板
export function initBoard() {
  board = [];
  for (let i = 0; i < boardHeight; i++) {
    board[i] = [];
    for (let j = 0; j < boardWidth; j++) {
      board[i][j] = 0;
    }
  }
}

// 绘制游戏板
export function drawBoard(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (board[row][col] !== 0) {
        ctx.fillStyle = board[row][col];
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

// 将方块固定到游戏板
export function fixPiece(ctx) {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[0].length; col++) {
      if (currentPiece.shape[row][col] === 1) {
        board[currentPiece.y + row][currentPiece.x + col] = currentPiece.color;
      }
    }
  }
  // 检查是否消除行
  checkRows();
  // 生成新的方块
  currentPiece = nextPiece;
  nextPiece = generatePiece();
}

// 检查是否消除行
export function checkRows() {
  let rowsCleared = 0;
  for (let row = 0; row < boardHeight; row++) {
    if (board[row].every((cell) => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(new Array(boardWidth).fill(0));
      rowsCleared++;
    }
  }
  // 更新得分
  updateScore(score + rowsCleared * 100);
}