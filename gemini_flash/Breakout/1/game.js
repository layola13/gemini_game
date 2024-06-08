// game.js
class Ball {
  constructor(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  // 检查球是否与边界碰撞
  checkCollision(canvasWidth, canvasHeight) {
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
    } else if (this.y + this.radius > canvasHeight) {
      // 游戏结束
      return true;
    }
    return false;
  }
}

class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = 5;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  move(direction) {
    if (direction === "left" && this.x > 0) {
      this.x -= this.dx;
    } else if (direction === "right" && this.x + this.width < canvas.width) {
      this.x += this.dx;
    }
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.status = 1; // 1 表示砖块存在，0 表示砖块被击碎
  }

  draw(ctx) {
    if (this.status === 1) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let ball;
let paddle;
let bricks;
let score = 0;

// 游戏状态
let gameRunning = false;

function init() {
  ball = new Ball(canvas.width / 2, canvas.height - 30, 10, 2, -2);
  paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 10, 100, 10);
  bricks = createBricks();
  score = 0;
}

function createBricks() {
  const brickRowCount = 3;
  const brickColumnCount = 5;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  const bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = brickOffsetLeft + (c * (brickWidth + brickPadding));
      const brickY = brickOffsetTop + (r * (brickHeight + brickPadding));
      const brick = new Brick(brickX, brickY, brickWidth, brickHeight, "#0095DD");
      bricks.push(brick);
    }
  }
  return bricks;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  ball.draw(ctx);
  paddle.draw(ctx);
  bricks.forEach(brick => brick.draw(ctx));
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`分数: ${score}`, 8, 20);
}

function update() {
  if (!gameRunning) return;

  ball.move();
  // 检查球是否与边界碰撞
  if (ball.checkCollision(canvas.width, canvas.height)) {
    // 游戏结束
    alert("游戏结束!");
    resetGame();
  }

  // 检查球是否与球拍碰撞
  if (ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height) {
    ball.dy = -ball.dy;
  }

  // 检查球是否与砖块碰撞
  bricks.forEach((brick, i) => {
    if (brick.status === 1) {
      if (ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height) {
        ball.dy = -ball.dy;
        brick.status = 0; // 击碎砖块
        score++;
        // 检查是否所有砖块都被击碎
        if (score === brickRowCount * brickColumnCount) {
          alert("恭喜你！你赢了！");
          resetGame();
        }
      }
    }
  });
}

function keyDownHandler(e) {
  if (gameRunning) {
    if (e.key === "Left" || e.key === "ArrowLeft") {
      paddle.move("left");
    } else if (e.key === "Right" || e.key === "ArrowRight") {
      paddle.move("right");
    }
  }
}

// 监听键盘事件
document.addEventListener("keydown", keyDownHandler);

// 初始化游戏
init();

// 游戏循环
function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// 开始游戏
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  gameRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  gameLoop();
});

// 暂停游戏
const pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", () => {
  gameRunning = false;
  pauseButton.disabled = true;
  startButton.disabled = false;
});

// 重新开始游戏
const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", resetGame);

function resetGame() {
  gameRunning = false;
  init();
  startButton.disabled = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
}