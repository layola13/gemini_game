const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 50; // 格子大小
const mapWidth = 20; // 地图宽度（格子数）
const mapHeight = 15; // 地图高度（格子数）
const waveInterval = 3000; // 敌军波次间隔（毫秒）
const enemySpeed = 2; // 敌军速度

// 游戏状态
let isRunning = false; // 游戏是否运行
let waveCount = 0; // 当前波次
let money = 100; // 游戏货币
let lives = 10; // 生命值

// 地图数据
const map = [
    // 0: 可行走，1: 不可行走
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// 敌军类型
const enemyTypes = [
    {
        name: '小怪',
        health: 10,
        speed: 2,
        reward: 10
    },
    {
        name: '中怪',
        health: 20,
        speed: 1,
        reward: 20
    },
    {
        name: '大怪',
        health: 50,
        speed: 0.5,
        reward: 50
    }
];

// 塔类型
const towerTypes = [
    {
        name: '普通塔',
        cost: 50,
        range: 100,
        damage: 10
    },
    {
        name: '强力塔',
        cost: 100,
        range: 150,
        damage: 20
    }
];

// 敌军类
class Enemy {
    constructor(type) {
        this.type = type;
        this.health = type.health;
        this.speed = type.speed;
        this.x = 0;
        this.y = 0;
        this.pathIndex = 0;
        this.isDead = false;
    }

    update(deltaTime) {
        if (!this.isDead) {
            this.x += this.speed * deltaTime;
            if (this.pathIndex < path.length - 1) {
                const nextPoint = path[this.pathIndex + 1];
                if (Math.abs(this.x - nextPoint.x) < 5) {
                    this.y = nextPoint.y;
                    this.pathIndex++;
                }
            } else {
                this.isDead = true;
                lives--;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.isDead ? 'gray' : 'red';
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
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
    }

    update(deltaTime) {
        // 攻击范围内是否有敌军
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (!enemy.isDead && this.isEnemyInRange(enemy)) {
                enemy.health -= this.damage;
                if (enemy.health <= 0) {
                    enemy.isDead = true;
                    money += enemy.type.reward;
                }
                break;
            }
        }
    }

    isEnemyInRange(enemy) {
        const distance = Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2));
        return distance <= this.range;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + gridSize / 2, this.y + gridSize / 2, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

// 敌军列表
let enemies = [];

// 塔列表
let towers = [];

// 路径
let path = [];

// 初始化游戏
function init() {
    // 设置画布大小
    canvas.width = mapWidth * gridSize;
    canvas.height = mapHeight * gridSize;

    // 生成路径
    generatePath();

    // 开始游戏
    isRunning = true;
}

// 生成路径
function generatePath() {
    path = [];
    let currentX = 0;
    let currentY = 0;

    // 随机生成路径
    while (currentX < mapWidth - 1) {
        path.push({ x: currentX * gridSize, y: currentY * gridSize });
        if (Math.random() < 0.5) {
            currentX++;
        } else {
            currentY++;
        }
    }

    path.push({ x: (mapWidth - 1) * gridSize, y: currentY * gridSize });
}

// 生成敌军波次
function generateWave() {
    waveCount++;
    const waveSize = waveCount * 2;
    for (let i = 0; i < waveSize; i++) {
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = new Enemy(enemyType);
        enemies.push(enemy);
    }
}

// 更新游戏状态
function update(deltaTime) {
    if (isRunning) {
        // 更新敌军
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            enemy.update(deltaTime);
        }

        // 更新塔
        for (let i = 0; i < towers.length; i++) {
            const tower = towers[i];
            tower.update(deltaTime);
        }

        // 生成新的敌军波次
        if (enemies.length === 0 && waveCount > 0 && Date.now() - lastWaveTime > waveInterval) {
            generateWave();
            lastWaveTime = Date.now();
        }

        // 检查游戏结束
        if (lives <= 0) {
            isRunning = false;
            alert('游戏结束！');
        }
    }
}

// 绘制游戏画面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制地图
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    // 绘制路径
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
        const point = path[i];
        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    }
    ctx.stroke();

    // 绘制敌军
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.draw();
    }

    // 绘制塔
    for (let i = 0; i < towers.length; i++) {
        const tower = towers[i];
        tower.draw();
    }

    // 绘制游戏信息
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('波次: ' + waveCount, 10, 30);
    ctx.fillText('金钱: ' + money, 10, 60);
    ctx.fillText('生命: ' + lives, 10, 90);
}

// 处理鼠标点击事件
canvas.addEventListener('click', (event) => {
    if (isRunning) {
        const x = Math.floor(event.offsetX / gridSize);
        const y = Math.floor(event.offsetY / gridSize);

        // 检查是否在可建造区域
        if (map[y][x] === 0 && money >= towerTypes[0].cost) {
            const tower = new Tower(towerTypes[0], x * gridSize, y * gridSize);
            towers.push(tower);
            money -= towerTypes[0].cost;
        }
    }
});

// 主循环
let lastTime = 0;
let lastWaveTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// 初始化游戏
init();

// 开始游戏循环
requestAnimationFrame(gameLoop);