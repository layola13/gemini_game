const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 游戏设置
const gridSize = 50; // 格子大小
const mapWidth = 20; // 地图宽度（格子数）
const mapHeight = 15; // 地图高度（格子数）
const waveInterval = 3000; // 敌人波次间隔（毫秒）
const enemySpeed = 2; // 敌人速度

// 敌人数据
const enemies = [];
const enemyTypes = [
    {
        health: 10,
        speed: enemySpeed,
        image: "path/to/enemy1.png" // 替换为实际图片路径
    },
    {
        health: 20,
        speed: enemySpeed * 0.8,
        image: "path/to/enemy2.png" // 替换为实际图片路径
    }
];

// 塔数据
const towers = [];
const towerTypes = [
    {
        cost: 100,
        range: 100,
        damage: 10,
        image: "path/to/tower1.png" // 替换为实际图片路径
    },
    {
        cost: 200,
        range: 150,
        damage: 20,
        image: "path/to/tower2.png" // 替换为实际图片路径
    }
];

// 游戏状态
let gameStarted = false;
let money = 100;
let currentWave = 1;
let enemiesRemaining = 0;

// 地图路径
const path = [
    { x: 0, y: 7 },
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 },
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 9, y: 7 },
    { x: 10, y: 7 },
    { x: 11, y: 7 },
    { x: 12, y: 7 },
    { x: 13, y: 7 },
    { x: 14, y: 7 },
    { x: 15, y: 7 },
    { x: 16, y: 7 },
    { x: 17, y: 7 },
    { x: 18, y: 7 },
    { x: 19, y: 7 },
    { x: 19, y: 6 },
    { x: 19, y: 5 },
    { x: 19, y: 4 },
    { x: 19, y: 3 },
    { x: 19, y: 2 },
    { x: 19, y: 1 },
    { x: 19, y: 0 }
];

// 初始化游戏
function init() {
    canvas.width = mapWidth * gridSize;
    canvas.height = mapHeight * gridSize;

    // 开始游戏
    startGame();
}

// 开始游戏
function startGame() {
    gameStarted = true;
    requestAnimationFrame(gameLoop);
}

// 游戏循环
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制地图
    drawMap();

    // 更新敌人
    updateEnemies();

    // 更新塔
    updateTowers();

    // 检查游戏结束
    checkGameOver();

    requestAnimationFrame(gameLoop);
}

// 绘制地图
function drawMap() {
    ctx.fillStyle = "#000"; // 地图颜色
    for (let i = 0; i < mapWidth; i++) {
        for (let j = 0; j < mapHeight; j++) {
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }

    // 绘制路径
    ctx.fillStyle = "#fff"; // 路径颜色
    for (let i = 0; i < path.length; i++) {
        ctx.fillRect(path[i].x * gridSize, path[i].y * gridSize, gridSize, gridSize);
    }
}

// 更新敌人
function updateEnemies() {
    enemiesRemaining = enemies.length;
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
        if (enemy.health <= 0) {
            enemies.splice(i, 1);
            money += 10; // 击杀敌人获得金钱
        }
    }
}

// 更新塔
function updateTowers() {
    for (let i = 0; i < towers.length; i++) {
        const tower = towers[i];
        tower.update();
    }
}

// 检查游戏结束
function checkGameOver() {
    if (enemiesRemaining === 0 && currentWave < 5) {
        // 下一波敌人
        currentWave++;
        generateEnemies();
    } else if (enemiesRemaining > 0) {
        // 游戏结束，失败
        alert("游戏结束，失败!");
    } else {
        // 游戏结束，胜利
        alert("游戏结束，胜利!");
    }
}

// 生成敌人
function generateEnemies() {
    setTimeout(() => {
        for (let i = 0; i < currentWave; i++) {
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const enemy = new Enemy(enemyType);
            enemies.push(enemy);
        }
    }, waveInterval);
}

// 敌人类
class Enemy {
    constructor(type) {
        this.type = type;
        this.health = type.health;
        this.speed = type.speed;
        this.x = 0;
        this.y = 7; // 初始位置
        this.targetIndex = 0;
        this.image = new Image();
        this.image.src = type.image;
    }

    update() {
        // 移动敌人
        const target = path[this.targetIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
        } else {
            this.targetIndex++;
            if (this.targetIndex >= path.length) {
                // 敌人到达终点
                this.health = 0;
            }
        }

        // 绘制敌人
        ctx.drawImage(this.image, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
    }
}

// 塔类
class Tower {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.range = type.range;
        this.damage = type.damage;
        this.image = new Image();
        this.image.src = type.image;
    }

    update() {
        // 攻击敌人
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const distance = Math.sqrt(Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2));
            if (distance <= this.range) {
                enemy.health -= this.damage;
                break;
            }
        }

        // 绘制塔
        ctx.drawImage(this.image, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
    }
}

// 事件监听
canvas.addEventListener("click", (event) => {
    if (!gameStarted) {
        return;
    }

    const gridX = Math.floor(event.offsetX / gridSize);
    const gridY = Math.floor(event.offsetY / gridSize);

    // 检查是否可以建造塔
    if (canBuildTower(gridX, gridY)) {
        // 选择塔类型
        const towerType = towerTypes[0]; // 默认选择第一个塔类型
        if (money >= towerType.cost) {
            money -= towerType.cost;
            const tower = new Tower(towerType, gridX, gridY);
            towers.push(tower);
        } else {
            alert("资金不足!");
        }
    }
});

// 检查是否可以建造塔
function canBuildTower(x, y) {
    // 检查是否在路径上
    for (let i = 0; i < path.length; i++) {
        if (path[i].x === x && path[i].y === y) {
            return false;
        }
    }

    // 检查是否已经有塔
    for (let i = 0; i < towers.length; i++) {
        if (towers[i].x === x && towers[i].y === y) {
            return false;
        }
    }

    return true;
}

// 初始化游戏
init();