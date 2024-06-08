// pinball.js

export class Pinball {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // 游戏参数
    this.ballRadius = 10;
    this.ballX = canvas.width / 2;
    this.ballY = canvas.height - 30;
    this.ballDX = 3;
    this.ballDY = -3;
    this.paddleWidth = 100;
    this.paddleHeight = 10;
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    this.paddleY = canvas.height - 20;
    this.rightPressed = false;
    this.leftPressed = false;

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
    this.ballX += this.ballDX;
    this.ballY += this.ballDY;

    // 球碰到左右边界反弹
    if (this.ballX + this.ballRadius > this.canvas.width || this.ballX - this.ballRadius < 0) {
      this.ballDX = -this.ballDX;
    }

    // 球碰到顶部反弹
    if (this.ballY - this.ballRadius < 0) {
      this.ballDY = -this.ballDY;
    }

    // 球碰到球拍
    if (this.ballY + this.ballRadius > this.paddleY && this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
      this.ballDY = -this.ballDY;
    }

    // 更新球拍位置
    if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }
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
}