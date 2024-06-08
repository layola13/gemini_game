const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏参数
const gridSize = 10; // 六边形网格大小
const hexWidth = 40; // 六边形宽度
const hexHeight = 35; // 六边形高度
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // 可选颜色

// 初始化游戏
let grid = []; // 游戏网格
let currentColor = 0; // 当前颜色索引
let score = 0; // 分数

// 创建六边形网格
function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = {
        x: j * hexWidth * 1.5 + (i % 2) * hexWidth * 0.75,
        y: i * hexHeight * 1.5,
        color: null,
        filled: false
      };
    }
  }
}

// 绘制六边形
function drawHexagon(x, y, color) {
  ctx.beginPath();
  ctx.moveTo(x + hexWidth / 2, y);
  ctx.lineTo(x + hexWidth, y + hexHeight / 2);
  ctx.lineTo(x + hexWidth / 2, y + hexHeight);
  ctx.lineTo(x, y + hexHeight / 2);
  ctx.lineTo(x + hexWidth / 2, y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

// 绘制游戏网格
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row, i) => {
    row.forEach((hex, j) => {
      if (hex.filled) {
        drawHexagon(hex.x, hex.y, colors[hex.color]);
      }
    });
  });
}

// 处理鼠标点击事件
canvas.addEventListener('click', (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  // 找到被点击的六边形
  grid.forEach((row, i) => {
    row.forEach((hex, j) => {
      if (hex.x <= mouseX && mouseX <= hex.x + hexWidth &&
          hex.y <= mouseY && mouseY <= hex.y + hexHeight &&
          !hex.filled) {
        hex.color = currentColor;
        hex.filled = true;
        checkFill(i, j);
        currentColor = (currentColor + 1) % colors.length;
      }
    });
  });
  drawGrid();
});

// 检查填充
function checkFill(row, col) {
  let count = 1;
  // 向上检查
  if (row > 0 && grid[row - 1][col].filled && grid[row - 1][col].color === grid[row][col].color) {
    count += checkFill(row - 1, col);
  }
  // 向下检查
  if (row < gridSize - 1 && grid[row + 1][col].filled && grid[row + 1][col].color === grid[row][col].color) {
    count += checkFill(row + 1, col);
  }
  // 向左检查
  if (col > 0 && grid[row][col - 1].filled && grid[row][col - 1].color === grid[row][col].color) {
    count += checkFill(row, col - 1);
  }
  // 向右检查
  if (col < gridSize - 1 && grid[row][col + 1].filled && grid[row][col + 1].color === grid[row][col].color) {
    count += checkFill(row, col + 1);
  }
  // 向左上检查 (奇数行)
  if (row % 2 === 1 && row > 0 && col > 0 && grid[row - 1][col - 1].filled && grid[row - 1][col - 1].color === grid[row][col].color) {
    count += checkFill(row - 1, col - 1);
  }
  // 向右上检查 (偶数行)
  if (row % 2 === 0 && row > 0 && col < gridSize - 1 && grid[row - 1][col + 1].filled && grid[row - 1][col + 1].color === grid[row][col].color) {
    count += checkFill(row - 1, col + 1);
  }
  // 向左下检查 (奇数行)
  if (row % 2 === 1 && row < gridSize - 1 && col > 0 && grid[row + 1][col - 1].filled && grid[row + 1][col - 1].color === grid[row][col].color) {
    count += checkFill(row + 1, col - 1);
  }
  // 向右下检查 (偶数行)
  if (row % 2 === 0 && row < gridSize - 1 && col < gridSize - 1 && grid[row + 1][col + 1].filled && grid[row + 1][col + 1].color === grid[row][col].color) {
    count += checkFill(row + 1, col + 1);
  }
  if (count >= 3) {
    // 填充成功，更新分数并清空填充区域
    score += count * count;
    // 清空填充区域
    grid.forEach((row, i) => {
      row.forEach((hex, j) => {
        if (hex.filled && hex.color === grid[row][col].color) {
          hex.filled = false;
        }
      });
    });
  }
  return count;
}

// 初始化游戏
createGrid();
canvas.width = gridSize * hexWidth * 1.5;
canvas.height = gridSize * hexHeight * 1.5;
drawGrid();