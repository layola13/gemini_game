const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 跳绳对象
let rope = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    length: 100,
    angle: 0,
    speed: 0.1,
};

// 玩家对象
let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    radius: 20,
    jumpHeight: 50,
    isJumping: false,
    jumpSpeed: 10,
};

// 游戏状态
let score = 0;
let gameOver = false;

// 更新游戏逻辑
function update() {
    // 更新跳绳角度
    rope.angle += rope.speed;

    // 更新玩家位置
    if (player.isJumping) {
        player.y -= player.jumpSpeed;
        player.jumpSpeed -= 0.5;
        if (player.jumpSpeed < -10) {
            player.isJumping = false;
            player.jumpSpeed = 10;
        }
    }

    // 检测碰撞
    if (checkCollision()) {
        gameOver = true;
    } else {
        score++;
    }

    // 重绘画布
    draw();
}

// 绘制游戏场景
function draw() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制跳绳
    ctx.beginPath();
    ctx.moveTo(rope.x - rope.length * Math.cos(rope.angle), rope.y - rope.length * Math.sin(rope.angle));
    ctx.lineTo(rope.x + rope.length * Math.cos(rope.angle), rope.y + rope.length * Math.sin(rope.angle));
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();

    // 绘制玩家
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // 显示分数
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 40);

    // 游戏结束提示
    if (gameOver) {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over!', canvas.width / 2 - 150, canvas.height / 2);
    }
}

// 检测碰撞
function checkCollision() {
    // 计算跳绳顶部的 y 坐标
    let ropeTop = rope.y - rope.length * Math.sin(rope.angle);

    // 检查玩家是否与跳绳顶部碰撞
    if (player.y - player.radius < ropeTop && player.x > rope.x - rope.length && player.x < rope.x + rope.length) {
        return true;
    }

    return false;
}

// 监听键盘事件
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !player.isJumping && !gameOver) {
        player.isJumping = true;
    }
});

// 游戏循环
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();