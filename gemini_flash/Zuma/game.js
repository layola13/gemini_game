const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const ballRadius = 20;
const ballSpeed = 5;
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// 游戏状态
let score = 0;
let gameOver = false;

// 球类
class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    // 更新球的位置
    this.y += ballSpeed;

    // 检查球是否到达底部
    if (this.y > canvas.height) {
      gameOver = true;
    }
  }
}

// 生成随机颜色
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// 生成随机球
function createBall() {
  const x = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
  return new Ball(x, 0, getRandomColor());
}

// 游戏循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制球
  balls.forEach(ball => {
    ball.draw();
    ball.update();
  });

  // 检查游戏是否结束
  if (gameOver) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('游戏结束！', canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  // 重新请求动画帧
  requestAnimationFrame(gameLoop);
}

// 初始化游戏
let balls = [];
for (let i = 0; i < 5; i++) {
  balls.push(createBall());
}

// 开始游戏循环
gameLoop();