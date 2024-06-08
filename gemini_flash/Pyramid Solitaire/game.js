const deck = [];
const pyramid = [];
const drawPile = [];
const discardPile = [];

const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const gameBoard = document.getElementById("game-board");
const drawPileEl = document.getElementById("draw-pile");
const discardPileEl = document.getElementById("discard-pile");
const newGameBtn = document.getElementById("new-game");

// 初始化游戏
function initGame() {
  // 创建一副牌
  createDeck();
  // 洗牌
  shuffleDeck();
  // 初始化金字塔
  initPyramid();
  // 初始化抽牌堆
  initDrawPile();
  // 渲染游戏界面
  renderGame();
}

// 创建一副牌
function createDeck() {
  deck.length = 0;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
}

// 洗牌
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// 初始化金字塔
function initPyramid() {
  pyramid.length = 0;
  let row = 1;
  let count = 1;
  while (count <= 28) {
    let cardsInRow = row;
    for (let i = 0; i < cardsInRow; i++) {
      pyramid.push(deck.pop());
      count++;
    }
    row++;
  }
}

// 初始化抽牌堆
function initDrawPile() {
  drawPile.length = 0;
  drawPile.push(...deck);
}

// 渲染游戏界面
function renderGame() {
  // 清空游戏面板
  gameBoard.innerHTML = "";
  // 渲染金字塔
  renderPyramid();
  // 渲染抽牌堆
  renderDrawPile();
  // 渲染弃牌堆
  renderDiscardPile();
}

// 渲染金字塔
function renderPyramid() {
  let row = 1;
  let count = 0;
  while (count < 28) {
    let cardsInRow = row;
    let cardWidth = 100 / cardsInRow;
    let leftOffset = (100 - cardWidth * cardsInRow) / 2;
    let cardTop = 20 * row;
    for (let i = 0; i < cardsInRow; i++) {
      let card = pyramid[count];
      let cardEl = document.createElement("div");
      cardEl.classList.add("card");
      cardEl.style.width = `${cardWidth}%`;
      cardEl.style.left = `${leftOffset + cardWidth * i}%`;
      cardEl.style.top = `${cardTop}px`;
      cardEl.textContent = `${card.rank}${card.suit}`;
      cardEl.dataset.cardIndex = count;
      gameBoard.appendChild(cardEl);
      count++;
    }
    row++;
  }
}

// 渲染抽牌堆
function renderDrawPile() {
  drawPileEl.innerHTML = "";
  let cardEl = document.createElement("div");
  cardEl.classList.add("card");
  cardEl.textContent = "抽牌";
  drawPileEl.appendChild(cardEl);
}

// 渲染弃牌堆
function renderDiscardPile() {
  discardPileEl.innerHTML = "";
  if (discardPile.length > 0) {
    let card = discardPile[discardPile.length - 1];
    let cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.textContent = `${card.rank}${card.suit}`;
    discardPileEl.appendChild(cardEl);
  }
}

// 抽牌
function drawCard() {
  if (drawPile.length > 0) {
    let card = drawPile.pop();
    discardPile.push(card);
    renderDiscardPile();
  }
}

// 点击抽牌堆
drawPileEl.addEventListener("click", drawCard);

// 点击新游戏按钮
newGameBtn.addEventListener("click", initGame);

// 初始化游戏
initGame();