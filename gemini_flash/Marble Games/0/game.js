// game.js
import { Canvas } from './canvas.js';
import { Ball } from './ball.js';

class Game {
  constructor(canvasId) {
    this.canvas = new Canvas(canvasId);
    this.balls = [];
    this.gravity = 0.1; // 重力加速度
    this.friction = 0.01; // 摩擦系数
    this.init();
  }

  init() {
    this.canvas.ctx.fillStyle = 'black';
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.addBall(100, 100, 20, 'red');
    this.addBall(200, 200, 30, 'blue');
  }

  addBall(x, y, radius, color) {
    this.balls.push(new Ball(x, y, radius, color));
  }

  update() {
    this.canvas.clear();

    this.balls.forEach(ball => {
      ball.applyGravity(this.gravity);
      ball.applyFriction(this.friction);
      ball.update();
      ball.draw(this.canvas.ctx);
    });
  }

  run() {
    setInterval(() => {
      this.update();
    }, 10);
  }
}

const game = new Game('gameCanvas');
game.run();