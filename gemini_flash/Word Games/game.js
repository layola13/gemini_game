const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const scoreDisplay = document.getElementById('score');

let score = 0;
let letters = [];

// 生成随机字母
function generateLetters() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 16; i++) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
}

// 渲染游戏棋盘
function renderBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < letters.length; i++) {
    const letterElement = document.createElement('div');
    letterElement.textContent = letters[i];
    letterElement.classList.add('letter');
    gameBoard.appendChild(letterElement);
  }
}

// 重置游戏
function resetGame() {
  score = 0;
  letters = [];
  generateLetters();
  renderBoard();
  scoreDisplay.textContent = score;
}

// 检查单词是否有效
function checkWord(word) {
  // 这里应该添加逻辑来检查单词是否有效，例如使用词典或API
  // 暂时仅检查单词是否至少包含两个字母
  if (word.length < 2) {
    return false;
  }
  return true;
}

// 处理用户输入
function handleInput(event) {
  if (event.key === 'Enter') {
    const word = event.target.value.toUpperCase();
    if (checkWord(word)) {
      score += word.length;
      scoreDisplay.textContent = score;
    }
    event.target.value = ''; // 清空输入框
  }
}

// 初始化游戏
generateLetters();
renderBoard();

// 绑定事件监听器
resetButton.addEventListener('click', resetGame);
gameBoard.addEventListener('click', (event) => {
  if (event.target.classList.contains('letter')) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = event.target.textContent;
    input.addEventListener('keydown', handleInput);
    gameBoard.appendChild(input);
    input.focus();
  }
});