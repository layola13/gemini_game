const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let boat = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  speed: 0,
  maxSpeed: 5,
  acceleration: 0.2,
  deceleration: 0.1
};

let isKeyDown = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    isKeyDown = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') {
    isKeyDown = false;
  }
});

function update() {
  if (isKeyDown) {
    boat.speed += boat.acceleration;
    if (boat.speed > boat.maxSpeed) {
      boat.speed = boat.maxSpeed;
    }
  } else {
    boat.speed -= boat.deceleration;
    if (boat.speed < 0) {
      boat.speed = 0;
    }
  }

  boat.x += boat.speed;

  // 限制船只在画布内
  if (boat.x < 0) {
    boat.x = 0;
  } else if (boat.x > canvas.width - boat.width) {
    boat.x = canvas.width - boat.width;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制船只
  ctx.fillStyle = 'brown';
  ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();