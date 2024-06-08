// ball.js

export class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.ballSpeedX = 0;
    this.ballSpeedY = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(deltaTime) {
    this.x += this.ballSpeedX * deltaTime;
    this.y += this.ballSpeedY * deltaTime;
  }
}