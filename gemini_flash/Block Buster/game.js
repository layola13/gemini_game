const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// 游戏配置
const gridSize = 10; // 方块大小
const gridWidth = 10; // 网格宽度
const gridHeight = 10; // 网格高度
const colors = ['red', 'green', 'blue', 'yellow', 'purple']; // 方块颜色

// 游戏状态
let isRunning = false;
let score = 0;

// 网格数据
let grid = [];

// 初始化网格
function initGrid() {
  grid = [];
  for (let i = 0; i < gridHeight; i++) {
    grid[i] = [];
    for (let j = 0; j < gridWidth; j++) {
      grid[i][j] = {
        color: getRandomColor(),
        isMatched: false
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
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      ctx.fillStyle = grid[i][j].color;
      ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(j * gridSize, i * gridSize, gridSize, gridSize);
    }
  }
}

// 检查匹配
function checkMatches() {
  let matches = [];
  // 检查水平方向
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth - 2; j++) {
      if (grid[i][j].color === grid[i][j + 1].color &&
          grid[i][j].color === grid[i][j + 2].color &&
          !grid[i][j].isMatched) {
        matches.push([
          { x: j, y: i },
          { x: j + 1, y: i },
          { x: j + 2, y: i }
        ]);
        grid[i][j].isMatched = true;
        grid[i][j + 1].isMatched = true;
        grid[i][j + 2].isMatched = true;
      }
    }
  }
  // 检查垂直方向
  for (let i = 0; i < gridHeight - 2; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (grid[i][j].color === grid[i + 1][j].color &&
          grid[i][j].color === grid[i + 2][j].color &&
          !grid[i][j].isMatched) {
        matches.push([
          { x: j, y: i },
          { x: j, y: i + 1 },
          { x: j, y: i + 2 }
        ]);
        grid[i][j].isMatched = true;
        grid[i + 1][j].isMatched = true;
        grid[i + 2][j].isMatched = true;
      }
    }
  }
  return matches;
}

// 清除匹配的方块
function clearMatches() {
  let matches = checkMatches();
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      for (let j = 0; j < matches[i].length; j++) {
        grid[matches[i][j].y][matches[i][j].x].color = null;
      }
    }
    // 更新分数
    score += matches.length * 10;
    // 下落方块
    fallBlocks();
    // 检查是否有新的匹配
    checkMatches();
  }
}

// 下落方块
function fallBlocks() {
  for (let i = gridHeight - 1; i >= 0; i--) {
    for (let j = 0; j < gridWidth; j++) {
      if (grid[i][j].color === null) {
        // 找到上方第一个非空方块
        for (let k = i - 1; k >= 0; k--) {
          if (grid[k][j].color !== null) {
            grid[i][j] = grid[k][j];
            grid[k][j] = {
              color: getRandomColor(),
              isMatched: false
            };
            break;
          }
        }
      }
    }
  }
}

// 开始游戏
function startGame() {
  isRunning = true;
  initGrid();
  drawGrid();
  // 每秒检查匹配
  setInterval(clearMatches, 1000);
}

// 事件监听
startButton.addEventListener('click', startGame);

// 初始化游戏
initGrid();
drawGrid();