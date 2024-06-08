// game.js
class Game {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ui = ui;
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
    this.golds = [];
    this.score = 0;
    this.gameOver = false;
    this.gameState = 'init';
    this.targetScore = 20; // 设置游戏目标分数
    this.init();
  }

  init() {
    this.createGolds();
    this.updateScoreDisplay();
  }

  createGolds() {
    for (let i = 0; i < 10; i++) {
      this.golds.push(new Gold(Math.random() * this.canvas.width, Math.random() * this.canvas.height / 2));
    }
  }

  animate() {
    if (this.gameState === 'playing') {
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
          this.updateScoreDisplay();
          if (this.score >= this.targetScore) {
            this.gameOver = true;
            this.gameState = 'gameOver';
            alert(`恭喜你！你赢了！最终分数：${this.score}`);
          }
        }
      });
    } else if (this.gameState === 'gameOver') {
      this.drawGameOver();
    }
  }

  updateScoreDisplay() {
    this.ui.querySelector('#score').textContent = `分数: ${this.score}`;
  }

  drawGameOver() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("游戏结束", this.canvas.width / 2 - 60, this.canvas.height / 2);
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`最终分数：${this.score}`, this.canvas.width / 2 - 60, this.canvas.height / 2 + 30);
  }
}

class Player {
  // ...
}

class Gold {
  // ...
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
const gameUI = document.getElementById('gameUI');
const startButton = document.getElementById('startButton');

let game;

startButton.addEventListener('click', () => {
  game = new Game(canvas, gameUI);
  game.gameState = 'playing';
  game.animate();
  startButton.disabled = true;
});