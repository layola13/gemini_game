const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const rollButton = document.getElementById('roll-button');
const winner = document.getElementById('winner');

let player1Score = 0;
let player2Score = 0;

rollButton.addEventListener('click', () => {
  // 随机生成两个骰子的点数
  const dice1Roll = Math.floor(Math.random() * 6) + 1;
  const dice2Roll = Math.floor(Math.random() * 6) + 1;

  // 更新骰子图片
  dice1.src = `dice${dice1Roll}.png`;
  dice2.src = `dice${dice2Roll}.png`;

  // 更新玩家分数
  player1Score += dice1Roll;
  player2Score += dice2Roll;
  score1.textContent = player1Score;
  score2.textContent = player2Score;

  // 判断胜负
  if (player1Score >= 20) {
    winner.textContent = '玩家 1 获胜！';
    rollButton.disabled = true;
  } else if (player2Score >= 20) {
    winner.textContent = '玩家 2 获胜！';
    rollButton.disabled = true;
  }
});