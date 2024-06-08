const board = document.getElementById('game-board');
const nextPiece = document.getElementById('next-piece');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

const ROWS = 10;
const COLS = 8;
const BLOCK_SIZE = 30;

let boardArray = [];
let currentPiece = null;
let nextPieceShape = null;
let score = 0;
let gameOver = true;

const colors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink'
];

const shapes = [
    // I
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    // J
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // O
    [
        [1, 1],
        [1, 1]
    ],
    // S
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    // T
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

function createBoard() {
    boardArray = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    board.innerHTML = '';

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const block = document.createElement('div');
            block.style.width = `${BLOCK_SIZE}px`;
            block.style.height = `${BLOCK_SIZE}px`;
            block.style.border = '1px solid black';
            block.style.backgroundColor = 'white';
            block.style.position = 'absolute';
            block.style.left = `${col * BLOCK_SIZE}px`;
            block.style.top = `${row * BLOCK_SIZE}px`;
            block.dataset.row = row;
            block.dataset.col = col;
            board.appendChild(block);
        }
    }
}

function drawPiece(piece) {
    piece.blocks.forEach(block => {
        const row = block.row;
        const col = block.col;
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            const blockElement = board.children[row * COLS + col];
            blockElement.style.backgroundColor = piece.color;
        }
    });
}

function clearPiece(piece) {
    piece.blocks.forEach(block => {
        const row = block.row;
        const col = block.col;
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            const blockElement = board.children[row * COLS + col];
            blockElement.style.backgroundColor = 'white';
        }
    });
}

function generatePiece() {
    const randomShapeIndex = Math.floor(Math.random() * shapes.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);

    const shape = shapes[randomShapeIndex];
    const color = colors[randomColorIndex];

    return {
        blocks: [],
        shape: shape,
        color: color,
        row: 0,
        col: 3
    };
}

function drawNextPiece() {
    nextPiece.innerHTML = '';
    nextPieceShape.blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.style.width = `${BLOCK_SIZE}px`;
        blockElement.style.height = `${BLOCK_SIZE}px`;
        blockElement.style.border = '1px solid black';
        blockElement.style.backgroundColor = nextPieceShape.color;
        nextPiece.appendChild(blockElement);
    });
}

function createPieceBlocks(piece) {
    piece.blocks = [];
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] === 1) {
                piece.blocks.push({
                    row: piece.row + row,
                    col: piece.col + col
                });
            }
        }
    }
}

function movePieceDown() {
    if (canMovePiece(currentPiece, 0, 1)) {
        clearPiece(currentPiece);
        currentPiece.row++;
        drawPiece(currentPiece);
    } else {
        // Piece can't move down, freeze it
        freezePiece();
        // Check for lines to clear
        clearLines();
        // Generate new piece
        currentPiece = nextPieceShape;
        createPieceBlocks(currentPiece);
        drawPiece(currentPiece);
        nextPieceShape = generatePiece();
        drawNextPiece();
        // Check for game over
        if (checkGameOver()) {
            gameOver = true;
            alert('游戏结束！');
            startButton.disabled = false;
        }
    }
}

function freezePiece() {
    currentPiece.blocks.forEach(block => {
        boardArray[block.row][block.col] = currentPiece.color;
    });
}

function checkGameOver() {
    for (let col = 0; col < COLS; col++) {
        if (boardArray[0][col] !== 0) {
            return true;
        }
    }
    return false;
}

function clearLines() {
    let linesCleared = 0;
    for (let row = 0; row < ROWS; row++) {
        if (boardArray[row].every(block => block !== 0)) {
            // Clear the line
            boardArray.splice(row, 1);
            boardArray.unshift(Array(COLS).fill(0));
            linesCleared++;
        }
    }
    if (linesCleared > 0) {
        score += 100 * linesCleared;
        updateScore();
    }
}

function updateScore() {
    scoreElement.textContent = '分数: ' + score;
}

function canMovePiece(piece, rowOffset, colOffset) {
    const newBlocks = piece.blocks.map(block => ({
        row: block.row + rowOffset,
        col: block.col + colOffset
    }));

    for (let i = 0; i < newBlocks.length; i++) {
        const block = newBlocks[i];
        if (block.row < 0 || block.row >= ROWS || block.col < 0 || block.col >= COLS) {
            return false;
        }
        if (boardArray[block.row][block.col] !== 0) {
            return false;
        }
    }
    return true;
}

function handleKeyDown(event) {
    if (gameOver) {
        return;
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (canMovePiece(currentPiece, 0, -1)) {
                clearPiece(currentPiece);
                currentPiece.col--;
                drawPiece(currentPiece);
            }
            break;
        case 'ArrowRight':
            if (canMovePiece(currentPiece, 0, 1)) {
                clearPiece(currentPiece);
                currentPiece.col++;
                drawPiece(currentPiece);
            }
            break;
        case 'ArrowDown':
            movePieceDown();
            break;
        case 'ArrowUp':
            // Rotate the piece (not implemented yet)
            // ...
            break;
    }
}

function startGame() {
    gameOver = false;
    score = 0;
    updateScore();
    boardArray = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    createBoard();
    currentPiece = generatePiece();
    createPieceBlocks(currentPiece);
    drawPiece(currentPiece);
    nextPieceShape = generatePiece();
    drawNextPiece();
    startButton.disabled = true;
    document.addEventListener('keydown', handleKeyDown);
    setInterval(movePieceDown, 500); // 控制下降速度
}

startButton.addEventListener('click', startGame);

createBoard();