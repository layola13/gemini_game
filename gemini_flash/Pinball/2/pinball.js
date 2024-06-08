// pinball.js

export class Pinball {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // 游戏参数
    this.ballRadius = 10;
    this.ballX = canvas.width / 2;
    this.ballY = canvas.height - 30;
    this.ballSpeedX = 2; // 降低球的速度
    this.ballSpeedY = -2; // 降低球的速度
    this.paddleWidth = 120; // 增加球拍的宽度
    this.paddleHeight = 10;
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    this.paddleY = canvas.height - 20;
    this.rightPressed = false;
    this.leftPressed = false;

    // 游戏状态
    this.score = 0;
    this.lives = 3;
    this.gameRunning = false;

    // 监听键盘事件
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  // 键盘按下事件处理
  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  // 键盘抬起事件处理
  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  // 更新游戏逻辑
  update() {
    // 更新球的位置
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // 球碰到左右边界反弹
    if (this.ballX + this.ballRadius > this.canvas.width || this.ballX - this.ballRadius < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // 球碰到顶部反弹
    if (this.ballY - this.ballRadius < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // 球碰到球拍
    if (this.ballY + this.ballRadius > this.paddleY && this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
      this.ballSpeedY = -this.ballSpeedY;
      this.score++;
    }

    // 球碰到底部边界，生命值减一
    if (this.ballY + this.ballRadius > this.canvas.height) {
      this.lives--;
      this.resetBall();
    }

    // 更新球拍位置
    if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    // 游戏结束
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // 重置球的位置
  resetBall() {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - 30;
    this.ballSpeedX = 2; // 降低球的速度
    this.ballSpeedY = -2; // 降低球的速度
  }

  // 游戏结束
  gameOver() {
    // 停止游戏循环
    cancelAnimationFrame(this.animationId);

    // 显示游戏结束信息
    this.ctx.font = '30px Arial';
    this.ctx.fillText('游戏结束', this.canvas.width / 2 - 100, this.canvas.height / 2);
  }

  // 绘制游戏画面
  draw() {
    // 绘制球
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();

    // 绘制球拍
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // 开始游戏
  start() {
    // 初始化游戏状态
    this.gameRunning = true;
    initGame();

    // 开始游戏循环
    this.animationId = requestAnimationFrame(gameLoop);
  }

  // 重置游戏
  reset() {
    this.resetBall();
    this.score = 0;
    this.lives = 3;
    this.gameRunning = false;
    initGame();
  }
}