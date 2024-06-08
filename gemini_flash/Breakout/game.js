const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let paddleX = (canvas.width - 75) / 2;
let paddleY = canvas.height - 30;
let paddleWidth = 75;
let paddleHeight = 10;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = paddleY - ballRadius;
let dx = 2;
let dy = -2;

let score = 0;

// 砖块数组
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// 初始化砖块位置
function initBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].x = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      bricks[c][r].y = (r * (brickHeight + brickPadding)) + brickOffsetTop;
    }
  }
}

// 绘制砖块
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = bricks[c][r].x;
        const brickY = bricks[c][r].y;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 绘制球
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 绘制球拍
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 绘制分数
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("分数: " + score, 8, 20);
}

// 绘制游戏界面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
}

// 移动球
function moveBall() {
  ballX += dx;
  ballY += dy;
}

// 检测碰撞
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("恭喜你，获胜！");
            document.location.reload();
          }
        }
      }
    }
  }
}

// 检测球拍碰撞
function checkPaddleCollision() {
  if (ballX + ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth && ballY + ballRadius > paddleY) {
    dy = -dy;
  }
}

// 检测边界碰撞
function checkWallCollision() {
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    dx = -dx;
  }
  if (ballY - ballRadius < 0) {
    dy = -dy;
  }
  if (ballY + ballRadius > canvas.height) {
    alert("游戏结束");
    document.location.reload();
  }
}

// 移动球拍
function movePaddle(evt) {
  const relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// 游戏主循环
function gameLoop() {
  moveBall();
  collisionDetection();
  checkPaddleCollision();
  checkWallCollision();
  draw();
  requestAnimationFrame(gameLoop);
}

// 初始化游戏
initBricks();
document.addEventListener('mousemove', movePaddle);
requestAnimationFrame(gameLoop);