// game.js
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 2;
    this.dy = -2;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounceOffWalls(canvasWidth, canvasHeight) {
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dx = 5;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    if (direction === 'right' && this.x + this.width < canvas.width) {
      this.x += this.dx;
    } else if (direction === 'left' && this.x > 0) {
      this.x -= this.dx;
    }
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const ball = new Ball(canvas.width / 2, canvas.height - 50, 10, 'red');
const paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 20, 100, 10, 'blue');

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball.move();
  ball.bounceOffWalls(canvas.width, canvas.height);

  ball.draw(ctx);
  paddle.draw(ctx);

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    paddle.move('right');
  } else if (e.key === 'ArrowLeft') {
    paddle.move('left');
  }
});

requestAnimationFrame(gameLoop);