const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const timer = document.getElementById('timer');
const movesCounter = document.getElementById('moves');

let cards = [];
let flippedCards = [];
let startTime;
let moves = 0;

// 设置卡片图片
const cardImages = [
    'img/card1.png',
    'img/card2.png',
    'img/card3.png',
    'img/card4.png',
    'img/card5.png',
    'img/card6.png',
    'img/card7.png',
    'img/card8.png'
];

// 初始化游戏
function initGame() {
    cards = [];
    flippedCards = [];
    moves = 0;
    movesCounter.textContent = `步数：${moves} 步`;
    resetTimer();

    // 创建游戏板
    createGameBoard();

    // 添加点击事件
    const cardsElements = document.querySelectorAll('.card');
    cardsElements.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

    // 显示开始按钮
    startButton.style.display = 'block';
}

// 创建游戏板
function createGameBoard() {
    gameBoard.innerHTML = ''; // 清空游戏板

    // 复制图片数组，并随机排序
    const shuffledImages = [...cardImages].sort(() => 0.5 - Math.random());

    // 生成卡片
    for (let i = 0; i < shuffledImages.length * 2; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = shuffledImages[i % shuffledImages.length];
        gameBoard.appendChild(card);
        cards.push(card);
    }
}

// 处理卡片点击
function handleCardClick(event) {
    const clickedCard = event.target;
    
    // 检查是否已经翻转
    if (flippedCards.includes(clickedCard) || clickedCard.classList.contains('matched')) return;

    // 翻转卡片
    flipCard(clickedCard);

    // 检查是否匹配
    if (flippedCards.length === 2) {
        setTimeout(() => {
            checkMatch();
        }, 500);
    }
}

// 翻转卡片
function flipCard(card) {
    card.classList.add('flipped');
    flippedCards.push(card);
    moves++;
    movesCounter.textContent = `步数：${moves} 步`;
}

// 检查是否匹配
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        // 匹配成功
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];

        // 检查游戏是否结束
        if (document.querySelectorAll('.matched').length === cards.length) {
            setTimeout(() => {
                alert(`恭喜你，你赢了！用时 ${formatTime(getElapsedTime())} 秒，${moves} 步`);
                initGame();
            }, 500);
        }
    } else {
        // 匹配失败
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// 开始游戏
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    startTime = Date.now();
    startTimer();
    initGame();
});

// 开始计时器
function startTimer() {
    setInterval(() => {
        timer.textContent = `时间：${formatTime(getElapsedTime())} 秒`;
    }, 1000);
}

// 获取已用时间
function getElapsedTime() {
    return (Date.now() - startTime) / 1000;
}

// 格式化时间
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    timer.textContent = '时间：0 秒';
}

// 初始化游戏
initGame();