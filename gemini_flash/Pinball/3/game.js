// game.js

import Ball from './ball.js';
import Flipper from './flipper.js';
import Obstacle from './obstacle.js';

const canvas = document.getElementById('pinballCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const gameEnd = document.getElementById('gameEnd');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const gameContainer = document.getElementById('gameContainer');
const difficultySelect = document.getElementById('difficultySelect');

const BALL_RADIUS = 10;
const FLIPPER_WIDTH = 20;
const FLIPPER_HEIGHT = 50;
const SCORE_PER_HIT = 10;

let GRAVITY = 0.1;
let FRICTION = 0.99;
let MAX_FLIPPER_ANGLE = 0.3;

class PinballGame {
  constructor() {
    this.ball = new Ball(canvas.width / 2, canvas.height - 50, BALL_RADIUS, 'red');
    this.leftFlipper = new Flipper(50, canvas.height - 50, FLIPPER_WIDTH, FLIPPER_HEIGHT, 'blue');
    this.rightFlipper = new Flipper(canvas.width - 70, canvas.height - 50, FLIPPER_WIDTH, FLIPPER_HEIGHT, 'blue');
    this.score = 0;
    this.obstacles = [
      new Obstacle(canvas.width / 2 - 50, canvas.height / 2 - 20, 100, 10, 'brown'),
      new Obstacle(canvas.width / 2 - 20, canvas.height / 2 - 80, 10, 60, 'brown'),
      new Obstacle(canvas.width / 2 + 20, canvas.height / 2 - 80, 10, 60, 'brown')
    ];
    this.gameLoop = null;
    this.isPaused = false;
    this.gameOver = false;
    this.difficulty = 'medium';

    // 设置难度
    difficultySelect.addEventListener('change', () => {
      this.difficulty = difficultySelect.value;
      this.setDifficulty();
    });
  }

  start() {
    this.resetGame();
    this.gameLoop = setInterval(() => {
      if (!this.isPaused) {
        this.update();
        this.draw();
      }
    }, 10);
    startButton.disabled = true;
    pauseButton.disabled = false;
    gameEnd.style.display = 'none';
    gameContainer.style.display = 'flex';
  }

  pause() {
    this.isPaused = true;
    pauseButton.disabled = true;
    startButton.disabled = false;
  }

  resume() {
    this.isPaused = false;
    pauseButton.disabled = false;
    startButton.disabled = true;
  }

  resetGame() {
    this.score = 0;
    this.ball.x = canvas.width / 2;
    this.ball.y = canvas.height - 50;
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.leftFlipper.angle = 0;
    this.rightFlipper.angle = 0;
    updateScore();
    this.gameOver = false;
    this.setDifficulty();
  }

  update() {
    this.ball.dy += GRAVITY;
    this.ball.dx *= FRICTION;
    this.ball.dy *= FRICTION;
    this.ball.update();

    // 处理球与边缘的碰撞
    if (this.ball.x + this.ball.radius > canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx *= -1;
    }
    if (this.ball.y + this.ball.radius > canvas.height) {
      this.ball.dy *= -1;
      this.ball.y = canvas.height - this.ball.radius;
    }

    // 处理球与弹板的碰撞
    if (this.ball.checkCollision(this.leftFlipper)) {
      this.ball.dx = Math.abs(this.ball.dx) * 1.2;
      this.score += SCORE_PER_HIT;
      updateScore();
    }
    if (this.ball.checkCollision(this.rightFlipper)) {
      this.ball.dx = -Math.abs(this.ball.dx) * 1.2;
      this.score += SCORE_PER_HIT;
      updateScore();
    }

    // 处理球与障碍物的碰撞
    this.obstacles.forEach(obstacle => {
      if (this.ball.checkCollision(obstacle)) {
        this.ball.dy *= -1;
        this.score += SCORE_PER_HIT;
        updateScore();
      }
    });

    // 检查球是否掉落
    if (this.ball.y > canvas.height) {
      this.gameOver = true;
      this.endGame();
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ball.draw();
    this.leftFlipper.draw();
    this.rightFlipper.draw();
    this.obstacles.forEach(obstacle => obstacle.draw());
  }

  endGame() {
    clearInterval(this.gameLoop);
    pauseButton.disabled = true;
    startButton.disabled = false;
    gameEnd.style.display = 'block';
    finalScore.textContent = this.score;
    gameContainer.style.display = 'none';
  }

  setDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        GRAVITY = 0.05;
        FRICTION = 0.98;
        MAX_FLIPPER_ANGLE = 0.4;
        break;
      case 'medium':
        GRAVITY = 0.1;
        FRICTION = 0.99;
        MAX_FLIPPER_ANGLE = 0.3;
        break;
      case 'hard':
        GRAVITY = 0.15;
        FRICTION = 1;
        MAX_FLIPPER_ANGLE = 0.2;
        break;
    }
  }
}

const game = new PinballGame();

startButton.addEventListener('click', () => {
  game.start();
});

pauseButton.addEventListener('click', () => {
  game.pause();
});

restartButton.addEventListener('click', () => {
  game.resetGame();
  game.start();
});

// 控制弹板
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    game.leftFlipper.angle = -MAX_FLIPPER_ANGLE;
  } else if (event.key === 'ArrowRight') {
    game.rightFlipper.angle = MAX_FLIPPER_ANGLE;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    game.leftFlipper.angle = 0;
    game.rightFlipper.angle = 0;
  }
});

function updateScore() {
  scoreElement.textContent = `Score: ${game.score}`;
}