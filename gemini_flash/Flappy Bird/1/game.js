// game.js
class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.velocity = 0;
    this.gravity = 0.5;
    this.jumpForce = -8;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
  }
}

class Pipe {
  constructor(x, height) {
    this.x = x;
    this.height = height;
    this.width = 50;
    this.gap = 150; // 调整管道间距
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
let gameState = 'start'; // 游戏状态: start, running, gameover

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const finalScore = document.getElementById('finalScore');

function generatePipe() {
  const height = Math.random() * (canvas.height - bird.radius * 2 - 150) + bird.radius;
  pipes.push(new Pipe(canvas.width, height));
}

function handleInput(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (gameState === 'running') {
      bird.jump();
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
      }

      // 碰撞检测
      if (checkCollision(bird, pipes[i])) {
        gameState = 'gameover';
        gameOverScreen.style.display = 'block';
        finalScore.textContent = score;
        return;
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
  pipes.length = 0;
  score = 0;
  gameState = 'start';
  startScreen.style.display = 'block';
  gameOverScreen.style.display = 'none';
}

document.addEventListener('keydown', handleInput);
startButton.addEventListener('click', () => {
  gameState = 'running';
  startScreen.style.display = 'none';
  generatePipe();
  update();
});
restartButton.addEventListener('click', resetGame);