const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const canvasWidth = 800;
const canvasHeight = 600;
const gravity = 0.1;
const jumpForce = 10;
const speed = 5;

// 初始化画布尺寸
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 玩家对象
let player = {
    x: 50,
    y: canvasHeight - 100,
    width: 20,
    height: 40,
    velocityY: 0,
    isJumping: false
};

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 更新玩家位置
    player.velocityY += gravity;
    player.y += player.velocityY;

    // 检查玩家是否接触地面
    if (player.y + player.height >= canvasHeight) {
        player.y = canvasHeight - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // 绘制玩家
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !player.isJumping) {
            player.velocityY = -jumpForce;
            player.isJumping = true;
        }
    });

    // 循环调用 gameLoop 函数
    requestAnimationFrame(gameLoop);
}

// 开始游戏循环
gameLoop();