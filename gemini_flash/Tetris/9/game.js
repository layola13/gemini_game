// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const nextShapeCanvas = document.getElementById('nextShapeCanvas');
const nextShapeCtx = nextShapeCanvas.getContext('2d');

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const finalScoreElement = document.getElementById('finalScore');

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const restartButton = document.getElementById('restartButton');
const saveGameButton = document.getElementById('saveGameButton');
const loadGameButton = document.getElementById('loadGameButton');
const gameOverScreen = document.querySelector('.game-over');
const tutorialScreen = document.querySelector('.tutorial');
const startTutorialButton = document.getElementById('startTutorial');
const difficultySelect = document.getElementById('difficultySelect');

const blockSize = 30;
const rows = 20;
const cols = 10;
const LINE_CLEAR_SCORE = 100; // 消除一行得分
const LEVEL_UP_SCORE = 500; // 升級所需得分
const GAME_OVER_HEIGHT = 5; // 游戏结束高度

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

// 音效
const audio = {
  lineClear: new Audio('lineClear.mp3'), // 替换为实际的音频文件路径
  gameOver: new Audio('gameOver.mp3'), // 替换为实际的音频文件路径
  move: new Audio('move.mp3'), // 替换为实际的音频文件路径
  rotate: new Audio('rotate.mp3') // 替换为实际的音频文件路径
};

// 加载音效
for (const key in audio) {
  if (audio.hasOwnProperty(key)) {
    audio[key].preload = 'auto'; // 预先加载音频
  }
}

// 游戏状态
let board = [];
let currentShape = {};
let nextShape = {};
let score = 0;
let level = 1;
let gameOver = false;
let gamePaused = false;
let fallSpeed = 1000; // 毫秒
let fallInterval;
let gameStarted = false;
let comboCount = 0; // 连击计数

// 类定义
class Tetris {
  constructor() {
    this.initGame();
    this.bindEvents();
  }

  // 初始化游戏
  initGame() {
    // 初始化游戏面板
    board = Array(rows).fill(0).map(() => Array(cols).fill(0));
    // 生成初始方块
    currentShape = this.createShape();
    nextShape = this.createShape();
    // 重置得分
    score = 0;
    level = 1;
    // 设置游戏结束状态为 false
    gameOver = false;
    gamePaused = false;
    gameStarted = false;
    // 设置默认难度
    this.setDifficulty(difficultySelect.value);
    // 更新游戏信息
    this.updateGameInfo();
    this.drawNextShape();
  }

