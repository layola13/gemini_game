const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let stickman = {
    x: 100,
    y: 400,
    width: 20,
    height: 60,
    color: 'black',
    speed: 5,
    isJumping: false,
    jumpHeight: 15,
    jumpVelocity: 0
};

function drawStickman() {
    ctx.fillStyle = stickman.color;
    ctx.fillRect(stickman.x, stickman.y, stickman.width, stickman.height);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (stickman.isJumping) {
        stickman.y -= stickman.jumpVelocity;
        stickman.jumpVelocity -= 0.5;

        if (stickman.y + stickman.height >= 400) {
            stickman.isJumping = false;
            stickman.y = 400 - stickman.height;
            stickman.jumpVelocity = 0;
        }
    }

    drawStickman();

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        stickman.x -= stickman.speed;
    } else if (event.key === 'ArrowRight') {
        stickman.x += stickman.speed;
    } else if (event.key === 'ArrowUp' && !stickman.isJumping) {
        stickman.isJumping = true;
        stickman.jumpVelocity = stickman.jumpHeight;
    }
});

update();