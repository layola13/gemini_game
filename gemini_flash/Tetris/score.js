// score.js
const scoreDisplay = document.createElement('div');
scoreDisplay.textContent = '分数：0';
document.body.appendChild(scoreDisplay);

// 更新分数显示
export function updateScore(newScore) {
  score = newScore;
  scoreDisplay.textContent = `分数：${score}`;
}