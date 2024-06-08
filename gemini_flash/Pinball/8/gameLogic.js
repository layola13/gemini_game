// gameLogic.js

import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Sound } from './sound.js';
import { Constants } from './constants.js';

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
    this.bricks = this.createBricks();
    this.bricksDestroyed = 0;
    this.maxBallSpeed = 10;
    this.animationFrameId = null;
    this.gameStartTime = null;
  }

  start() {
    this.ball.horizontalSpeed = 3;
    this.ball.verticalSpeed = -3;
    this.gameStartTime = Date.now();
    this.animate();
  }

  animate(timestamp) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (!this.isPaused) {
      this.update(deltaTime);
      this.draw();
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  update(deltaTime) {
    this.ball.update(deltaTime);

    // 球与边界碰撞检测
    if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.horizontalSpeed *= -1;
      this.sound.playBounce();
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.verticalSpeed *= -1;
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
      this.ball.horizontalSpeed = Math.cos(bounceAngle) * Math.abs(this.ball.horizontalSpeed);
      this.ball.verticalSpeed = -Math.sin(bounceAngle) * Math.abs(this.ball.verticalSpeed);

      this.score++;
      this.sound.playScore();
    }

    // 球与砖块碰撞检测
    this.bricks.forEach((brick, index) => {
      if (this.checkBrickCollision(this.ball, brick)) {
        this.bricks.splice(index, 1);
        this.score += 10;
        this.sound.playScore();
        this.bricksDestroyed++;
        this.ball.verticalSpeed *= -1;

        //  增加球速
        if (this.bricksDestroyed % 10 === 0 && 
            Math.abs(this.ball.horizontalSpeed) < this.maxBallSpeed && 
            Math.abs(this.ball.verticalSpeed) < this.maxBallSpeed) {
          this.ball.horizontalSpeed *= 1.05;
          this.ball.verticalSpeed *= 1.05;
        }
      }
    });

    // 球出界
    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.gameOver();
    }

    // 胜利条件
    if (this.bricks.length === 0) {
      this.gameWin();
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
    this.ball.horizontalSpeed = 0;
    this.ball.verticalSpeed = 0;
    this.score = 0;
    this.isPaused = false;
    this.bricks = this.createBricks();
    this.bricksDestroyed = 0;
    cancelAnimationFrame(this.animationFrameId); // 取消动画
  }

  gameOver() {
    this.sound.playGameOver();
    const gameOverTime = Date.now();
    const gameDuration = (gameOverTime - this.gameStartTime) / 1000;
    alert(`游戏结束！得分: ${this.score}, 用时: ${gameDuration}秒`);
    const restartGameButton = document.getElementById('restartGameButton');
    restartGameButton.style.display = 'block';
    this.reset();
  }

  gameWin() {
    this.sound.playScore();
    const gameWinTime = Date.now();
    const gameDuration = (gameWinTime - this.gameStartTime) / 1000;
    alert(`恭喜你，游戏胜利！得分: ${this.score}, 用时: ${gameDuration}秒`);
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
    for (let i = 0; i < BRICK_ROW_COUNT; i++) {
      for (let j = 0; j < BRICK_COLUMN_COUNT; j++) {
        bricks.push({
          x: j * (BRICK_WIDTH + BRICK_GAP),
          y: i * (BRICK_HEIGHT + BRICK_GAP) + 50,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLOR
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