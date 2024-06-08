const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const gridSize = 30; // 格子大小
const gridWidth = 10; // 网格宽度
const gridHeight = 15; // 网格高度
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // 球的颜色

// 游戏状态
let grid = [];
let score = 0;
let gameOver = false;

// 初始化网格
function initGrid() {
  grid = [];
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = {
        color: getRandomColor(),
        matched: false
      };
    }
  }
}

// 获取随机颜色
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// 绘制网格
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      ctx.fillStyle = grid[y][x].color;
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }
}

// 检查匹配
function checkMatch() {
  // 检查水平匹配
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth - 2; x++) {
      if (grid[y][x].color === grid[y][x + 1].color && grid[y][x].color === grid[y][x + 2].color) {
        grid[y][x].matched = true;
        grid[y][x + 1].matched = true;
        grid[y][x + 2].matched = true;
        score += 3;
      }
    }
  }
  // 检查垂直匹配
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight - 2; y++) {
      if (grid[y][x].color === grid[y + 1][x].color && grid[y][x].color === grid[y + 2][x].color) {
        grid[y][x].matched = true;
        grid[y + 1][x].matched = true;
        grid[y + 2][x].matched = true;
        score += 3;
      }
    }
  }
}

// 清除匹配的球
function clearMatched() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x].matched) {
        grid[y][x] = { color: null, matched: false };
      }
    }
  }
}

// 下落球
function dropBalls() {
  for (let x = 0; x < gridWidth; x++) {
    let emptyIndex = gridHeight - 1;
    for (let y = gridHeight - 1; y >= 0; y--) {
      if (grid[y][x].color !== null) {
        grid[emptyIndex][x] = grid[y][x];
        grid[y][x] = { color: null, matched: false };
        emptyIndex--;
      }
    }
  }
}

// 生成新的球
function generateNewBalls() {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (grid[y][x].color === null) {
        grid[y][x] = { color: getRandomColor(), matched: false };
      }
    }
  }
}

// 游戏循环
function gameLoop() {
  if (!gameOver) {
    checkMatch();
    clearMatched();
    dropBalls();
    generateNewBalls();
    drawGrid();
  } else {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('游戏结束！得分：' + score, canvas.width / 2 - 100, canvas.height / 2);
  }
  requestAnimationFrame(gameLoop);
}

// 初始化游戏
function initGame() {
  canvas.width = gridWidth * gridSize;
  canvas.height = gridHeight * gridSize;
  initGrid();
  gameLoop();
}

// 开始游戏
initGame();