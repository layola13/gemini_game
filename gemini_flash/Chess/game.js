const board = document.getElementById('board');
const turnElement = document.getElementById('turn');
const movesElement = document.getElementById('moves');

// Chessboard setup
const boardSize = 8;
let boardState = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
let turn = 'white';
let selectedPiece = null;
let moves = [];

// Piece types
const pieces = {
  'white': {
    'king': '♔',
    'queen': '♕',
    'rook': '♖',
    'bishop': '♗',
    'knight': '♘',
    'pawn': '♙'
  },
  'black': {
    'king': '♚',
    'queen': '♛',
    'rook': '♜',
    'bishop': '♝',
    'knight': '♞',
    'pawn': '♟'
  }
};

// Initialize the board
function initBoard() {
  board.innerHTML = '';
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      cell.style.backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
      board.appendChild(cell);
    }
  }
  // Place starting pieces
  placePieces();
  updateTurn();
}

// Place starting pieces
function placePieces() {
  // Pawns
  for (let i = 0; i < boardSize; i++) {
    boardState[1][i] = { type: 'pawn', color: 'black' };
    boardState[6][i] = { type: 'pawn', color: 'white' };
  }
  // Rooks
  boardState[0][0] = { type: 'rook', color: 'black' };
  boardState[0][7] = { type: 'rook', color: 'black' };
  boardState[7][0] = { type: 'rook', color: 'white' };
  boardState[7][7] = { type: 'rook', color: 'white' };
  // Knights
  boardState[0][1] = { type: 'knight', color: 'black' };
  boardState[0][6] = { type: 'knight', color: 'black' };
  boardState[7][1] = { type: 'knight', color: 'white' };
  boardState[7][6] = { type: 'knight', color: 'white' };
  // Bishops
  boardState[0][2] = { type: 'bishop', color: 'black' };
  boardState[0][5] = { type: 'bishop', color: 'black' };
  boardState[7][2] = { type: 'bishop', color: 'white' };
  boardState[7][5] = { type: 'bishop', color: 'white' };
  // Queen
  boardState[0][3] = { type: 'queen', color: 'black' };
  boardState[7][3] = { type: 'queen', color: 'white' };
  // King
  boardState[0][4] = { type: 'king', color: 'black' };
  boardState[7][4] = { type: 'king', color: 'white' };
  // Update board display
  updateBoardDisplay();
}

// Update board display
function updateBoardDisplay() {
  const cells = board.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const piece = boardState[row][col];
    if (piece) {
      const symbol = pieces[piece.color][piece.type];
      cell.textContent = symbol;
    }
  });
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  // If no piece selected, select piece
  if (!selectedPiece) {
    if (boardState[row][col] && boardState[row][col].color === turn) {
      selectedPiece = { row, col };
      highlightPossibleMoves(row, col);
    }
  } else {
    // If piece selected, move piece
    if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      updateTurn();
      selectedPiece = null;
    } else {
      // If invalid move, deselect piece
      selectedPiece = null;
      highlightPossibleMoves(row, col);
    }
  }
}

// Highlight possible moves
function highlightPossibleMoves(row, col) {
  const possibleMoves = getPossibleMoves(row, col);
  possibleMoves.forEach(move => {
    const cell = board.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
    cell.classList.add('highlight');
  });
}

// Remove highlight from all cells
function removeHighlights() {
  const cells = board.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('highlight');
  });
}

