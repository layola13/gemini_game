const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'start'; // start, playing, gameover

// 游戏设置
const gridSize = 60; // 格子大小
const numRows = 5; // 行数
const numCols = 9; // 列数
const plantCost = {
    'peaShooter': 100,
    'sunflower': 50,
};

// 资源
let sun = 50;

// 植物数据
const plants = {
    'peaShooter': {
        img: new Image(),
        cost: 100,
        attack: 10,
        fireRate: 1000, // 毫秒
        range: 5,
    },
    'sunflower': {
        img: new Image(),
        cost: 50,
        sunProduction: 25,
        productionRate: 5000, // 毫秒
    },
};

// 初始化植物图片
for (const plant in plants) {
    plants[plant].img.src = `images/${plant}.png`;
}

// 僵尸数据
const zombies = {
    'normal': {
        img: new Image(),
        health: 100,
        speed: 50, // 每秒移动的像素
    },
};

// 初始化僵尸图片
for (const zombie in zombies) {
    zombies[zombie].img.src = `images/${zombie}.png`;
}

// 游戏对象
let gameObjects = [];

// 初始化游戏
function initGame() {
    gameState = 'start';
    sun = 50;
    gameObjects = [];
}

// 绘制游戏
function drawGame() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制植物
    for (const plant of gameObjects.filter(obj => obj.type === 'plant')) {
        ctx.drawImage(
            plants[plant.name].img,
            plant.col * gridSize,
            plant.row * gridSize,
            gridSize,
            gridSize
        );
    }

    // 绘制僵尸
    for (const zombie of gameObjects.filter(obj => obj.type === 'zombie')) {
        ctx.drawImage(
            zombies[zombie.name].img,
            zombie.x,
            zombie.row * gridSize,
            gridSize,
            gridSize
        );
    }

    // 绘制太阳
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Arial';
    ctx.fillText(`太阳: ${sun}`, 10, 30);
}

// 更新游戏
function updateGame() {
    if (gameState === 'playing') {
        // 更新植物
        for (const plant of gameObjects.filter(obj => obj.type === 'plant')) {
            if (plant.name === 'sunflower') {
                plant.timer += deltaTime;
                if (plant.timer >= plants[plant.name].productionRate) {
                    sun += plants[plant.name].sunProduction;
                    plant.timer = 0;
                }
            }
        }

        // 更新僵尸
        for (const zombie of gameObjects.filter(obj => obj.type === 'zombie')) {
            zombie.x -= zombies[zombie.name].speed * deltaTime;
        }
    }
}

// 事件监听
canvas.addEventListener('click', handleClick);

// 点击事件处理
function handleClick(event) {
    // 获取点击位置
    const x = event.offsetX;
    const y = event.offsetY;

    // 获取点击的格子
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);

    // 检查点击的位置是否在游戏区域
    if (col >= 0 && col < numCols && row >= 0 && row < numRows) {
        // 检查点击的位置是否为空
        if (gameObjects.find(obj => obj.col === col && obj.row === row) === undefined) {
            // 选择要种植的植物
            if (gameState === 'start') {
                gameState = 'playing';
            } else if (gameState === 'playing') {
                // 打开植物选择界面
                openPlantMenu(col, row);
            }
        }
    }
}

// 打开植物选择界面
function openPlantMenu(col, row) {
    // TODO: 实现植物选择界面
}

// 主循环
function gameLoop() {
    // 计算时间差
    const now = Date.now();
    deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    // 更新游戏
    updateGame();

    // 绘制游戏
    drawGame();

    // 循环调用
    requestAnimationFrame(gameLoop);
}

// 初始化游戏
initGame();

// 开始游戏循环
let lastTime = Date.now();
gameLoop();