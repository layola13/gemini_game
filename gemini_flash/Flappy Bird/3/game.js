// game.js
class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.velocity = 0;
    this.gravity = 0.5;
    this.jumpForce = -8;
    this.isInvulnerable = false; // 是否无敌
    this.invulnerabilityTimer = 0; // 无敌时间计数器
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // 更新无敌状态
    if (this.isInvulnerable) {
      this.invulnerabilityTimer++;
      if (this.invulnerabilityTimer >= 100) { // 无敌时间结束
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
      }
    }
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    if (this.isInvulnerable) {
      ctx.fillStyle = 'pink'; // 无敌状态下改变颜色
    } else {
      ctx.fillStyle = 'yellow';
    }
    ctx.fill();
  }
}

class Pipe {
  constructor(x, height, gap) {
    this.x = x;
    this.height = height;
    this.width = 50;
    this.gap = gap;
    this.speed = 2;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'green';

    // 上面管道
    ctx.fillRect(this.x, 0, this.width, this.height);

    // 下面管道
    ctx.fillRect(this.x, this.height + this.gap, this.width, canvas.height - this.height - this.gap);
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

const bird = new Bird(50, canvas.height / 2);
const pipes = [];

let score = 0;
let gameState = 'start'; // 游戏状态: start, running, gameover, paused
let gameStartTime = 0; // 游戏开始时间，用于控制难度

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const finalScore = document.getElementById('finalScore');
const currentScore = document.getElementById('currentScore');

function generatePipe() {
  // 动态调整管道间距
  const gap = 150 - Math.floor((Date.now() / 1000 - gameStartTime) * 0.5); // 每秒缩小0.5
  const height = Math.random() * (canvas.height - bird.radius * 2 - gap) + bird.radius;
  pipes.push(new Pipe(canvas.width, height, gap));
}

function handleInput(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (gameState === 'running') {
      bird.jump();
    } else if (gameState === 'paused') {
      gameState = 'running';
      update(); // 继续游戏
    }
  } else if (event.code === 'KeyP') { // 按下P键暂停/继续游戏
    if (gameState === 'running') {
      gameState = 'paused';
    } else if (gameState === 'paused') {
      gameState = 'running';
      update();
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'running') {
    bird.update();
    bird.draw(ctx);

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].update();
      pipes[i].draw(ctx);

      if (pipes[i].x + pipes[i].width < 0) {
        pipes.splice(i, 1);
      }

      if (pipes[i].x === bird.x) {
        score++;
        currentScore.textContent = score; // 实时更新分数显示
      }

      // 碰撞检测
      if (checkCollision(bird, pipes[i])) {
        if (!bird.isInvulnerable) { // 只有非无敌状态下才会判定碰撞
          gameState = 'gameover';
          gameOverScreen.style.display = 'block';
          finalScore.textContent = score;
          return;
        }
      }
    }

    if (pipes[pipes.length - 1].x < canvas.width / 2) {
      generatePipe();
    }
  }

  requestAnimationFrame(update);
}

function checkCollision(bird, pipe) {
  return (
    bird.x + bird.radius > pipe.x &&
    bird.x < pipe.x + pipe.width &&
    (
      bird.y < pipe.height ||
      bird.y + bird.radius > pipe.height + pipe.gap
    )
  );
}

function resetGame() {
  bird.x = 50;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  bird.isInvulnerable = false; // 重置无敌状态
  pipes.length = 0;
  score = 0;
  currentScore.textContent = 0; // 重置分数显示
  gameState = 'start';
  gameStartTime = Date.now() / 1000; // 记录游戏开始时间
  startScreen.style.display = 'block';
  gameOverScreen.style.display = 'none';
}

document.addEventListener('keydown', handleInput);
startButton.addEventListener('click', () => {
  gameState = 'running';
  startScreen.style.display = 'none';
  generatePipe(); // 生成第一个管道
  update();
});
restartButton.addEventListener('click', resetGame);