const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const canvasWidth = 800;
const canvasHeight = 600;
const player1Color = 'red';
const player2Color = 'blue';

// 玩家对象
class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.color = color;
        this.speed = 5;
        this.isJumping = false;
        this.jumpHeight = 20;
        this.jumpVelocity = 0;
    }

    // 绘制玩家
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // 更新玩家位置
    update() {
        // 处理跳跃
        if (this.isJumping) {
            this.y -= this.jumpVelocity;
            this.jumpVelocity -= 0.5;
            if (this.y + this.height >= canvasHeight) {
                this.y = canvasHeight - this.height;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
    }
}

// 实例化玩家
const player1 = new Player(50, canvasHeight - 100, player1Color);
const player2 = new Player(canvasWidth - 100, canvasHeight - 100, player2Color);

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 更新玩家
    player1.update();
    player2.update();

    // 绘制玩家
    player1.draw();
    player2.draw();

    // 循环调用自身
    requestAnimationFrame(gameLoop);
}

// 初始化游戏
canvas.width = canvasWidth;
canvas.height = canvasHeight;
gameLoop();