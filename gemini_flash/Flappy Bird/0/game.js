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
    this.gap = 150;
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

function generatePipe() {
  const height = Math.random() * (canvas.height - bird.radius * 2 - 150) + bird.radius;
  pipes.push(new Pipe(canvas.width, height));
}

function handleInput(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    bird.jump();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    if (
      bird.x + bird.radius > pipes[i].x &&
      bird.x < pipes[i].x + pipes[i].width &&
      (
        bird.y < pipes[i].height ||
        bird.y + bird.radius > pipes[i].height + pipes[i].gap
      )
    ) {
      alert('Game Over! Score: ' + score);
      resetGame();
    }
  }

  if (pipes[pipes.length - 1].x < canvas.width / 2) {
    generatePipe();
  }

  requestAnimationFrame(update);
}

function resetGame() {
  bird.x = 50;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
}

document.addEventListener('keydown', handleInput);
generatePipe();
update();