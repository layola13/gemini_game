// game.js

class SpinningGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 游戏对象
    this.objects = [];
    this.addObject(new SpinningObject(this.width / 2, this.height / 2, 50, 'red'));

    // 帧速率
    this.fps = 60;
    this.intervalId = null;
  }

  addObject(object) {
    this.objects.push(object);
  }

  start() {
    this.intervalId = setInterval(() => {
      this.update();
      this.render();
    }, 1000 / this.fps);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  update() {
    this.objects.forEach(object => object.update());
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.forEach(object => object.draw(this.ctx));
  }
}

class SpinningObject {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.rotation = 0;
    this.rotationSpeed = 0.05;
  }

  update() {
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

const canvas = document.getElementById('gameCanvas');
const game = new SpinningGame(canvas);
game.start();