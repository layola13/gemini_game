class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    this.y -= this.speed;
  }

  moveDown() {
    this.y += this.speed;
  }
}

class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 2;
    this.dy = 2;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounceOffWalls() {
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  bounceOffPaddle(paddle) {
    if (
      this.x + this.radius >= paddle.x &&
      this.x - this.radius <= paddle.x + paddle.width &&
      this.y + this.radius >= paddle.y &&
      this.y - this.radius <= paddle.y + paddle.height
    ) {
      this.dx = -this.dx;
    }
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const playerPaddle = new Paddle(20, canvas.height / 2 - 50, 10, 100, "blue");
const opponentPaddle = new Paddle(
  canvas.width - 30,
  canvas.height / 2 - 50,
  10,
  100,
  "red"
);
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, "yellow");

function gameLoop() {
  // 清理画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制游戏元素
  playerPaddle.draw(ctx);
  opponentPaddle.draw(ctx);
  ball.draw(ctx);

  // 移动球
  ball.move();

  // 球与墙壁碰撞
  ball.bounceOffWalls();

  // 球与球拍碰撞
  ball.bounceOffPaddle(playerPaddle);
  ball.bounceOffPaddle(opponentPaddle);

  // 控制玩家球拍
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      playerPaddle.moveUp();
    } else if (event.key === "ArrowDown") {
      playerPaddle.moveDown();
    }
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();