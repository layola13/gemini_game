const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏参数
const ballRadius = 10;
const paddleWidth = 100;
const paddleHeight = 10;
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// 球体
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// 球拍
let paddleX = (canvas.width - paddleWidth) / 2;

// 砖块
let bricks = [];
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

// 绘制球体
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 绘制球拍
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 绘制砖块
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = bricks[c][r].x;
        let brickY = bricks[c][r].y;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 移动球体
function moveBall() {
  x += dx;
  y += dy;
}

// 球体碰撞检测
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

// 球体与球拍碰撞检测
function paddleCollision() {
  if (x > paddleX && x < paddleX + paddleWidth && y > canvas.height - paddleHeight - ballRadius) {
    dy = -dy;
  }
}

// 球体边界碰撞检测
function ballBoundaryCollision() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
}

// 控制球拍移动
function movePaddle(evt) {
  let relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// 重置游戏
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
}

// 游戏循环
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  moveBall();
  collisionDetection();
  paddleCollision();
  ballBoundaryCollision();

  // 游戏结束判断
  let gameOver = true;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        gameOver = false;
      }
    }
  }
  if (gameOver) {
    alert("游戏结束！恭喜你！");
    resetGame();
  }

  requestAnimationFrame(draw);
}

// 初始化游戏
initBricks();
draw();

// 监听鼠标移动事件
canvas.addEventListener('mousemove', movePaddle);