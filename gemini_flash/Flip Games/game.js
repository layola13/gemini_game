const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const scoreElement = document.getElementById('score');

let score = 0;
let flippedCards = [];
let matchedCards = [];

const cardValues = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

// Shuffle the card values array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create the game board
function createBoard() {
    const shuffledCards = shuffleArray(cardValues);
    for (let i = 0; i < shuffledCards.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = shuffledCards[i];
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    }
}

// Flip a card
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Check if two flipped cards match
function checkMatch() {
    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
        // Match!
        score++;
        scoreElement.textContent = `Score: ${score}`;
        flippedCards.forEach(card => card.classList.add('matched'));
        matchedCards.push(...flippedCards);
        flippedCards = [];
        if (matchedCards.length === cardValues.length) {
            // All cards matched!
            alert('You win!');
            resetGame();
        }
    } else {
        // No match, flip back
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }
}

// Reset the game
function resetGame() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    flippedCards = [];
    matchedCards = [];
    board.innerHTML = '';
    createBoard();
}

// Initialize the game
createBoard();
resetButton.addEventListener('click', resetGame);