const maze = document.getElementById('maze');
const resetButton = document.getElementById('resetButton');

// 迷宫尺寸
const mazeWidth = 20;
const mazeHeight = 15;

// 方向枚举
const Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

// 迷宫数据结构
let mazeData = [];

// 玩家位置
let playerX = 0;
let playerY = 0;

// 目标位置
let goalX = mazeWidth - 1;
let goalY = mazeHeight - 1;

// 初始化迷宫
function initMaze() {
  mazeData = [];
  for (let y = 0; y < mazeHeight; y++) {
    let row = [];
    for (let x = 0; x < mazeWidth; x++) {
      row.push(false); // 默认所有格子都可通行
    }
    mazeData.push(row);
  }

  // 设置起点和终点
  mazeData[playerY][playerX] = true;
  mazeData[goalY][goalX] = true;

  // 生成迷宫墙壁
  generateMaze();
}

// 生成迷宫墙壁 (递归回溯算法)
function generateMaze() {
  // 随机选择一个起始点
  let startX = Math.floor(Math.random() * mazeWidth);
  let startY = Math.floor(Math.random() * mazeHeight);

  // 递归回溯算法
  function recursiveBacktracker(x, y) {
    // 标记当前格子已访问
    mazeData[y][x] = true;

    // 随机选择一个方向
    let directions = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
    shuffleArray(directions);

    // 遍历所有方向
    for (let i = 0; i < directions.length; i++) {
      let newX = x;
      let newY = y;

      switch (directions[i]) {
        case Direction.UP:
          newY -= 2;
          break;
        case Direction.RIGHT:
          newX += 2;
          break;
        case Direction.DOWN:
          newY += 2;
          break;
        case Direction.LEFT:
          newX -= 2;
          break;
      }

      // 检查新格子是否在迷宫范围内且未访问
      if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && !mazeData[newY][newX]) {
        // 打通墙
        mazeData[y + (newY - y) / 2][x + (newX - x) / 2] = true;

        // 递归回溯
        recursiveBacktracker(newX, newY);
      }
    }
  }

  // 从起始点开始生成迷宫
  recursiveBacktracker(startX, startY);
}

// 随机打乱数组顺序
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 绘制迷宫
function drawMaze() {
  maze.innerHTML = '';
  for (let y = 0; y < mazeHeight; y++) {
    let row = document.createElement('div');
    row.classList.add('maze-row');
    for (let x = 0; x < mazeWidth; x++) {
      let cell = document.createElement('div');
      cell.classList.add('maze-cell');
      if (mazeData[y][x]) {
        cell.classList.add('maze-path');
        if (x === playerX && y === playerY) {
          cell.classList.add('player');
        } else if (x === goalX && y === goalY) {
          cell.classList.add('goal');
        }
      } else {
        cell.classList.add('maze-wall');
      }
      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
}

// 处理玩家移动
function handlePlayerMove(direction) {
  let newX = playerX;
  let newY = playerY;

  switch (direction) {
    case Direction.UP:
      newY--;
      break;
    case Direction.RIGHT:
      newX++;
      break;
    case Direction.DOWN:
      newY++;
      break;
    case Direction.LEFT:
      newX--;
      break;
  }

  // 检查新位置是否在迷宫范围内且可通行
  if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && mazeData[newY][newX]) {
    playerX = newX;
    playerY = newY;
    drawMaze();

    // 检查是否到达终点
    if (playerX === goalX && playerY === goalY) {
      alert('恭喜你找到出口！');
    }
  }
}

// 添加键盘事件监听
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      handlePlayerMove(Direction.UP);
      break;
    case 'ArrowRight':
      handlePlayerMove(Direction.RIGHT);
      break;
    case 'ArrowDown':
      handlePlayerMove(Direction.DOWN);
      break;
    case 'ArrowLeft':
      handlePlayerMove(Direction.LEFT);
      break;
  }
});

// 重新开始游戏
resetButton.addEventListener('click', () => {
  initMaze();
  drawMaze();
});

// 初始化游戏
initMaze();
drawMaze();