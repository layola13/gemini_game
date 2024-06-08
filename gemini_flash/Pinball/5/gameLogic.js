// gameLogic.js

import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Sound } from './sound.js';

export class GameLogic {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 50, 10, 'white');
    this.paddle = new Paddle(this.canvas.width / 2 - 50, this.canvas.height - 20, 100, 10, 'blue');
    this.lastTimestamp = 0;
    this.score = 0;
    this.isPaused = false;
    this.sound = new Sound();
    this.bricks = this.createBricks(); // 添加砖块
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
      this.sound.playBounce();
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy *= -1;
      this.sound.playBounce();
    }

    // 球与球拍碰撞检测
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.width
    ) {
      // 计算反弹角度
      const relativeIntersectX = this.ball.x - this.paddle.x - this.paddle.width / 2;
      const normalizedIntersectX = relativeIntersectX / (this.paddle.width / 2);
      const bounceAngle = normalizedIntersectX * Math.PI / 4;
      this.ball.dx = Math.cos(bounceAngle) * Math.abs(this.ball.dx);
      this.ball.dy = -Math.sin(bounceAngle) * Math.abs(this.ball.dy);

      this.score++;
      this.sound.playScore();

      // 增加球速
      if (this.score % 5 === 0 && Math.abs(this.ball.dx) < 10 && Math.abs(this.ball.dy) < 10) {
        this.ball.dx *= 1.05; // 调整球速增加幅度
        this.ball.dy *= 1.05;
      }
    }

    // 球与砖块碰撞检测
    this.bricks.forEach((brick, index) => {
      if (this.checkBrickCollision(this.ball, brick)) {
        this.bricks.splice(index, 1);
        this.score += 10;
        this.sound.playScore();
        this.ball.dy *= -1;
      }
    });

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

    // 绘制砖块
    this.bricks.forEach(brick => {
      this.ctx.fillStyle = brick.color;
      this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });
  }

  reset() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 50;
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.score = 0;
    this.isPaused = false;
    this.bricks = this.createBricks(); // 重置砖块
  }

  gameOver() {
    this.sound.playGameOver();
    alert(`游戏结束！得分: ${this.score}`);
    const restartGameButton = document.getElementById('restartGameButton');
    restartGameButton.style.display = 'block';
    this.reset();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  // 创建砖块
  createBricks() {
    const bricks = [];
    const brickWidth = 50;
    const brickHeight = 20;
    const brickGap = 10;
    const brickRows = 5;

    for (let i = 0; i < brickRows; i++) {
      for (let j = 0; j < 10; j++) {
        bricks.push({
          x: j * (brickWidth + brickGap),
          y: i * (brickHeight + brickGap) + 50,
          width: brickWidth,
          height: brickHeight,
          color: 'red'
        });
      }
    }
    return bricks;
  }

  // 检查球与砖块的碰撞
  checkBrickCollision(ball, brick) {
    return (
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brick.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brick.height
    );
  }
}