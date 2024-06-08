class FlipGame {
  constructor(size, cardTypes) {
    this.size = size;
    this.cardTypes = cardTypes;
    this.board = this.createBoard();
    this.score = 0;
    this.flippedCards = [];
    this.matchedCards = [];
    this.gameStarted = false;

    this.gameBoardElement = document.querySelector('.game-board');
    this.startButton = document.querySelector('.start-button');
    this.scoreElement = document.getElementById('score');

    this.startButton.addEventListener('click', this.startGame.bind(this));
  }

  createBoard() {
    const board = [];
    const cardPairs = this.cardTypes.length;
    const totalCards = this.size * this.size;
    const cardTypesNeeded = Math.ceil(totalCards / cardPairs);

    // 随机选择卡片类型
    const selectedCardTypes = this.shuffleArray(this.cardTypes).slice(0, cardTypesNeeded);

    // 填充棋盘
    for (let i = 0; i < totalCards; i++) {
      board.push(selectedCardTypes[i % cardTypesNeeded]);
    }

    // 随机打乱卡片顺序
    return this.shuffleArray(board);
  }

  startGame() {
    this.gameStarted = true;
    this.score = 0;
    this.flippedCards = [];
    this.matchedCards = [];
    this.scoreElement.textContent = this.score;
    this.renderBoard();
    this.startButton.disabled = true;
  }

  renderBoard() {
    this.gameBoardElement.innerHTML = '';
    this.board.forEach((cardType, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.cardType = cardType;
      cardElement.dataset.cardIndex = index;
      cardElement.addEventListener('click', this.handleCardClick.bind(this));
      this.gameBoardElement.appendChild(cardElement);
    });
  }

  handleCardClick(event) {
    if (!this.gameStarted || this.flippedCards.length >= 2 || this.matchedCards.includes(parseInt(event.target.dataset.cardIndex))) {
      return;
    }

    const cardIndex = parseInt(event.target.dataset.cardIndex);
    event.target.classList.add('flipped');
    this.flippedCards.push(cardIndex);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const card1 = this.board[this.flippedCards[0]];
    const card2 = this.board[this.flippedCards[1]];

    if (card1 === card2) {
      this.matchedCards.push(...this.flippedCards);
      this.score += 2;
      this.scoreElement.textContent = this.score;

      // 检查游戏是否结束
      if (this.matchedCards.length === this.board.length) {
        this.gameStarted = false;
        alert(`恭喜你！你赢了！最终分数: ${this.score}`);
        this.startButton.disabled = false;
      }
    } else {
      setTimeout(() => {
        const card1Element = document.querySelector(`div[data-card-index="${this.flippedCards[0]}"]`);
        const card2Element = document.querySelector(`div[data-card-index="${this.flippedCards[1]}"]`);
        card1Element.classList.remove('flipped');
        card2Element.classList.remove('flipped');
        this.flippedCards = [];
      }, 1000);
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

const game = new FlipGame(4, ['🍎', '🍌', '🍒', '🍇', '🍓', '🍉']);