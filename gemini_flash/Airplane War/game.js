const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameRunning = false;
let score = 0;

// 玩家飞机
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    img: new Image()
};
player.img.src = 'player.png';

// 子弹
let bullets = [];
const bulletSpeed = 10;

// 敌机
let enemies = [];
const enemySpeed = 2;
const enemyInterval = 1000; // 敌机生成间隔

// 音效
const shootSound = new Audio('shoot.mp3');
const explosionSound = new Audio('explosion.mp3');

// 初始化游戏
function init() {
    gameRunning = true;
    score = 0;
    bullets = [];
    enemies = [];
    requestAnimationFrame(gameLoop);
}

// 游戏循环
function gameLoop() {
    if (gameRunning) {
        // 清理画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新玩家
        updatePlayer();
        drawPlayer();

        // 更新子弹
        updateBullets();
        drawBullets();

        // 生成敌机
        generateEnemies();
        // 更新敌机
        updateEnemies();
        drawEnemies();

        // 检测碰撞
        checkCollisions();

        // 更新分数
        drawScore();

        requestAnimationFrame(gameLoop);
    }
}

// 更新玩家位置
function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
}

// 绘制玩家飞机
function drawPlayer() {
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
}

// 射击
function shoot() {
    shootSound.play();
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        radius: 5,
        color: 'yellow'
    });
}

// 更新子弹位置
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// 绘制子弹
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
}

// 生成敌机
function generateEnemies() {
    if (enemies.length < 5) {
        const enemy = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: enemySpeed,
            img: new Image()
        };
        enemy.img.src = 'enemy.png';
        enemies.push(enemy);
    }
}

// 更新敌机位置
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

// 绘制敌机
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// 检测碰撞
function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        // 检查敌机是否与玩家碰撞
        if (checkCollision(player, enemy)) {
            explosionSound.play();
            gameOver();
        }

        // 检查子弹是否击中敌机
        for (let j = 0; j < bullets.length; j++) {
            const bullet = bullets[j];
            if (checkCollision(bullet, enemy)) {
                explosionSound.play();
                bullets.splice(j, 1);
                j--;
                enemies.splice(i, 1);
                i--;
                score++;
                break;
            }
        }
    }
}

// 碰撞检测函数
function checkCollision(obj1, obj2) {
    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y);
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    alert('游戏结束！你的分数是：' + score);
}

// 绘制分数
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('分数：' + score, 10, 30);
}

// 键盘事件监听
const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
    if (event.code === 'Space') {
        shoot();
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// 开始游戏
init();