// game.js

class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

class Flipper {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.angle = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
}

class PinballGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ball = new Ball(canvas.width / 2, canvas.height - 50, 10, 'red');
    this.leftFlipper = new Flipper(50, canvas.height - 50, 20, 50, 'blue');
    this.rightFlipper = new Flipper(canvas.width - 70, canvas.height - 50, 20, 50, 'blue');
    this.gravity = 0.1;
    this.friction = 0.99;
    this.gameLoop = null;
  }

  start() {
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
    }, 10);
  }

  stop() {
    clearInterval(this.gameLoop);
  }

  update() {
    this.ball.dy += this.gravity;
    this.ball.dx *= this.friction;
    this.ball.dy *= this.friction;
    this.ball.update();

    // 处理球与边缘的碰撞
    if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx *= -1;
    }
    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.ball.dy *= -1;
      this.ball.y = this.canvas.height - this.ball.radius;
    }

    // 处理球与弹板的碰撞
    // ... 

    // ... 处理其他游戏逻辑 ...
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw(this.ctx);
    this.leftFlipper.draw(this.ctx);
    this.rightFlipper.draw(this.ctx);
  }
}

const canvas = document.getElementById('pinballCanvas');
const game = new PinballGame(canvas);
game.start();

// 添加事件监听器来控制弹板
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    game.leftFlipper.angle = -0.3;
  } else if (event.key === 'ArrowRight') {
    game.rightFlipper.angle = 0.3;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    game.leftFlipper.angle = 0;
    game.rightFlipper.angle = 0;
  }
});