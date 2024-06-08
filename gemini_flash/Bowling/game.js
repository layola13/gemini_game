const pins = document.querySelectorAll('.pin');
const ball = document.querySelector('.ball');
const rollButton = document.getElementById('rollButton');
const scoreTable = document.getElementById('scoreTable');
const message = document.getElementById('message');

let currentFrame = 1;
let currentRoll = 1;
let scores = [];
let currentScore = 0;

// 初始化分数表格
function initScoreboard() {
  for (let i = 1; i <= 10; i++) {
    let row = scoreTable.insertRow();
    row.insertCell().textContent = i;
    for (let j = 1; j <= 3; j++) {
      row.insertCell();
    }
    row.insertCell().textContent = 0;
  }
}

// 投球
function rollBall() {
  // 随机产生击倒的球瓶数量
  let knockedDownPins = Math.floor(Math.random() * 11);
  // 更新球瓶状态
  for (let i = 0; i < knockedDownPins; i++) {
    pins[i].classList.add('fallen');
  }
  // 更新分数
  currentScore += knockedDownPins;
  // 更新滚动状态
  if (currentRoll === 1 && currentScore === 10) {
    // 击倒所有球瓶，直接进入下一轮
    currentFrame++;
    currentRoll = 1;
    currentScore = 0;
    message.textContent = `第 ${currentFrame} 轮`;
  } else if (currentRoll === 2) {
    // 进入下一轮
    currentFrame++;
    currentRoll = 1;
    currentScore = 0;
    message.textContent = `第 ${currentFrame} 轮`;
  } else {
    currentRoll++;
    message.textContent = `第 ${currentFrame} 轮，第 ${currentRoll} 次投球`;
  }
  // 更新分数表格
  updateScoreTable();
  // 检查游戏是否结束
  if (currentFrame > 10) {
    rollButton.disabled = true;
    message.textContent = '游戏结束！';
  }
}

// 更新分数表格
function updateScoreTable() {
  // 更新当前轮的分数
  scoreTable.rows[currentFrame - 1].cells[currentRoll].textContent = currentScore;
  // 计算并更新总分
  let totalScore = 0;
  for (let i = 0; i < currentFrame; i++) {
    totalScore += parseInt(scoreTable.rows[i].cells[3].textContent);
  }
  // 更新总分
  scoreTable.rows[currentFrame - 1].cells[4].textContent = totalScore;
}

// 初始化
initScoreboard();
rollButton.addEventListener('click', rollBall);