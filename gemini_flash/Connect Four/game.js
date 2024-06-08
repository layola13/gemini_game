const board = [];
const rows = 6;
const columns = 7;
let currentPlayer = 1;
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const turnInfo = document.getElementById('turn-info');
const resetButton = document.getElementById('reset-button');

// Initialize the board with empty cells
function initBoard() {
  for (let i = 0; i < rows; i++) {
    board[i] = new Array(columns).fill(0);
  }
  renderBoard();
}

// Render the board on the screen
function renderBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleClick);
      if (board[i][j] === 1) {
        cell.classList.add('red');
      } else if (board[i][j] === 2) {
        cell.classList.add('yellow');
      }
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
}

// Handle cell click
function handleClick(event) {
  if (gameOver) return;

  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // Find the lowest available row in the column
  let availableRow = rows - 1;
  for (let i = rows - 1; i >= 0; i--) {
    if (board[i][col] === 0) {
      availableRow = i;
      break;
    }
  }

  // Update the board with the current player's color
  board[availableRow][col] = currentPlayer;

  // Check for a winner
  if (checkWin(availableRow, col)) {
    gameOver = true;
    turnInfo.textContent = `Player ${currentPlayer} Wins!`;
    return;
  }

  // Switch players
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnInfo.textContent = `Player ${currentPlayer}'s Turn ${currentPlayer === 1 ? '(Red)' : '(Yellow)' }`;
  renderBoard();
}

// Check for a winning condition
function checkWin(row, col) {
  // Check horizontal
  let count = 0;
  for (let i = 0; i < columns; i++) {
    if (board[row][i] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
  }

  // Check vertical
  count = 0;
  for (let i = 0; i < rows; i++) {
    if (board[i][col] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
  }

  // Check diagonals (top-left to bottom-right)
  count = 0;
  let i = row;
  let j = col;
  while (i >= 0 && j >= 0) {
    if (board[i][j] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
    i--;
    j--;
  }
  i = row + 1;
  j = col + 1;
  while (i < rows && j < columns) {
    if (board[i][j] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
    i++;
    j++;
  }

  // Check diagonals (bottom-left to top-right)
  count = 0;
  i = row;
  j = col;
  while (i < rows && j >= 0) {
    if (board[i][j] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
    i++;
    j--;
  }
  i = row - 1;
  j = col + 1;
  while (i >= 0 && j < columns) {
    if (board[i][j] === currentPlayer) {
      count++;
      if (count >= 4) {
        return true;
      }
    } else {
      count = 0;
    }
    i--;
    j++;
  }

  return false;
}

// Reset the game
function resetGame() {
  gameOver = false;
  currentPlayer = 1;
  initBoard();
  turnInfo.textContent = "Player 1's Turn (Red)";
}

// Initialize the game
initBoard();

// Reset button event listener
resetButton.addEventListener('click', resetGame);