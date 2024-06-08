export class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocityX = 0; // 使用更语义化的变量名
    this.velocityY = 0; // 使用更语义化的变量名
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.velocityX; // 使用更语义化的变量名
    this.y += this.velocityY; // 使用更语义化的变量名

    // 边界碰撞检测
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.velocityX = -this.velocityX;
    }
    if (this.y - this.radius < 0) {
      this.velocityY = -this.velocityY;
    }
  }

  // 重置弹球位置
  reset(x, y) {
    this.x = x;
    this.y = y;
  }
}