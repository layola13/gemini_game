const wordDisplay = document.getElementById("word-display");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-button");
const resultMessage = document.getElementById("result-message");

let currentWord = "";

// 随机生成一个汉字
function generateRandomWord() {
  const chineseCharacters = "你好世界"; // 替换为你的汉字列表
  const randomIndex = Math.floor(Math.random() * chineseCharacters.length);
  return chineseCharacters[randomIndex];
}

// 开始游戏
function startGame() {
  currentWord = generateRandomWord();
  wordDisplay.textContent = currentWord;
  userInput.value = "";
  resultMessage.textContent = "";
}

// 检查用户输入
function checkInput() {
  const userAnswer = userInput.value;
  if (userAnswer === currentWord) {
    resultMessage.textContent = "正确！";
    startGame(); // 开始下一轮
  } else {
    resultMessage.textContent = "错误！请再试一次";
  }
}

// 监听提交按钮
submitButton.addEventListener("click", checkInput);

// 游戏开始
startGame();