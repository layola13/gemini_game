// 初始化牌组
const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
for (let suit of suits) {
  for (let rank of ranks) {
    deck.push({ suit: suit, rank: rank });
  }
}

// 洗牌
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// 创建游戏区域
const tableau = document.getElementById("tableau");
const foundation = document.getElementById("foundation");
const freeCells = document.getElementById("free-cells");
const deckContainer = document.getElementById("deck");

// 初始化游戏区域
function initializeGame() {
  shuffleDeck();
  // 初始化 tableau
  for (let i = 0; i < 8; i++) {
    const column = document.createElement("div");
    column.classList.add("tableau-column");
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      const cardElement = createCardElement(card);
      if (j === i) {
        cardElement.classList.add("face-up");
      }
      column.appendChild(cardElement);
    }
    tableau.appendChild(column);
  }
  // 初始化 foundation
  for (let i = 0; i < 4; i++) {
    const foundationColumn = document.createElement("div");
    foundationColumn.classList.add("foundation-column");
    foundation.appendChild(foundationColumn);
  }
  // 初始化 free cells
  for (let i = 0; i < 4; i++) {
    const freeCell = document.createElement("div");
    freeCell.classList.add("free-cell");
    freeCells.appendChild(freeCell);
  }
  // 初始化 deck
  deckContainer.classList.add("deck");
  deckContainer.addEventListener("click", dealCard);
}

// 创建卡片元素
function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.classList.add(card.suit);
  cardElement.textContent = card.rank;
  cardElement.dataset.suit = card.suit;
  cardElement.dataset.rank = card.rank;
  return cardElement;
}

// 发牌
function dealCard() {
  if (deck.length > 0) {
    const card = deck.pop();
    const cardElement = createCardElement(card);
    cardElement.classList.add("face-up");
    tableau.children[tableau.children.length - 1].appendChild(cardElement);
  }
}

// 处理卡片点击事件
function handleCardClick(event) {
  const cardElement = event.target;
  // 处理卡片移动逻辑
  // ...
}

// 初始化游戏
initializeGame();