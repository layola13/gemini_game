// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const blockSize = 30;
const rows = 20;
const cols = 10;

// 颜色定义
const colors = [
  'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// 方块形状定义
const shapes = [
  [ // I 形
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [ // J 形
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [ // L 形
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [ // O 形
    [1, 1],
    [1, 1]
  ],
  [ // S 形
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  [ // T 形
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [ // Z 形
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
];

// 游戏状态
let board = [];
let currentShape = {};
let nextShape = {};
let score = 0;
let gameOver = false;

// 初始化游戏
function initGame() {
  // 初始化游戏面板
  board = Array(rows).fill(0).map(() => Array(cols).fill(0));
  // 生成初始方块
  currentShape = createShape();
  nextShape = createShape();
  // 重置得分
  score = 0;
  // 设置游戏结束状态为 false
  gameOver = false;
  // 开始游戏循环
  gameLoop();
}

// 创建新的方块
function createShape() {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  const shape = {
    type: randomIndex,
    color: colors[randomIndex],
    x: Math.floor((cols - shapes[randomIndex][0].length) / 2),
    y: 0,
    rotation: 0
  };
  return shape;
}

// 绘制游戏面板
function drawBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col] !== 0) {
        ctx.fillStyle = board[row][col];
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'gray';
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

// 绘制当前方块
function drawShape(shape) {
  for (let row = 0; row < shape.type.length; row++) {
    for (let col = 0; col < shape.type[row].length; col++) {
      if (shape.type[row][col] === 1) {
        ctx.fillStyle = shape.color;
        ctx.fillRect((shape.x + col) * blockSize, (shape.y + row) * blockSize, blockSize, blockSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect((shape.x + col) * blockSize, (shape.y + row) * blockSize, blockSize, blockSize);
      }
    }
  }
}

// 移动方块
function moveShape(dx, dy) {
  // 检查是否可以移动
  if (canMove(currentShape, dx, dy)) {
    currentShape.x += dx;
    currentShape.y += dy;
  } else {
    // 碰到底部
    if (dy > 0) {
      freezeShape();
    }
  }
}

// 旋转方块
function rotateShape() {
  // 计算旋转后的坐标
  const newRotation = (currentShape.rotation + 1) % 4;
  const newShape = {
    ...currentShape,
    rotation: newRotation,
    type: rotateMatrix(currentShape.type, newRotation)
  };
  // 检查是否可以旋转
  if (canMove(newShape, 0, 0)) {
    currentShape = newShape;
  }
}

// 旋转矩阵
function rotateMatrix(matrix, rotation) {
  const n = matrix.length;
  const newMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      switch (rotation) {
        case 1:
          newMatrix[col][n - 1 - row] = matrix[row][col];
          break;
        case 2:
          newMatrix[n - 1 - row][n - 1 - col] = matrix[row][col];
          break;
        case 3:
          newMatrix[n - 1 - col][row] = matrix[row][col];
          break;
        default:
          newMatrix[row][col] = matrix[row][col];
          break;
      }
    }
  }
  return newMatrix;
}

// 检查是否可以移动
function canMove(shape, dx, dy) {
  for (let row = 0; row < shape.type.length; row++) {
    for (let col = 0; col < shape.type[row].length; col++) {
      if (shape.type[row][col] === 1) {
        // 检查边界
        if (shape.x + col + dx < 0 || shape.x + col + dx >= cols) {
          return false;
        }
        if (shape.y + row + dy >= rows) {
          return false;
        }
        // 检查是否与其他方块碰撞
        if (shape.y + row + dy >= 0 && board[shape.y + row + dy][shape.x + col + dx] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

// 将当前方块冻结到游戏面板上
function freezeShape() {
  for (let row = 0; row < currentShape.type.length; row++) {
    for (let col = 0; col < currentShape.type[row].length; col++) {
      if (currentShape.type[row][col] === 1) {
        board[currentShape.y + row][currentShape.x + col] = currentShape.color;
      }
    }
  }
  // 检查是否有完整行
  checkLines();
  // 生成新的方块
  currentShape = nextShape;
  nextShape = createShape();
  // 检查游戏是否结束
  if (!canMove(currentShape, 0, 0)) {
    gameOver = true;
  }
}

// 检查是否有完整行
function checkLines() {
  let linesCleared = 0;
  for (let row = 0; row < rows; row++) {
    if (board[row].every(cell => cell !== 0)) {
      // 清除整行
      board.splice(row, 1);
      board.unshift(Array(cols).fill(0));
      linesCleared++;
    }
  }
  // 更新得分
  score += linesCleared * 100;
}

// 游戏循环
function gameLoop() {
  if (!gameOver) {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制游戏面板
    drawBoard();
    // 绘制当前方块
    drawShape(currentShape);
    // 移动方块
    moveShape(0, 1);
    // 延迟下一帧
    requestAnimationFrame(gameLoop);
  } else {
    // 游戏结束
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('游戏结束！', 50, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('得分：' + score, 50, canvas.height / 2 + 30);
  }
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
  if (!gameOver) {
    switch (event.code) {
      case 'ArrowLeft':
        moveShape(-1, 0);
        break;
      case 'ArrowRight':
        moveShape(1, 0);
        break;
      case 'ArrowDown':
        moveShape(0, 1);
        break;
      case 'ArrowUp':
        rotateShape();
        break;
    }
  }
});

// 初始化游戏
initGame();