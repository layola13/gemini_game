// game.js
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
    this.golds = [];
    this.score = 0;
    this.gameOver = false;
    this.init();
  }

  init() {
    this.createGolds();
    this.animate();
  }

  createGolds() {
    for (let i = 0; i < 10; i++) {
      this.golds.push(new Gold(Math.random() * this.canvas.width, Math.random() * this.canvas.height / 2));
    }
  }

  animate() {
    if (!this.gameOver) {
      requestAnimationFrame(() => this.animate());
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.player.draw(this.ctx);
      this.player.update();
      this.golds.forEach((gold, index) => {
        gold.draw(this.ctx);
        gold.update();
        if (this.player.isColliding(gold)) {
          this.score++;
          this.golds.splice(index, 1);
          if (this.golds.length === 0) {
            this.gameOver = true;
            alert(`游戏结束，你的分数是: ${this.score}`);
          }
        }
      });
      this.drawScore();
    }
  }

  drawScore() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`分数: ${this.score}`, 10, 30);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.dx = 0;
    this.dy = 0;
  }

  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.checkBoundaries();
  }

  checkBoundaries() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.canvas.height - this.height) {
      this.y = this.canvas.height - this.height;
    }
  }

  isColliding(gold) {
    return (
      this.x < gold.x + gold.radius &&
      this.x + this.width > gold.x - gold.radius &&
      this.y < gold.y + gold.radius &&
      this.y + this.height > gold.y - gold.radius
    );
  }
}

class Gold {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = 2;
    this.dx = (Math.random() * 2 - 1) * this.speed;
    this.dy = (Math.random() * 2 - 1) * this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.checkBoundaries();
  }

  checkBoundaries() {
    if (this.x < 0 || this.x > this.canvas.width) {
      this.dx = -this.dx;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.dy = -this.dy;
    }
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.player.dx = -game.player.speed;
      break;
    case 'ArrowRight':
      game.player.dx = game.player.speed;
      break;
    case 'ArrowUp':
      game.player.dy = -game.player.speed;
      break;
    case 'ArrowDown':
      game.player.dy = game.player.speed;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      game.player.dx = 0;
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      game.player.dy = 0;
      break;
  }
});

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);