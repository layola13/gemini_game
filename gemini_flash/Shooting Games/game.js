const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const canvasWidth = 800;
const canvasHeight = 600;
const playerSpeed = 5;
const bulletSpeed = 10;

// 玩家
let player = {
    x: canvasWidth / 2,
    y: canvasHeight - 50,
    width: 50,
    height: 50,
    color: 'blue'
};

// 子弹
let bullets = [];

// 敌人
let enemies = [];

// 初始化游戏
function init() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    createEnemies();
}

// 创建敌人
function createEnemies() {
    for (let i = 0; i < 10; i++) {
        enemies.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight / 2,
            width: 30,
            height: 30,
            color: 'red'
        });
    }
}

// 绘制玩家
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 绘制子弹
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // 子弹移动
        bullet.y -= bulletSpeed;

        // 检查子弹是否超出画布
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// 绘制敌人
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // 检查子弹与敌人碰撞
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });
}

// 更新游戏
function update() {
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制游戏元素
    drawPlayer();
    drawBullets();
    drawEnemies();

    // 玩家移动
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= playerSpeed;
    }
    if (keys.ArrowRight && player.x < canvasWidth - player.width) {
        player.x += playerSpeed;
    }

    // 键盘事件
    if (keys.Space) {
        // 发射子弹
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 10
        });
    }

    // 循环更新游戏
    requestAnimationFrame(update);
}

// 键盘按键状态
let keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// 初始化游戏
init();
update();