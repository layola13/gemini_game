const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'start'; // start, playing, gameover

// 游戏变量
let score = 0;
let time = 0;
let farm = []; // 农场土地数据
let crops = []; // 作物数据
let tools = []; // 工具数据

// 初始化游戏
function initGame() {
  // 设置画布尺寸
  canvas.width = 800;
  canvas.height = 600;

  // 初始化农场土地
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      farm.push({
        x: i * 80,
        y: j * 60,
        type: 'empty', // empty, planted, harvested
        crop: null, // 作物类型
      });
    }
  }

  // 初始化工具
  tools.push({
    type: 'hoe', // hoe, seed, water
  });

  // 开始游戏循环
  gameLoop();
}

// 游戏循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新游戏状态
  updateGameState();

  // 绘制游戏画面
  drawGame();

  // 循环调用
  requestAnimationFrame(gameLoop);
}

// 更新游戏状态
function updateGameState() {
  // 游戏开始
  if (gameState === 'start') {
    // 初始化游戏
    initGame();
    gameState = 'playing';
  }

  // 游戏进行中
  if (gameState === 'playing') {
    // 更新时间
    time++;

    // 处理玩家操作
    handlePlayerInput();

    // 更新作物生长
    updateCrops();

    // 检查游戏结束条件
    checkGameOver();
  }

  // 游戏结束
  if (gameState === 'gameover') {
    // 显示游戏结束画面
    drawGameOver();
  }
}

// 绘制游戏画面
function drawGame() {
  // 绘制农场土地
  drawFarm();

  // 绘制作物
  drawCrops();

  // 绘制工具
  drawTools();

  // 绘制分数和时间
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Time: ${time}`, 10, 60);
}

// 处理玩家操作
function handlePlayerInput() {
  // 鼠标点击事件
  canvas.addEventListener('click', (event) => {
    // 获取鼠标点击坐标
    const x = event.offsetX;
    const y = event.offsetY;

    // 检查点击位置是否在农场土地上
    for (let i = 0; i < farm.length; i++) {
      if (x >= farm[i].x && x <= farm[i].x + 80 && y >= farm[i].y && y <= farm[i].y + 60) {
        // 处理点击操作
        handleFarmClick(farm[i]);
      }
    }
  });
}

// 处理农场土地点击操作
function handleFarmClick(land) {
  // 使用当前工具
  const currentTool = tools[0];

  // 耕地
  if (currentTool.type === 'hoe' && land.type === 'empty') {
    land.type = 'planted';
  }

  // 种植作物
  if (currentTool.type === 'seed' && land.type === 'planted' && land.crop === null) {
    land.crop = 'wheat'; // 默认种植小麦
  }

  // 浇水
  if (currentTool.type === 'water' && land.type === 'planted' && land.crop !== null) {
    // ...
  }
}

// 更新作物生长
function updateCrops() {
  // ...
}

// 检查游戏结束条件
function checkGameOver() {
  // ...
}

// 绘制游戏结束画面
function drawGameOver() {
  // ...
}

// 绘制农场土地
function drawFarm() {
  // ...
}

// 绘制作物
function drawCrops() {
  // ...
}

// 绘制工具
function drawTools() {
  // ...
}

// 初始化游戏
initGame();