  // 创建新的方块
  createShape() {
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
  drawBoard() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] !== 0) {
          ctx.fillStyle = board[row][col];
          ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
          ctx.strokeStyle = 'black';
          ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        } else {
          ctx.fillStyle = '#eee'; // 更明亮的背景色
          ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
          ctx.strokeStyle = '#ccc'; // 更明亮的网格线颜色
          ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  // 绘制当前方块
  drawShape(shape) {
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

  // 绘制下一个方块
  drawNextShape() {
    nextShapeCtx.clearRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let row = 0; row < nextShape.type.length; row++) {
      for (let col = 0; col < nextShape.type[row].length; col++) {
        if (nextShape.type[row][col] === 1) {
          nextShapeCtx.fillStyle = nextShape.color;
          nextShapeCtx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
          nextShapeCtx.strokeStyle = 'black';
          nextShapeCtx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  // 移动方块
  moveShape(dx, dy) {
    // 检查是否可以移动
    if (this.canMove(currentShape, dx, dy)) {
      currentShape.x += dx;
      currentShape.y += dy;
      // 播放移动音效
      audio.move.currentTime = 0;
      audio.move.play();
    } else {
      // 碰到底部
      if (dy > 0) {
        this.freezeShape();
      }
    }
  }

  // 旋转方块
  rotateShape() {
    // 计算旋转后的坐标
    const newRotation = (currentShape.rotation + 1) % 4;
    const newShape = {
      ...currentShape,
      rotation: newRotation,
      type: this.rotateMatrix(currentShape.type, newRotation)
    };
    // 检查是否可以旋转
    if (this.canMove(newShape, 0, 0)) {
      currentShape = newShape;
      // 播放旋转音效
      audio.rotate.currentTime = 0;
      audio.rotate.play();
    }
  }

  // 旋转矩阵
  rotateMatrix(matrix, rotation) {
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
  canMove(shape, dx, dy) {
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
  freezeShape() {
    for (let row = 0; row < currentShape.type.length; row++) {
      for (let col = 0; col < currentShape.type[row].length; col++) {
        if (currentShape.type[row][col] === 1) {
          board[currentShape.y + row][currentShape.x + col] = currentShape.color;
        }
      }
    }
    // 检查是否有完整行
    this.checkLines();
    // 生成新的方块
    currentShape = nextShape;
    nextShape = this.createShape();
    // 检查游戏是否结束
    if (!this.canMove(currentShape, 0, 0)) {
      this.gameOver();
    }
  }

  // 检查是否有完整行
  checkLines() {
    let linesCleared = 0;
    for (let row = 0; row < rows; row++) {
      if (board[row].every(cell => cell !== 0)) {
        // 清除整行
        board.splice(row, 1);
        board.unshift(Array(cols).fill(0));
        linesCleared++;
        // 增加连击计数
        comboCount++;
      }
    }
    // 更新得分
    score += linesCleared * LINE_CLEAR_SCORE * comboCount; // 添加连击得分
    // 升级
    if (score >= level * LEVEL_UP_SCORE) {
      level++;
      this.setDifficulty(difficultySelect.value); // 更新难度
    }
    this.updateGameInfo();
    this.drawNextShape();
    // 播放消行音效
    if (linesCleared > 0) {
      audio.lineClear.currentTime = 0;
      audio.lineClear.play();
    }
    // 重置连击计数
    if (linesCleared === 0) {
      comboCount = 0;
    }
  }

  // 更新游戏信息
  updateGameInfo() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
  }

  // 游戏循环
  gameLoop() {
    if (!gameOver && !gamePaused) {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制游戏面板
      this.drawBoard();
      // 绘制当前方块
      this.drawShape(currentShape);
      // 延迟下一帧
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // 监听键盘事件
  bindEvents() {
    document.addEventListener('keydown', (event) => {
      if (!gameOver && !gamePaused) {
        switch (event.code) {
          case 'ArrowLeft':
            this.moveShape(-1, 0);
            break;
          case 'ArrowRight':
            this.moveShape(1, 0);
            break;
          case 'ArrowDown':
            this.moveShape(0, 1);
            break;
          case 'ArrowUp':
            this.rotateShape();
            break;
        }
      }
    });
    startButton.addEventListener('click', () => {
      if (gameOver) {
        this.initGame();
        gameOverScreen.style.display = 'none';
      }
      if (!gameStarted) {
        this.gameLoop();
        fallInterval = setInterval(() => {
          this.moveShape(0, 1);
        }, fallSpeed);
        gameStarted = true;
      }
      startButton.disabled = true;
      pauseButton.disabled = false;
      resetButton.disabled = false;
      saveGameButton.disabled = false;
      loadGameButton.disabled = false;
    });
    pauseButton.addEventListener('click', () => {
      gamePaused = !gamePaused;
      if (gamePaused) {
        pauseButton.textContent = '继续';
        clearInterval(fallInterval);
      } else {
        pauseButton.textContent = '暂停';
        fallInterval = setInterval(() => {
          this.moveShape(0, 1);
        }, fallSpeed);
        this.gameLoop();
      }
    });
    resetButton.addEventListener('click', () => {
      this.initGame();
      gamePaused = false;
      clearInterval(fallInterval);
      gameStarted = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
      resetButton.disabled = true;
      saveGameButton.disabled = true;
      loadGameButton.disabled = true;
    });
    restartButton.addEventListener('click', () => {
      this.initGame();
      gameOverScreen.style.display = 'none';
    });
    startTutorialButton.addEventListener('click', () => {
      tutorialScreen.style.display = 'none';
      this.initGame();
      startButton.disabled = false;
    });
    difficultySelect.addEventListener('change', () => {
      this.setDifficulty(difficultySelect.value);
    });
    saveGameButton.addEventListener('click', () => {
      this.saveGame();
    });
    loadGameButton.addEventListener('click', () => {
      this.loadGame();
    });
  }

  // 设置游戏难度
  setDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        fallSpeed = 1000;
        break;
      case 'normal':
        fallSpeed = 700;
        break;
      case 'hard':
        fallSpeed = 400;
        break;
    }
    if (fallInterval) {
      clearInterval(fallInterval);
      fallInterval = setInterval(() => {
        this.moveShape(0, 1);
      }, fallSpeed);
    }
  }

  // 游戏结束
  gameOver() {
    gameOver = true;
    clearInterval(fallInterval);
    gameStarted = false; // 标记游戏已结束
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    audio.gameOver.currentTime = 0;
    audio.gameOver.play();
  }

  // 保存游戏进度
  saveGame() {
    const gameData = {
      score: score,
      level: level,
      board: board,
      currentShape: currentShape,
      nextShape: nextShape
    };
    localStorage.setItem('tetrisGameData', JSON.stringify(gameData));
    console.log('游戏已保存！');
  }

  // 加载游戏进度
  loadGame() {
    const gameData = localStorage.getItem('tetrisGameData');
    if (gameData) {
      const loadedData = JSON.parse(gameData);
      score = loadedData.score;
      level = loadedData.level;
      board = loadedData.board;
      currentShape = loadedData.currentShape;
      nextShape = loadedData.nextShape;
      this.updateGameInfo();
      this.drawNextShape();
      console.log('游戏已加载！');
    } else {
      console.log('没有保存的游戏进度！');
    }
  }
}

// 初始化游戏
const tetris = new Tetris();
tutorialScreen.style.display = 'block';