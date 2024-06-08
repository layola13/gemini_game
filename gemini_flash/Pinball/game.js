// game.js

import { Pinball } from './pinball.js';

const canvas = document.getElementById('pinballCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// 设置画布大小
canvas.width = 800;
canvas.height = 600;

// 创建弹珠台游戏实例
let game = null;

// 游戏状态
let gameRunning = false;
let gamePaused = false;

// 开始游戏
startButton.addEventListener('click', () => {
  if (!gameRunning) {
    gameRunning = true;
    game = new Pinball(canvas, ctx);
    game.start();
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;
    gameOverElement.style.display = 'none'; // 隐藏游戏结束画面
  }
});

// 暂停游戏
pauseButton.addEventListener('click', () => {
  gamePaused = !gamePaused;
  if (gamePaused) {
    pauseButton.textContent = '继续游戏';
  } else {
    pauseButton.textContent = '暂停游戏';
  }
});

// 重新开始游戏
resetButton.addEventListener('click', () => {
  resetGame();
});

// 重新开始游戏按钮点击事件
restartButton.addEventListener('click', () => {
  resetGame();
  startButton.click(); // 模拟点击开始游戏按钮
});

// 游戏循环
function gameLoop() {
  if (gameRunning && !gamePaused) {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw();
  }
}

// 初始化游戏
function initGame() {
  // 设置初始分数和生命值
  game.score = 0;
  game.lives = 3;
  scoreElement.textContent = game.score;
  livesElement.textContent = game.lives;
}

// 重置游戏
function resetGame() {
  gameRunning = false;
  gamePaused = false;
  if (game) {
    game.reset();
  }
  scoreElement.textContent = 0; // 直接设置分数
  livesElement.textContent = 3; // 直接设置生命值
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;
  pauseButton.textContent = '暂停游戏';
  gameOverElement.style.display = 'none'; // 隐藏游戏结束画面
}

// 游戏循环
gameLoop();