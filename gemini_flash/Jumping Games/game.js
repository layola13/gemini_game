const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 设置画布大小
canvas.width = 800;
canvas.height = 600;

// 玩家对象
const player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    velocityY: 0,
    isJumping: false
};

// 重力
const gravity = 0.5;

// 跳跃速度
const jumpSpeed = 10;

// 更新游戏逻辑
function update() {
    // 应用重力
    player.velocityY += gravity;

    // 更新玩家位置
    player.y += player.velocityY;

    // 检查是否触地
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // 渲染游戏
    render();
}

// 渲染游戏画面
function render() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 处理键盘事件
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !player.isJumping) {
        player.velocityY = -jumpSpeed;
        player.isJumping = true;
    }
});

// 游戏循环
setInterval(update, 10);