// game.js (ES6 with Classes)

const BOARD_SIZE = 8; // 常量定义棋盘大小
const BLACK_PIECE_IMG = "black_piece.png"; // 黑棋图片路径
const RED_PIECE_IMG = "red_piece.png"; // 红棋图片路径
const KING_PIECE_IMG = "king_piece.png"; // 王棋图片路径

class Checkerboard {
  constructor() {
    this.size = BOARD_SIZE;
    this.board = this.createBoard();
    this.currentPlayer = 'black';
    this.gameActive = false; // 游戏初始状态为暂停
    this.selectedPiece = null;
    this.validMoves = [];
    this.blackPieces = 12;
    this.redPieces = 12;
    this.kings = { black: 0, red: 0 };
    this.moveHistory = []; // 存储棋子移动历史记录

    // 初始化游戏状态
    this.updateGameInfo();

    // 绑定事件监听器
    document.getElementById('start-game').addEventListener('click', () => this.startGame());
    document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
    document.getElementById('pause-game').addEventListener('click', () => this.pauseGame());
    document.getElementById('undo-move').addEventListener('click', () => this.undoMove());
  }

  createBoard() {
    const board = [];
    for (let row = 0; row < this.size; row++) {
      const rowArray = [];
      for (let col = 0; col < this.size; col++) {
        const cell = {
          row,
          col,
          piece: null,
          color: (row + col) % 2 === 0 ? 'light' : 'dark'
        };
        rowArray.push(cell);
      }
      board.push(rowArray);
    }
    this.initializePieces();
    return board;
  }

