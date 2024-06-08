const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gameWidth = 800;
const gameHeight = 600;
const targetSpeed = 100; // 目标移动速度
const bulletSpeed = 500; // 子弹速度
const scoreMultiplier = 10; // 得分倍数

// 初始化游戏状态
let score = 0;
let gameRunning = false;
let target = {
    x: Math.random() * gameWidth,
    y: Math.random() * gameHeight,
    width: 50,
    height: 50,
    dx: (Math.random() - 0.5) * targetSpeed,
    dy: (Math.random() - 0.5) * targetSpeed
};
let bullet = {
    x: 0,
    y: 0,
    radius: 5,
    speed: bulletSpeed,
    active: false
};

// 初始化画布尺寸
canvas.width = gameWidth;
canvas.height = gameHeight;

// 监听鼠标点击事件
canvas.addEventListener('click', (event) => {
    if (gameRunning) {
        // 设置子弹起点
        bullet.x = event.offsetX;
        bullet.y = event.offsetY;
        bullet.active = true;
    }
});

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // 更新目标位置
    target.x += target.dx;
    target.y += target.dy;

    // 检查目标是否超出边界
    if (target.x < 0 || target.x + target.width > gameWidth) {
        target.dx = -target.dx;
    }
    if (target.y < 0 || target.y + target.height > gameHeight) {
        target.dy = -target.dy;
    }

    // 更新子弹位置
    if (bullet.active) {
        let angle = Math.atan2(target.y - bullet.y, target.x - bullet.x);
        bullet.x += bullet.speed * Math.cos(angle);
        bullet.y += bullet.speed * Math.sin(angle);

        // 检查子弹是否击中目标
        if (bullet.x >= target.x && bullet.x <= target.x + target.width &&
            bullet.y >= target.y && bullet.y <= target.y + target.height) {
            score += scoreMultiplier;
            bullet.active = false;
            resetTarget();
        }

        // 检查子弹是否超出边界
        if (bullet.x < 0 || bullet.x > gameWidth || bullet.y < 0 || bullet.y > gameHeight) {
            bullet.active = false;
        }
    }

    // 绘制目标
    ctx.fillStyle = 'red';
    ctx.fillRect(target.x, target.y, target.width, target.height);

    // 绘制子弹
    if (bullet.active) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // 显示分数
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`分数: ${score}`, 10, 30);

    // 循环执行
    requestAnimationFrame(gameLoop);
}

// 重置目标位置
function resetTarget() {
    target.x = Math.random() * gameWidth;
    target.y = Math.random() * gameHeight;
    target.dx = (Math.random() - 0.5) * targetSpeed;
    target.dy = (Math.random() - 0.5) * targetSpeed;
}

// 开始游戏
function startGame() {
    gameRunning = true;
    resetTarget();
    gameLoop();
}

// 初始化游戏
startGame();