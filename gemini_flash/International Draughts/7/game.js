// game.js
class Game {
  constructor() {
    this.board = this.createBoard();
    this.currentPlayer = "White";
    this.gameOver = false;
    this.gameMessage = "White's turn";
    this.selectedPiece = null;
    this.possibleMoves = [];
    this.gamePaused = false;
    this.moveHistory = [];
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
    // Place starting pieces (调整黑棋和白棋的初始位置)
    for (let row = 0; row < 4; row++) { // 白棋占据前四行
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 !== 0) {
          this.board[row][col].piece = {
            color: "White",
            king: false,
          };
        }
      }
    }
    for (let row = 6; row < 10; row++) { // 黑棋占据后四行
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 !== 0) {
          this.board[row][col].piece = {
            color: "Black",
            king: false,
          };
        }
      }
    }

    this.gameOver = false;
    this.currentPlayer = "White";
    this.gameMessage = "White's turn";
    this.gamePaused = false;
    this.moveHistory = [];
    this.renderBoard();
    this.updateGameStatus();
    this.enableBoard();
    document.getElementById("undo-button").disabled = true;
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
    if (this.gameOver || this.gamePaused) return; // 游戏结束或暂停无法操作

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
        this.possibleMoves = this.getValidMoves(row, col);
        this.renderBoard();
        this.highlightPossibleMoves();
      }
    }
  }

  getValidMoves(row, col) {
    const piece = this.board[row][col].piece;
    let moves = [];
    const possibleDirections = piece.king
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : piece.color === "White"
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

    // 1. 优先计算可以吃子的走法
    moves = this.getCaptureMoves(row, col, possibleDirections);
    if (moves.length > 0) {
      return moves; // 如果有可以吃子的走法，则只返回这些走法
    }

    // 2. 如果没有可以吃子的走法，则计算普通走法
    for (const [directionRow, directionCol] of possibleDirections) {
      let nextRow = row + directionRow;
      let nextCol = col + directionCol;

      if (nextRow >= 0 && nextRow < 10 && nextCol >= 0 && nextCol < 10) {
        const nextSquare = this.board[nextRow][nextCol];

        if (!nextSquare.piece) {
          moves.push({ row: nextRow, col: nextCol });
        }
      }
    }

    return moves;
  }

  getCaptureMoves(row, col, possibleDirections) {
    const piece = this.board[row][col].piece;
    const captureMoves = [];

    for (const [directionRow, directionCol] of possibleDirections) {
      let nextRow = row + directionRow;
      let nextCol = col + directionCol;

      if (nextRow >= 0 && nextRow < 10 && nextCol >= 0 && nextCol < 10) {
        const nextSquare = this.board[nextRow][nextCol];

        if (nextSquare.piece && nextSquare.piece.color !== piece.color) {
          const jumpRow = nextRow + directionRow;
          const jumpCol = nextCol + directionCol;

          if (
            jumpRow >= 0 &&
            jumpRow < 10 &&
            jumpCol >= 0 &&
            jumpCol < 10 &&
            !this.board[jumpRow][jumpCol].piece
          ) {
            captureMoves.push({ row: jumpRow, col: jumpCol });
            // 继续查找是否有连续吃子
            const moreCaptureMoves = this.getCaptureMoves(jumpRow, jumpCol, possibleDirections);
            if (moreCaptureMoves.length > 0) {
              captureMoves.push(...moreCaptureMoves);
            }
          }
        }
      }
    }

    return captureMoves;
  }

  highlightPossibleMoves() {
    for (const move of this.possibleMoves) {
      // 使用更精确的选择器
      const squareIndex = move.row * 10 + move.col;
      const square = document.querySelectorAll('.square')[squareIndex];
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

    this.moveHistory.push({
      from: { row: oldRow, col: oldCol },
      to: { row: newRow, col: newCol },
    });
    document.getElementById("undo-button").disabled = false;
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

  enableBoard() {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", this.handleSquareClick);
    });
  }

  addGameControlListeners() {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const pauseButton = document.getElementById("pause-button");
    const undoButton = document.getElementById("undo-button");

    startButton.addEventListener("click", () => {
      this.initializeGame();
      startButton.disabled = true;
      restartButton.disabled = false;
      pauseButton.disabled = false;
    });

    restartButton.addEventListener("click", () => {
      this.initializeGame();
    });

    pauseButton.addEventListener("click", () => {
      this.gamePaused = !this.gamePaused;
      if (this.gamePaused) {
        pauseButton.textContent = "Resume Game";
        this.gameMessage = "Game Paused";
        this.disableBoard();
      } else {
        pauseButton.textContent = "Pause Game";
        this.gameMessage = `${this.currentPlayer}'s turn`;
        this.enableBoard();
      }
      this.updateGameStatus();
    });

    undoButton.addEventListener("click", () => {
      if (this.moveHistory.length > 0) {
        const lastMove = this.moveHistory.pop();
        const { row: oldRow, col: oldCol } = lastMove.from;
        const { row: newRow, col: newCol } = lastMove.to;

        // 将棋子移回原位
        this.board[newRow][newCol].piece = null;
        this.board[oldRow][oldCol].piece = {
          color: this.currentPlayer === "White" ? "White" : "Black",
          king: this.board[newRow][newCol].piece?.king || false,
        };

        // 检查是否有被吃掉的棋子
        if (Math.abs(newRow - oldRow) === 2) {
          const capturedRow = (newRow + oldRow) / 2;
          const capturedCol = (newCol + oldCol) / 2;
          this.board[capturedRow][capturedCol].piece = {
            color: this.currentPlayer === "White" ? "Black" : "White",
            king: false,
          };
        }

        // 切换玩家
        this.switchPlayer();
        this.renderBoard();
        this.updateGameStatus();
        if (this.moveHistory.length === 0) {
          undoButton.disabled = true;
        }
      }
    });
  }
}

const game = new Game();