  initializePieces() {
    // Initialize black pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < this.size; col++) {
        if ((row + col) % 2 !== 0) {
          this.board[row][col].piece = 'black';
        }
      }
    }

    // Initialize red pieces
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < this.size; col++) {
        if ((row + col) % 2 !== 0) {
          this.board[row][col].piece = 'red';
        }
      }
    }
  }

  getPiece(row, col) {
    return this.board[row][col].piece;
  }

  setPiece(row, col, piece) {
    this.board[row][col].piece = piece;
  }

  selectPiece(row, col) {
    if (this.gameActive && this.getPiece(row, col) === this.currentPlayer) {
      this.selectedPiece = { row, col };
      this.validMoves = this.calculateValidMoves(row, col);
    } else {
      this.selectedPiece = null;
      this.validMoves = [];
    }
  }

  movePiece(newRow, newCol) {
    if (this.gameActive && this.selectedPiece && this.isValidMove(newRow, newCol)) {
      const { row, col } = this.selectedPiece;
      const piece = this.getPiece(row, col);

      // 记录移动历史
      this.moveHistory.push({
        from: { row, col },
        to: { row: newRow, col: newCol },
        piece: piece
      });

      // Check for capture
      if (Math.abs(newRow - row) === 2) {
        this.capturePiece((newRow + row) / 2, (newCol + col) / 2);
      }

      // Move piece
      this.setPiece(row, col, null);
      this.setPiece(newRow, newCol, piece);

      // King promotion
      if ((piece === 'black' && newRow === 7) || (piece === 'red' && newRow === 0)) {
        this.promoteKing(newRow, newCol);
      }

      // Switch player
      this.switchPlayer();

      // Check for game end
      this.checkGameEnd();

      this.selectedPiece = null;
      this.validMoves = [];
    }
  }

  calculateValidMoves(row, col) {
    const validMoves = [];
    const direction = this.currentPlayer === 'black' ? 1 : -1;

    // Calculate capture moves first, as they take precedence
    validMoves.push(...this.getCaptureMoves(row, col));

    // If no capture moves, calculate regular moves
    if (validMoves.length === 0) {
      validMoves.push(...this.getRegularMoves(row, col));
    }

    return validMoves;
  }

  getRegularMoves(row, col) {
    const moves = [];
    const direction = this.currentPlayer === 'black' ? 1 : -1;

    // Diagonal moves
    if (row + direction >= 0 && row + direction < this.size) {
      if (col - 1 >= 0 && this.getPiece(row + direction, col - 1) === null) {
        moves.push({ row: row + direction, col: col - 1 });
      }
      if (col + 1 < this.size && this.getPiece(row + direction, col + 1) === null) {
        moves.push({ row: row + direction, col: col + 1 });
      }
    }

    return moves;
  }

  getCaptureMoves(row, col) {
    const moves = [];
    const direction = this.currentPlayer === 'black' ? 1 : -1;

    // Diagonal captures
    if (row + 2 * direction >= 0 && row + 2 * direction < this.size) {
      if (col - 2 >= 0 &&
        this.getPiece(row + direction, col - 1) !== null &&
        this.getPiece(row + direction, col - 1) !== this.currentPlayer &&
        this.getPiece(row + 2 * direction, col - 2) === null) {
        moves.push({ row: row + 2 * direction, col: col - 2 });
      }
      if (col + 2 < this.size &&
        this.getPiece(row + direction, col + 1) !== null &&
        this.getPiece(row + direction, col + 1) !== this.currentPlayer &&
        this.getPiece(row + 2 * direction, col + 2) === null) {
        moves.push({ row: row + 2 * direction, col: col + 2 });
      }
    }

    // King captures (both directions)
    if (this.getPiece(row, col) === 'king') {
      // 向下
      if (row + 2 * direction >= 0 && row + 2 * direction < this.size) {
        if (col - 2 >= 0 &&
          this.getPiece(row + direction, col - 1) !== null &&
          this.getPiece(row + direction, col - 1) !== this.currentPlayer &&
          this.getPiece(row + 2 * direction, col - 2) === null) {
          moves.push({ row: row + 2 * direction, col: col - 2 });
        }
        if (col + 2 < this.size &&
          this.getPiece(row + direction, col + 1) !== null &&
          this.getPiece(row + direction, col + 1) !== this.currentPlayer &&
          this.getPiece(row + 2 * direction, col + 2) === null) {
          moves.push({ row: row + 2 * direction, col: col + 2 });
        }
      }

      // 向上
      if (row - 2 * direction >= 0 && row - 2 * direction < this.size) {
        if (col - 2 >= 0 &&
          this.getPiece(row - direction, col - 1) !== null &&
          this.getPiece(row - direction, col - 1) !== this.currentPlayer &&
          this.getPiece(row - 2 * direction, col - 2) === null) {
          moves.push({ row: row - 2 * direction, col: col - 2 });
        }
        if (col + 2 < this.size &&
          this.getPiece(row - direction, col + 1) !== null &&
          this.getPiece(row - direction, col + 1) !== this.currentPlayer &&
          this.getPiece(row - 2 * direction, col + 2) === null) {
          moves.push({ row: row - 2 * direction, col: col + 2 });
        }
      }
    }

    return moves;
  }

  capturePiece(row, col) {
    const capturedPiece = this.getPiece(row, col);
    if (capturedPiece === 'black') {
      this.blackPieces--;
    } else {
      this.redPieces--;
    }
    this.setPiece(row, col, null);
  }

  promoteKing(row, col) {
    const piece = this.getPiece(row, col);
    this.setPiece(row, col, 'king');
    if (piece === 'black') {
      this.kings.black++;
    } else {
      this.kings.red++;
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'black' ? 'red' : 'black';
    this.updateGameInfo();
  }

  isValidMove(newRow, newCol) {
    return this.validMoves.some(move => move.row === newRow && move.col === newCol);
  }

  checkGameEnd() {
    // Check if any pieces left
    if (this.blackPieces === 0 || this.redPieces === 0) {
      this.gameActive = false;
      document.getElementById('game-status').textContent = '游戏结束';
      alert(`Game over! ${this.currentPlayer === 'black' ? 'Red' : 'Black'} wins!`);
      return;
    }

    // Check for stalemate
    let hasValidMoves = false;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.getPiece(row, col) === this.currentPlayer) {
          if (this.calculateValidMoves(row, col).length > 0) {
            hasValidMoves = true;
            break;
          }
        }
      }
      if (hasValidMoves) {
        break;
      }
    }

    if (!hasValidMoves) {
      this.gameActive = false;
      document.getElementById('game-status').textContent = '游戏结束';
      alert('Game over! Stalemate!');
    }
  }

  renderBoard() {
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = ''; // Clear previous board
    const boardHtml = this.board.map((row, rowIndex) => {
      return `<div class="row">
                ${row.map((cell, colIndex) => {
                  let pieceClass = 'empty';
                  let pieceSrc = '';
                  if (cell.piece) {
                    pieceClass = `piece ${cell.piece}`;
                    if (cell.piece === 'black') {
                      pieceSrc = BLACK_PIECE_IMG;
                    } else if (cell.piece === 'red') {
                      pieceSrc = RED_PIECE_IMG;
                    }
                    if (cell.piece === 'king') {
                      pieceSrc = KING_PIECE_IMG;
                    }
                  }
                  const cellClass = `cell ${cell.color} ${this.selectedPiece && this.selectedPiece.row === rowIndex && this.selectedPiece.col === colIndex ? 'selected' : ''} ${this.validMoves.some(move => move.row === rowIndex && move.col === colIndex) ? 'valid-move' : ''}`;
                  return `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}">
                            <img class="${pieceClass}" src="${pieceSrc}" alt="${cell.piece}">
                          </div>`;
                }).join('')}
              </div>`;
    }).join('');
    boardContainer.innerHTML = boardHtml;
  }

  updateGameInfo() {
    document.getElementById('current-player').textContent = this.currentPlayer;
    document.getElementById('black-pieces').textContent = this.blackPieces;
    document.getElementById('red-pieces').textContent = this.redPieces;
  }

  startGame() {
    this.gameActive = true;
    document.getElementById('game-status').textContent = '进行中';
    this.updateGameInfo();
    this.renderBoard();
  }

  restartGame() {
    this.gameActive = true;
    this.currentPlayer = 'black';
    this.blackPieces = 12;
    this.redPieces = 12;
    this.kings = { black: 0, red: 0 };
    this.board = this.createBoard();
    this.moveHistory = []; // 清空移动历史
    this.updateGameInfo();
    this.renderBoard();
  }

  pauseGame() {
    this.gameActive = false;
    document.getElementById('game-status').textContent = '暂停';
    this.updateGameInfo();
  }

  undoMove() {
    if (this.moveHistory.length > 0) {
      const lastMove = this.moveHistory.pop();
      const { from, to, piece } = lastMove;

      // 恢复棋子位置
      this.setPiece(from.row, from.col, piece);
      this.setPiece(to.row, to.col, null);

      // 恢复被吃棋子
      if (Math.abs(from.row - to.row) === 2) {
        this.capturePiece(to.row, to.col);
      }

      // 恢复王棋状态
      if (piece === 'king') {
        if (this.currentPlayer === 'black' && to.row === 7) {
          this.kings.black--;
        } else if (this.currentPlayer === 'red' && to.row === 0) {
          this.kings.red--;
        }
      }

      // 切换玩家
      this.switchPlayer();

      this.renderBoard();
    }
  }
}

const game = new Checkerboard();
game.renderBoard();

const boardContainer = document.getElementById('game-board');

boardContainer.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (game.selectedPiece) {
      game.movePiece(row, col);
    } else {
      game.selectPiece(row, col);
    }

    game.renderBoard();
  }
});