// Get possible moves for a piece
function getPossibleMoves(row, col) {
  const piece = boardState[row][col];
  const possibleMoves = [];
  // Handle different piece types
  switch (piece.type) {
    case 'pawn':
      // Forward movement
      if (piece.color === 'white' && row > 0 && boardState[row - 1][col] === null) {
        possibleMoves.push({ row: row - 1, col });
        if (row === 6 && boardState[row - 2][col] === null) {
          possibleMoves.push({ row: row - 2, col });
        }
      }
      if (piece.color === 'black' && row < boardSize - 1 && boardState[row + 1][col] === null) {
        possibleMoves.push({ row: row + 1, col });
        if (row === 1 && boardState[row + 2][col] === null) {
          possibleMoves.push({ row: row + 2, col });
        }
      }
      // Diagonal capture
      if (piece.color === 'white' && row > 0 && col > 0 && boardState[row - 1][col - 1] && boardState[row - 1][col - 1].color === 'black') {
        possibleMoves.push({ row: row - 1, col: col - 1 });
      }
      if (piece.color === 'white' && row > 0 && col < boardSize - 1 && boardState[row - 1][col + 1] && boardState[row - 1][col + 1].color === 'black') {
        possibleMoves.push({ row: row - 1, col: col + 1 });
      }
      if (piece.color === 'black' && row < boardSize - 1 && col > 0 && boardState[row + 1][col - 1] && boardState[row + 1][col - 1].color === 'white') {
        possibleMoves.push({ row: row + 1, col: col - 1 });
      }
      if (piece.color === 'black' && row < boardSize - 1 && col < boardSize - 1 && boardState[row + 1][col + 1] && boardState[row + 1][col + 1].color === 'white') {
        possibleMoves.push({ row: row + 1, col: col + 1 });
      }
      break;
    case 'rook':
      // Horizontal and vertical movement
      for (let i = col + 1; i < boardSize; i++) {
        if (boardState[row][i] === null) {
          possibleMoves.push({ row, col: i });
        } else if (boardState[row][i].color !== piece.color) {
          possibleMoves.push({ row, col: i });
          break;
        } else {
          break;
        }
      }
      for (let i = col - 1; i >= 0; i--) {
        if (boardState[row][i] === null) {
          possibleMoves.push({ row, col: i });
        } else if (boardState[row][i].color !== piece.color) {
          possibleMoves.push({ row, col: i });
          break;
        } else {
          break;
        }
      }
      for (let i = row + 1; i < boardSize; i++) {
        if (boardState[i][col] === null) {
          possibleMoves.push({ row: i, col });
        } else if (boardState[i][col].color !== piece.color) {
          possibleMoves.push({ row: i, col });
          break;
        } else {
          break;
        }
      }
      for (let i = row - 1; i >= 0; i--) {
        if (boardState[i][col] === null) {
          possibleMoves.push({ row: i, col });
        } else if (boardState[i][col].color !== piece.color) {
          possibleMoves.push({ row: i, col });
          break;
        } else {
          break;
        }
      }
      break;
    case 'knight':
      // L-shaped movement
      if (row + 2 < boardSize && col + 1 < boardSize && (boardState[row + 2][col + 1] === null || boardState[row + 2][col + 1].color !== piece.color)) {
        possibleMoves.push({ row: row + 2, col: col + 1 });
      }
      if (row + 2 < boardSize && col - 1 >= 0 && (boardState[row + 2][col - 1] === null || boardState[row + 2][col - 1].color !== piece.color)) {
        possibleMoves.push({ row: row + 2, col: col - 1 });
      }
      if (row - 2 >= 0 && col + 1 < boardSize && (boardState[row - 2][col + 1] === null || boardState[row - 2][col + 1].color !== piece.color)) {
        possibleMoves.push({ row: row - 2, col: col + 1 });
      }
      if (row - 2 >= 0 && col - 1 >= 0 && (boardState[row - 2][col - 1] === null || boardState[row - 2][col - 1].color !== piece.color)) {
        possibleMoves.push({ row: row - 2, col: col - 1 });
      }
      if (row + 1 < boardSize && col + 2 < boardSize && (boardState[row + 1][col + 2] === null || boardState[row + 1][col + 2].color !== piece.color)) {
        possibleMoves.push({ row: row + 1, col: col + 2 });
      }
      if (row + 1 < boardSize && col - 2 >= 0 && (boardState[row + 1][col - 2] === null || boardState[row + 1][col - 2].color !== piece.color)) {
        possibleMoves.push({ row: row + 1, col: col - 2 });
      }
      if (row - 1 >= 0 && col + 2 < boardSize && (boardState[row - 1][col + 2] === null || boardState[row - 1][col + 2].color !== piece.color)) {
        possibleMoves.push({ row: row - 1, col: col + 2 });
      }
      if (row - 1 >= 0 && col - 2 >= 0 && (boardState[row - 1][col - 2] === null || boardState[row - 1][col - 2].color !== piece.color)) {
        possibleMoves.push({ row: row - 1, col: col - 2 });
      }
      break;
    case 'bishop':
      // Diagonal movement
      for (let i = 1; i < boardSize; i++) {
        if (row + i < boardSize && col + i < boardSize && boardState[row + i][col + i] === null) {
          possibleMoves.push({ row: row + i, col: col + i });
        } else if (row + i < boardSize && col + i < boardSize && boardState[row + i][col + i].color !== piece.color) {
          possibleMoves.push({ row: row + i, col: col + i });
          break;
        } else {
          break;
        }
      }
      for (let i = 1; i < boardSize; i++) {
        if (row + i < boardSize && col - i >= 0 && boardState[row + i][col - i] === null) {
          possibleMoves.push({ row: row + i, col: col - i });
        } else if (row + i < boardSize && col - i >= 0 && boardState[row + i][col - i].color !== piece.color) {
          possibleMoves.push({ row: row + i, col: col - i });
          break;
        } else {
          break;
        }
      }
      for (let i = 1; i < boardSize; i++) {
        if (row - i >= 0 && col + i < boardSize && boardState[row - i][col + i] === null) {
          possibleMoves.push({ row: row - i, col: col + i });
        } else if (row - i >= 0 && col + i < boardSize && boardState[row - i][col + i].color !== piece.color) {
          possibleMoves.push({ row: row - i, col: col + i });
          break;
        } else {
          break;
        }
      }
      for (let i = 1; i < boardSize; i++) {
        if (row - i >= 0 && col - i >= 0 && boardState[row - i][col - i] === null) {
          possibleMoves.push({ row: row - i, col: col - i });
        } else if (row - i >= 0 && col - i >= 0 && boardState[row - i][col - i].color !== piece.color) {
          possibleMoves.push({ row: row - i, col: col - i });
          break;
        } else {
          break;
        }
      }
      break;
    case 'queen':
      // Combine rook and bishop movement
      possibleMoves.push(...getPossibleMoves(row, col, 'rook'));
      possibleMoves.push(...getPossibleMoves(row, col, 'bishop'));
      break;
    case 'king':
      // One square in any direction
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          if (row + i >= 0 && row + i < boardSize && col + j >= 0 && col + j < boardSize && (boardState[row + i][col + j] === null || boardState[row + i][col + j].color !== piece.color)) {
            possibleMoves.push({ row: row + i, col: col + j });
          }
        }
      }
      break;
  }
  return possibleMoves;
}

// Check if a move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = boardState[fromRow][fromCol];
  const possibleMoves = getPossibleMoves(fromRow, fromCol);
  return possibleMoves.some(move => move.row === toRow && move.col === toCol);
}

// Move a piece
function movePiece(fromRow, fromCol, toRow, toCol) {
  boardState[toRow][toCol] = boardState[fromRow][fromCol];
  boardState[fromRow][fromCol] = null;
  updateBoardDisplay();
  moves.push(`${turn.toUpperCase()} ${pieces[turn][boardState[toRow][toCol].type]} ${String.fromCharCode(toCol + 97)}${toRow + 1}`);
  updateMoves();
}

// Update turn
function updateTurn() {
  turn = turn === 'white' ? 'black' : 'white';
  turnElement.textContent = `${turn.toUpperCase()}'s Turn`;
}

// Update moves list
function updateMoves() {
  movesElement.innerHTML = '';
  moves.forEach(move => {
    const moveElement = document.createElement('div');
    moveElement.textContent = move;
    movesElement.appendChild(moveElement);
  });
}

// Initialize the game
initBoard();