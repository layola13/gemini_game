// game.js (ES6 with Class Design)

class Mushroom {
  constructor(x, y, type, team) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.team = team;
    this.health = 100;
    this.attack = 10;
    this.speed = 1;
    this.range = 50;
  }

  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  }

  attackTarget(target) {
    target.health -= this.attack;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.mushrooms = [];
    this.teams = {
      'red': {
        color: 'red',
        mushrooms: []
      },
      'blue': {
        color: 'blue',
        mushrooms: []
      }
    };

    this.init();
  }

  init() {
    // 初始化游戏逻辑，例如添加初始蘑菇
    this.addMushroom(100, 100, 'warrior', 'red');
    this.addMushroom(this.width - 100, this.height - 100, 'warrior', 'blue');
  }

  addMushroom(x, y, type, team) {
    const mushroom = new Mushroom(x, y, type, team);
    this.mushrooms.push(mushroom);
    this.teams[team].mushrooms.push(mushroom);
  }

  update() {
    // 游戏逻辑更新，例如移动蘑菇，攻击等
    this.mushrooms.forEach(mushroom => {
      // 简单的移动
      mushroom.move(1, 0); 
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 绘制蘑菇
    this.mushrooms.forEach(mushroom => {
      this.ctx.fillStyle = this.teams[mushroom.team].color;
      this.ctx.fillRect(mushroom.x, mushroom.y, 20, 20);
    });
  }

  run() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.run());
  }
}

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
game.run();