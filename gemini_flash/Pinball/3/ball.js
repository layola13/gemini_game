// ball.js

export default class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
  }

  draw() {
    const ctx = document.getElementById('pinballCanvas').getContext('2d');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  checkCollision(obj) {
    const distance = Math.sqrt(
      Math.pow(this.x - obj.x, 2) + Math.pow(this.y - obj.y, 2)
    );
    return distance <= this.radius + obj.radius;
  }
}