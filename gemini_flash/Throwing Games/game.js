const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');

let isGameStarted = false;

// 游戏设置
const ballRadius = 10;
const ballColor = 'red';
const targetRadius = 20;
const targetColor = 'blue';

// 球的初始位置和速度
let ballX = canvas.width / 2;
let ballY = canvas.height - ballRadius;
let ballSpeedX = 0;
let ballSpeedY = 0;

// 目标的位置
let targetX = Math.random() * (canvas.width - targetRadius * 2) + targetRadius;
let targetY = Math.random() * (canvas.height - targetRadius * 2) + targetRadius;

// 开始游戏
startButton.addEventListener('click', () => {
  isGameStarted = true;
  startButton.disabled = true;
  // 初始化球的位置和速度
  ballX = canvas.width / 2;
  ballY = canvas.height - ballRadius;
  ballSpeedX = 0;
  ballSpeedY = 0;
  // 重新生成目标位置
  targetX = Math.random() * (canvas.width - targetRadius * 2) + targetRadius;
  targetY = Math.random() * (canvas.height - targetRadius * 2) + targetRadius;
});

// 鼠标点击事件
canvas.addEventListener('click', (event) => {
  if (isGameStarted) {
    // 计算鼠标点击位置
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // 计算球的初始速度
    ballSpeedX = (mouseX - ballX) / 10;
    ballSpeedY = -(mouseY - ballY) / 10;
  }
});

// 游戏循环
function gameLoop() {
  if (isGameStarted) {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新球的位置
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 更新球的速度（模拟重力）
    ballSpeedY += 0.1;

    // 检测球是否碰到边界
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
      ballSpeedX *= -1;
    }
    if (ballY + ballRadius > canvas.height) {
      ballSpeedY *= -0.8;
      ballY = canvas.height - ballRadius;
    }

    // 检测球是否击中目标
    if (Math.sqrt(Math.pow(ballX - targetX, 2) + Math.pow(ballY - targetY, 2)) <= ballRadius + targetRadius) {
      // 击中目标，重新开始游戏
      isGameStarted = false;
      startButton.disabled = false;
    }

    // 绘制球
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();

    // 绘制目标
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = targetColor;
    ctx.fill();
  }

  requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();