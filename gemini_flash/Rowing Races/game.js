const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');

// 游戏参数
const boatWidth = 50;
const boatHeight = 20;
const waterLevel = canvas.height - 50;
const finishLine = canvas.width - 100;
const speed = 5;

// 玩家信息
let player1 = {
  x: 50,
  y: waterLevel - boatHeight,
  score: 0,
  isMoving: false,
};
let player2 = {
  x: canvas.width - 50 - boatWidth,
  y: waterLevel - boatHeight,
  score: 0,
  isMoving: false,
};

// 游戏状态
let gameStarted = false;

// 绘制游戏背景
function drawBackground() {
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, canvas.width, waterLevel);

  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(finishLine, 0);
  ctx.lineTo(finishLine, canvas.height);
  ctx.stroke();
}

// 绘制船只
function drawBoat(player) {
  ctx.fillStyle = 'brown';
  ctx.fillRect(player.x, player.y, boatWidth, boatHeight);
}

// 更新玩家位置
function updatePlayer(player) {
  if (player.isMoving) {
    player.x += speed;
  }
}

// 检查是否完成比赛
function checkFinish(player) {
  if (player.x >= finishLine) {
    player.isMoving = false;
    player.score++;
    updateScore(player);
  }
}

// 更新分数显示
function updateScore(player) {
  if (player === player1) {
    player1Score.textContent = player.score;
  } else {
    player2Score.textContent = player.score;
  }
}

// 渲染游戏画面
function renderGame() {
  drawBackground();
  drawBoat(player1);
  drawBoat(player2);
}

// 开始游戏
startButton.addEventListener('click', () => {
  gameStarted = true;
  startButton.disabled = true;
});

// 监听键盘事件
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowLeft' && player1.isMoving === false) {
    player1.isMoving = true;
  }
  if (e.key === 'ArrowRight' && player2.isMoving === false) {
    player2.isMoving = true;
  }
});

// 游戏循环
function gameLoop() {
  if (!gameStarted) return;

  updatePlayer(player1);
  updatePlayer(player2);
  checkFinish(player1);
  checkFinish(player2);
  renderGame();

  requestAnimationFrame(gameLoop);
}

// 初始化游戏
gameLoop();