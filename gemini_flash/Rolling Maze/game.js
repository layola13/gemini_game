const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 32; // 格子大小
const mazeWidth = 20; // 迷宫宽度（以格子为单位）
const mazeHeight = 15; // 迷宫高度（以格子为单位）

let maze = []; // 迷宫数据
let playerX = 0; // 玩家 X 坐标
let playerY = 0; // 玩家 Y 坐标

// 生成迷宫
function generateMaze() {
  maze = [];
  for (let y = 0; y < mazeHeight; y++) {
    maze[y] = [];
    for (let x = 0; x < mazeWidth; x++) {
      maze[y][x] = Math.random() < 0.3 ? 1 : 0; // 随机生成墙壁 (1) 或路径 (0)
    }
  }
  // 确保起点和终点是路径
  maze[0][0] = 0;
  maze[mazeHeight - 1][mazeWidth - 1] = 0;
}

// 绘制迷宫
function drawMaze() {
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }
}

// 绘制玩家
function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(playerX * gridSize, playerY * gridSize, gridSize, gridSize);
}

// 处理玩家移动
function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (playerY > 0 && maze[playerY - 1][playerX] === 0) {
        playerY--;
      }
      break;
    case 'ArrowDown':
      if (playerY < mazeHeight - 1 && maze[playerY + 1][playerX] === 0) {
        playerY++;
      }
      break;
    case 'ArrowLeft':
      if (playerX > 0 && maze[playerY][playerX - 1] === 0) {
        playerX--;
      }
      break;
    case 'ArrowRight':
      if (playerX < mazeWidth - 1 && maze[playerY][playerX + 1] === 0) {
        playerX++;
      }
      break;
  }
}

// 检查玩家是否到达终点
function checkWin() {
  if (playerX === mazeWidth - 1 && playerY === mazeHeight - 1) {
    alert('恭喜你，你赢了！');
  }
}

// 游戏循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  checkWin();
  requestAnimationFrame(gameLoop);
}

// 初始化游戏
function init() {
  canvas.width = mazeWidth * gridSize;
  canvas.height = mazeHeight * gridSize;
  generateMaze();
  gameLoop();
  window.addEventListener('keydown', handleInput);
}

init();