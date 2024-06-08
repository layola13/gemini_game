class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 5;
    this.dy = (Math.random() - 0.5) * 5;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.dx;
    this.y += this.dy;

    // 反弹
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

const balls = [];
const numBalls = 20;
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// 初始化球
for (let i = 0; i < numBalls; i++) {
  const radius = Math.random() * 20 + 10;
  const x = Math.random() * (canvasWidth - radius * 2) + radius;
  const y = Math.random() * (canvasHeight - radius * 2) + radius;
  const color = colors[Math.floor(Math.random() * colors.length)];
  balls.push(new Ball(x, y, radius, color));
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 更新并绘制球
  balls.forEach(ball => {
    ball.update(canvasWidth, canvasHeight);
    ball.draw(ctx);
  });

  requestAnimationFrame(animate);
}

animate();