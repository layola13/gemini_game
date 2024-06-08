const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 游戏设置
const canvasWidth = 800;
const canvasHeight = 600;
const playerSpeed = 5;
const enemySpeed = 2;
const bulletSpeed = 10;
const enemySpawnInterval = 2000; // 毫秒

// 游戏对象
let player = {
    x: canvasWidth / 2,
    y: canvasHeight - 50,
    width: 30,
    height: 30,
    color: "blue"
};

let enemies = [];
let bullets = [];

// 初始化游戏
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 玩家移动事件
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            player.x -= playerSpeed;
            break;
        case "ArrowRight":
            player.x += playerSpeed;
            break;
        case "ArrowUp":
            player.y -= playerSpeed;
            break;
        case "ArrowDown":
            player.y += playerSpeed;
            break;
    }
});

// 射击事件
document.addEventListener("click", () => {
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        radius: 5,
        color: "red",
        speed: bulletSpeed
    });
});

// 生成敌人
let lastEnemySpawn = Date.now();
setInterval(() => {
    if (Date.now() - lastEnemySpawn > enemySpawnInterval) {
        enemies.push({
            x: Math.random() * canvasWidth,
            y: 0,
            width: 20,
            height: 20,
            color: "green"
        });
        lastEnemySpawn = Date.now();
    }
}, 10);

// 游戏循环
function gameLoop() {
    // 清理画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 绘制敌人
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;

        // 检查碰撞
        if (collision(player, enemy)) {
            // 游戏结束
            alert("游戏结束！");
            return;
        }
    }

    // 绘制子弹
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        bullet.y -= bullet.speed;

        // 检查子弹是否超出画布
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        } else {
            // 检查子弹与敌人碰撞
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                if (collision(bullet, enemy)) {
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                    i--;
                    j--;
                    break;
                }
            }
        }
    }

    // 循环调用自身
    requestAnimationFrame(gameLoop);
}

// 碰撞检测函数
function collision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// 开始游戏循环
gameLoop();