// game.js

import { Player } from './player.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏尺寸
const gameWidth = 800;
const gameHeight = 600;

// 设置画布尺寸
canvas.width = gameWidth;
canvas.height = gameHeight;

// 游戏状态
let gameRunning = false;

// 游戏对象
let player;
let enemies = [];

// 初始化游戏
function init() {
  player = new Player(gameWidth / 2, gameHeight - 50);
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

// 游戏循环
function gameLoop() {
  if (gameRunning) {
    // 清除画布
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // 更新游戏对象
    player.update();
    enemies.forEach(enemy => enemy.update());

    // 绘制游戏对象
    player.draw(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));

    // 生成敌人
    if (Math.random() < 0.01) {
      enemies.push(new Enemy());
    }

    // 碰撞检测
    enemies.forEach((enemy, index) => {
      if (player.collidesWith(enemy)) {
        // 处理碰撞事件
        enemies.splice(index, 1);
      }
    });

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
  }
}

// 开始游戏
init();