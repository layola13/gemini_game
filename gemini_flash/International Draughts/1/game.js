// game.js
class Game {
  constructor() {
    this.board = this.createBoard();
    this.currentPlayer = "White";
    this.gameOver = false;
    this.gameMessage = "White's turn";
    this.selectedPiece = null;
    this.possibleMoves = [];
    this.initializeGame();
    this.addGameControlListeners();
  }

  createBoard() {
    const board = [];
    for (let row = 0; row < 10; row++) {
      const boardRow = [];
      for (let col = 0; col < 10; col++) {
        boardRow.push({
          color: (row + col) % 2 === 0 ? "light" : "dark",
          piece: null,
        });
      }
      board.push(boardRow);
    }
    return board;
  }

  initializeGame() {
    // Place starting pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 !== 0) {
          this.board[row][col].piece = {
            color: row < 2 ? "Black" : "White",
            king: false,
          };
        }
      }
    }

    this.gameOver = false;
    this.currentPlayer = "White";
    this.gameMessage = "White's turn";
    this.renderBoard();
    this.updateGameStatus();
  }

  renderBoard() {
    const boardContainer = document.getElementById("game-board");
    boardContainer.innerHTML = "";

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const square = document.createElement("div");
        square.classList.add("square", this.board[row][col].color);

        if (this.board[row][col].piece) {
          const piece = document.createElement("div");
          piece.classList.add("piece", this.board[row][col].piece.color);
          if (this.board[row][col].piece.king) {
            piece.classList.add("king");
          }
          square.appendChild(piece);
        }

        square.addEventListener("click", () => {
          this.handleSquareClick(row, col);
        });

        boardContainer.appendChild(square);
      }
    }
  }

  handleSquareClick(row, col) {
    if (this.gameOver) return; // 游戏结束无法操作

    if (this.selectedPiece) {
      if (this.possibleMoves.some((move) => move.row === row && move.col === col)) {
        this.movePiece(row, col);
      } else {
        this.selectedPiece = null;
        this.possibleMoves = [];
        this.renderBoard();
      }
    } else {
      if (this.board[row][col].piece && this.board[row][col].piece.color === this.currentPlayer) {
        this.selectedPiece = { row, col };
        this.possibleMoves = this.getPossibleMoves(row, col);
        this.renderBoard();
        this.highlightPossibleMoves();
      }
    }
  }

  getPossibleMoves(row, col) {
    const piece = this.board[row][col].piece;
    const moves = [];
    const directions = piece.king
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : piece.color === "White"
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

    for (const [directionRow, directionCol] of directions) {
      let nextRow = row + directionRow;
      let nextCol = col + directionCol;

      if (nextRow >= 0 && nextRow < 10 && nextCol >= 0 && nextCol < 10) {
        const nextSquare = this.board[nextRow][nextCol];

        if (!nextSquare.piece) {
          moves.push({ row: nextRow, col: nextCol });
        } else if (nextSquare.piece.color !== piece.color) {
          const jumpRow = nextRow + directionRow;
          const jumpCol = nextCol + directionCol;

          if (
            jumpRow >= 0 &&
            jumpRow < 10 &&
            jumpCol >= 0 &&
            jumpCol < 10 &&
            !this.board[jumpRow][jumpCol].piece
          ) {
            moves.push({ row: jumpRow, col: jumpCol });
          }
        }
      }
    }

    return moves;
  }

  highlightPossibleMoves() {
    for (const move of this.possibleMoves) {
      const square = document.querySelector(`.square:nth-child(${move.col + 1})`);
      square.classList.add("possible-move");
    }
  }

  movePiece(newRow, newCol) {
    const oldRow = this.selectedPiece.row;
    const oldCol = this.selectedPiece.col;
    this.board[newRow][newCol].piece = this.board[oldRow][oldCol].piece;
    this.board[oldRow][oldCol].piece = null;

    if (newRow === 9 && this.board[newRow][newCol].piece.color === "White") {
      this.board[newRow][newCol].piece.king = true;
    } else if (newRow === 0 && this.board[newRow][newCol].piece.color === "Black") {
      this.board[newRow][newCol].piece.king = true;
    }

    if (Math.abs(newRow - oldRow) === 2) {
      const capturedRow = (newRow + oldRow) / 2;
      const capturedCol = (newCol + oldCol) / 2;
      this.board[capturedRow][capturedCol].piece = null;
    }

    this.selectedPiece = null;
    this.possibleMoves = [];
    this.renderBoard();

    this.switchPlayer();
    this.checkGameOver();
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "White" ? "Black" : "White";
    this.gameMessage = `${this.currentPlayer}'s turn`;
    this.updateGameStatus();
  }

  updateGameStatus() {
    document.getElementById("current-player").textContent = this.currentPlayer;
    document.getElementById("game-message").textContent = this.gameMessage;
  }

  checkGameOver() {
    // 检查一方是否没有棋子
    let whitePieces = 0;
    let blackPieces = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.board[row][col].piece) {
          if (this.board[row][col].piece.color === "White") {
            whitePieces++;
          } else {
            blackPieces++;
          }
        }
      }
    }

    if (whitePieces === 0 || blackPieces === 0) {
      this.gameOver = true;
      this.gameMessage = `${this.currentPlayer === "White" ? "Black" : "White"} wins!`;
      this.updateGameStatus();
      this.disableBoard();
    }
  }

  disableBoard() {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.removeEventListener("click", this.handleSquareClick);
    });
  }

  addGameControlListeners() {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");

    startButton.addEventListener("click", () => {
      this.initializeGame();
      startButton.disabled = true;
      restartButton.disabled = false;
    });

    restartButton.addEventListener("click", () => {
      this.initializeGame();
    });
  }
}

const game = new Game();