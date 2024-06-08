const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 20,
    color: 'blue',
    speed: 5
};

let monsters = [];
let score = 0;

function createMonster() {
    let x = Math.random() * (canvas.width - 50) + 25;
    let y = Math.random() * (canvas.height - 50) + 25;
    let radius = Math.random() * 20 + 10;
    let color = getRandomColor();
    monsters.push({ x, y, radius, color });
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
}

function drawMonsters() {
    monsters.forEach(monster => {
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.fillStyle = monster.color;
        ctx.fill();
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.01) {
        createMonster();
    }

    drawPlayer();
    drawMonsters();

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
    }
});

update();