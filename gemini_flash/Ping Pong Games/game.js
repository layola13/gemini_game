const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 70;
const ballRadius = 10;
const ballSpeed = 5;

let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let opponentPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = ballSpeed;
let ballDY = ballSpeed;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制球
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // 绘制球拍
  ctx.fillRect(10, playerPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 10 - paddleWidth, opponentPaddleY, paddleWidth, paddleHeight);
}

function update() {
  // 更新球的位置
  ballX += ballDX;
  ballY += ballDY;

  // 球拍碰撞检测
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballDY *= -1;
  }

  if (ballX + ballRadius > canvas.width) {
    // 玩家得分
    resetBall();
  } else if (ballX - ballRadius < 0) {
    // 对手得分
    resetBall();
  }

  if (
    ballX + ballRadius > canvas.width - 10 - paddleWidth &&
    ballY > opponentPaddleY &&
    ballY < opponentPaddleY + paddleHeight
  ) {
    ballDX *= -1;
  }

  if (
    ballX - ballRadius < 10 + paddleWidth &&
    ballY > playerPaddleY &&
    ballY < playerPaddleY + paddleHeight
  ) {
    ballDX *= -1;
  }

  // 更新对手球拍位置（简单 AI）
  opponentPaddleY = ballY - paddleHeight / 2;

  // 限制对手球拍在范围内
  if (opponentPaddleY < 0) {
    opponentPaddleY = 0;
  } else if (opponentPaddleY > canvas.height - paddleHeight) {
    opponentPaddleY = canvas.height - paddleHeight;
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballDX = ballSpeed;
  ballDY = ballSpeed;
}

// 控制玩家球拍移动
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    playerPaddleY -= 10;
    if (playerPaddleY < 0) {
      playerPaddleY = 0;
    }
  } else if (e.key === 'ArrowDown') {
    playerPaddleY += 10;
    if (playerPaddleY > canvas.height - paddleHeight) {
      playerPaddleY = canvas.height - paddleHeight;
    }
  }
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();