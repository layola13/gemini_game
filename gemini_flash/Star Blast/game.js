const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-button');

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
let score = 0;
let boardSize = 8; // Adjust board size as needed

// Create game board
function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.backgroundColor = getRandomColor();
    star.addEventListener('click', handleStarClick);
    board.appendChild(star);
  }
}

// Get random color from the colors array
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Handle star click event
function handleStarClick(event) {
  const clickedStar = event.target;
  const clickedIndex = Array.from(board.children).indexOf(clickedStar);

  // Check for adjacent stars of the same color
  const adjacentStars = findAdjacentStars(clickedIndex);

  // If at least 3 stars are the same color, remove them and update score
  if (adjacentStars.length >= 3) {
    removeStars(adjacentStars);
    score += adjacentStars.length;
    scoreElement.textContent = score;
  }
}

// Find adjacent stars of the same color
function findAdjacentStars(index) {
  const starColor = board.children[index].style.backgroundColor;
  const adjacentStars = [];
  const visited = new Set();

  // Recursive function to explore adjacent stars
  function explore(index) {
    visited.add(index);
    adjacentStars.push(index);
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Check adjacent positions (up, down, left, right)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const neighborIndex = (row + i) * boardSize + (col + j);
        if (
          neighborIndex >= 0 &&
          neighborIndex < boardSize * boardSize &&
          !visited.has(neighborIndex) &&
          board.children[neighborIndex].style.backgroundColor === starColor
        ) {
          explore(neighborIndex);
        }
      }
    }
  }

  explore(index);
  return adjacentStars;
}

// Remove stars from the board
function removeStars(starsToRemove) {
  starsToRemove.forEach(index => {
    board.children[index].remove();
  });
  // Add new stars to fill the gaps
  for (let i = 0; i < starsToRemove.length; i++) {
    const newStar = document.createElement('div');
    newStar.classList.add('star');
    newStar.style.backgroundColor = getRandomColor();
    newStar.addEventListener('click', handleStarClick);
    board.insertBefore(newStar, board.children[starsToRemove[i]]);
  }
}

// Restart the game
function restartGame() {
  score = 0;
  scoreElement.textContent = score;
  board.innerHTML = '';
  createBoard();
}

// Initialize the game
createBoard();
restartButton.addEventListener('click', restartGame);