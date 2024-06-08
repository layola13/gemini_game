const board = document.querySelector('.game-board');
const startButton = document.querySelector('.start-button');
const scoreDisplay = document.querySelector('.score');
let score = 0;
let moles = [];
let timer;

// 生成地鼠洞
const createMoleHole = () => {
  const hole = document.createElement('div');
  hole.classList.add('hole');
  board.appendChild(hole);
  return hole;
};

// 创建地鼠
const createMole = () => {
  const mole = document.createElement('div');
  mole.classList.add('mole');
  mole.addEventListener('click', handleMoleClick);
  return mole;
};

// 处理点击地鼠事件
const handleMoleClick = (event) => {
  event.target.remove();
  score++;
  scoreDisplay.textContent = `得分: ${score}`;
};

// 随机选择一个地鼠洞
const getRandomHole = () => {
  const randomIndex = Math.floor(Math.random() * moles.length);
  return moles[randomIndex];
};

// 随机出现地鼠
const spawnMole = () => {
  const randomHole = getRandomHole();
  const mole = createMole();
  randomHole.appendChild(mole);
  setTimeout(() => {
    mole.remove();
  }, 1000);
};

// 开始游戏
const startGame = () => {
  moles = [];
  for (let i = 0; i < 9; i++) {
    moles.push(createMoleHole());
  }
  timer = setInterval(spawnMole, 1500);
  startButton.disabled = true;
};

// 结束游戏
const endGame = () => {
  clearInterval(timer);
  startButton.disabled = false;
  alert(`游戏结束！您的得分是: ${score}`);
};

// 初始化游戏
startButton.addEventListener('click', startGame);