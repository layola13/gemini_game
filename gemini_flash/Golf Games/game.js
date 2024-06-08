const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 球的属性
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballRadius = 10;
let ballSpeedX = 0;
let ballSpeedY = 0;

// 杆的属性
let clubX = canvas.width / 2;
let clubY = canvas.height - 50;
let clubWidth = 50;
let clubHeight = 10;
let clubAngle = 0;

// 力度
let power = 0;

// 击球状态
let isHit = false;

// 鼠标位置
let mouseX = 0;
let mouseY = 0;

// 监听鼠标移动事件
canvas.addEventListener('mousemove', (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

// 监听鼠标点击事件
canvas.addEventListener('click', () => {
  isHit = true;
  // 计算击球力
  power = Math.sqrt(Math.pow(mouseX - clubX, 2) + Math.pow(mouseY - clubY, 2));
  // 计算击球方向
  clubAngle = Math.atan2(mouseY - clubY, mouseX - clubX);
});

// 游戏循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制杆
  ctx.fillStyle = 'brown';
  ctx.fillRect(clubX - clubWidth / 2, clubY - clubHeight / 2, clubWidth, clubHeight);
  ctx.translate(clubX, clubY);
  ctx.rotate(clubAngle);
  ctx.fillRect(-clubWidth / 2, -clubHeight / 2, clubWidth, clubHeight);
  ctx.rotate(-clubAngle);
  ctx.translate(-clubX, -clubY);

  // 绘制球
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // 击球
  if (isHit) {
    ballSpeedX = Math.cos(clubAngle) * power * 0.01;
    ballSpeedY = -Math.sin(clubAngle) * power * 0.01;
    isHit = false;
  }

  // 更新球的位置
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // 球与边界碰撞检测
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // 减缓球的速度
  ballSpeedX *= 0.99;
  ballSpeedY *= 0.99;

  requestAnimationFrame(gameLoop);
}

gameLoop();