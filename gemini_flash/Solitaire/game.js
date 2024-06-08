// 初始化牌组
const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit: suit, rank: rank });
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

// 初始化游戏
const tableau = document.getElementById("tableau");
const foundation = document.getElementById("foundation");
const stock = document.getElementById("stock");
const waste = document.getElementById("waste");

function initializeGame() {
  createDeck();
  shuffleDeck();

  // 初始化tableau
  for (let i = 0; i < 7; i++) {
    let pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    for (let j = 0; j <= i; j++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.dataset.suit = deck[0].suit;
      card.dataset.rank = deck[0].rank;
      card.style.backgroundImage = `url("cards/${deck[0].suit}-${deck[0].rank}.png")`;
      if (j === i) {
        card.classList.add("face-up");
      }
      pile.appendChild(card);
      deck.shift();
    }
    tableau.appendChild(pile);
  }

  // 初始化stock
  for (let i = 0; i < 24; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.suit = deck[0].suit;
    card.dataset.rank = deck[0].rank;
    card.style.backgroundImage = `url("cards/${deck[0].suit}-${deck[0].rank}.png")`;
    stock.appendChild(card);
    deck.shift();
  }
}

// 游戏逻辑
function handleCardClick(event) {
  const card = event.target;
  const pile = card.parentElement;

  // 处理tableau的牌
  if (pile.classList.contains("tableau-pile")) {
    // 如果牌是face-down，翻开
    if (!card.classList.contains("face-up")) {
      card.classList.add("face-up");
    } else {
      // ... 处理移动牌到foundation或其他tableau
    }
  }

  // 处理foundation的牌
  if (pile.classList.contains("foundation-pile")) {
    // ... 处理移动牌到tableau
  }

  // 处理stock和waste的牌
  if (pile === stock || pile === waste) {
    // ... 处理从stock取牌到waste，或者从waste取牌到tableau
  }
}

// 初始化游戏
initializeGame();

// 添加事件监听器
tableau.addEventListener("click", handleCardClick);
foundation.addEventListener("click", handleCardClick);
stock.addEventListener("click", handleCardClick);
waste.addEventListener("click", handleCardClick);