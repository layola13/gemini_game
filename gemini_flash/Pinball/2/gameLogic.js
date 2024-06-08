// gameLogic.js

import { Ball } from './ball.js';
import { Paddle } from './paddle.js';

export class GameLogic {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 50, 10, 'white');
    this.paddle = new Paddle(this.canvas.width / 2 - 50, this.canvas.height - 20, 100, 10, 'blue');
    this.lastTimestamp = 0;
    this.score = 0;
    this.isPaused = false;
  }

  start() {
    this.ball.dx = 3;
    this.ball.dy = -3;
    this.animate();
  }

  animate(timestamp) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (!this.isPaused) {
      this.update(deltaTime);
      this.draw();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  update(deltaTime) {
    this.ball.update(deltaTime);

    // 球与边界碰撞检测
    if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx *= -1;
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy *= -1;
    }

    // 球与球拍碰撞检测
    if (this.ball.y + this.ball.radius >= this.paddle.y &&
        this.ball.x >= this.paddle.x &&
        this.ball.x <= this.paddle.x + this.paddle.width) {
      this.ball.dy *= -1;
      this.score++;

      // 增加球速
      if (this.score % 5 === 0 && this.ball.dx < 10 && this.ball.dy < 10) {
        this.ball.dx *= 1.1;
        this.ball.dy *= 1.1;
      }
    }

    // 球出界
    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.gameOver();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);

    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`得分: ${this.score}`, 10, 30);
  }

  reset() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 50;
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.score = 0;
    this.isPaused = false;
  }

  gameOver() {
    alert(`游戏结束！得分: ${this.score}`);
    const restartGameButton = document.getElementById('restartGameButton');
    restartGameButton.style.display = 'block';
    this.reset();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}