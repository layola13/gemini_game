const board = document.querySelector('.board');
const startButton = document.getElementById('start-button');
const wordInput = document.getElementById('word-input');
const checkButton = document.getElementById('check-button');
const scoreDisplay = document.getElementById('score');
const foundWordsDisplay = document.getElementById('found-words');

let score = 0;
let foundWords = [];

// 随机字母库
const letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// 生成 4x4 棋盘
function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = letters[Math.floor(Math.random() * letters.length)];
        board.appendChild(cell);
    }
}

// 检查单词是否有效
function checkWord(word) {
    if (word.length < 3) {
        alert('单词长度至少为 3 个字母');
        return false;
    }
    if (foundWords.includes(word)) {
        alert('你已经找到过这个单词了');
        return false;
    }
    // 这里需要添加逻辑来验证单词是否在棋盘上
    // ...
    return true;
}

// 更新分数和已找到单词
function updateScoreAndWords(word) {
    score += word.length;
    scoreDisplay.textContent = score;
    foundWords.push(word);
    foundWordsDisplay.textContent = foundWords.join(', ');
}

// 开始游戏
startButton.addEventListener('click', () => {
    createBoard();
    score = 0;
    foundWords = [];
    scoreDisplay.textContent = score;
    foundWordsDisplay.textContent = '';
});

// 检查单词
checkButton.addEventListener('click', () => {
    const word = wordInput.value.toUpperCase();
    if (checkWord(word)) {
        updateScoreAndWords(word);
    }
    wordInput.value = '';
});