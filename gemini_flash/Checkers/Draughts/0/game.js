// game.js (ES6 with Classes)

class Checkerboard {
  constructor(size = 8) {
    this.size = size;
    this.board = this.createBoard();
    this.currentPlayer = 'black';
    this.gameActive = true;
    this.selectedPiece = null;
    this.validMoves = [];
    this.blackPieces = 12;
    this.redPieces = 12;
    this.kings = { black: 0, red: 0 };
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
    // Calculate regular moves
    const validMoves = this.getRegularMoves(row, col);

    // Calculate capture moves
    const captureMoves = this.getCaptureMoves(row, col);

    // If capture moves exist, only capture moves are valid
    if (captureMoves.length > 0) {
      return captureMoves;
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
  }

  isValidMove(newRow, newCol) {
    return this.validMoves.some(move => move.row === newRow && move.col === newCol);
  }

  checkGameEnd() {
    // Check if any pieces left
    if (this.blackPieces === 0 || this.redPieces === 0) {
      this.gameActive = false;
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
      alert('Game over! Stalemate!');
    }
  }

  renderBoard() {
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = ''; // Clear previous board
    const boardHtml = this.board.map((row, rowIndex) => {
      return `<div class="row">
                ${row.map((cell, colIndex) => {
                  const pieceClass = cell.piece ? `piece ${cell.piece}` : 'empty';
                  const cellClass = `cell ${cell.color} ${this.selectedPiece && this.selectedPiece.row === rowIndex && this.selectedPiece.col === colIndex ? 'selected' : ''} ${this.validMoves.some(move => move.row === rowIndex && move.col === colIndex) ? 'valid-move' : ''}`;
                  return `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}">
                            <div class="${pieceClass}"></div>
                          </div>`;
                }).join('')}
              </div>`;
    }).join('');
    boardContainer.innerHTML = boardHtml;
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