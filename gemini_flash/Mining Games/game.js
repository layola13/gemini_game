const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const oreCountElement = document.getElementById('oreCount');
const pickaxeLevelElement = document.getElementById('pickaxeLevel');
const upgradePickaxeButton = document.getElementById('upgradePickaxe');

let oreCount = 0;
let pickaxeLevel = 1;

// 矿石对象
class Ore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// 矿石数组
const ores = [];

// 生成随机矿石
function generateOres() {
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * (canvas.width - 20);
    const y = Math.random() * (canvas.height - 20);
    ores.push(new Ore(x, y));
  }
}

// 点击事件
canvas.addEventListener('click', (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  for (let i = 0; i < ores.length; i++) {
    const ore = ores[i];
    if (mouseX >= ore.x && mouseX <= ore.x + ore.width &&
        mouseY >= ore.y && mouseY <= ore.y + ore.height) {
      ores.splice(i, 1);
      oreCount++;
      oreCountElement.textContent = oreCount;
      break;
    }
  }
});

// 升级镐
upgradePickaxeButton.addEventListener('click', () => {
  pickaxeLevel++;
  pickaxeLevelElement.textContent = pickaxeLevel;
  // 可选: 添加升级镐的价格
});

// 游戏循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制矿石
  ores.forEach(ore => ore.draw());

  requestAnimationFrame(gameLoop);
}

// 初始化游戏
generateOres();
gameLoop();