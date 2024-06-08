const board = document.getElementById("game-board");
const restartButton = document.getElementById("restart-button");

// 游戏参数
const boardSize = 8; // 游戏面板大小
const imagePaths = [
    "image1.png",
    "image2.png",
    "image3.png",
    "image4.png",
    "image5.png",
    "image6.png",
    "image7.png",
    "image8.png",
]; // 图片路径数组

// 初始化游戏数据
let gameData = [];
let selectedCard = null;
let score = 0;

// 生成游戏数据
function generateGameData() {
    const imagePool = [...imagePaths];
    for (let i = 0; i < boardSize * boardSize / 2; i++) {
        const randomIndex = Math.floor(Math.random() * imagePool.length);
        gameData.push(imagePool[randomIndex]);
        gameData.push(imagePool[randomIndex]);
        imagePool.splice(randomIndex, 1);
    }
    shuffle(gameData);
}

// 打乱数组
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 创建游戏面板
function createGameBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = i;
        card.dataset.image = gameData[i];
        card.style.backgroundImage = `url(${gameData[i]})`;
        card.addEventListener("click", handleCardClick);
        board.appendChild(card);
    }
}

// 处理卡片点击事件
function handleCardClick(event) {
    const card = event.target;
    if (card === selectedCard || card.classList.contains("matched")) {
        return;
    }
    if (selectedCard === null) {
        // 第一次点击
        selectedCard = card;
        selectedCard.classList.add("selected");
    } else {
        // 第二次点击
        if (selectedCard.dataset.image === card.dataset.image) {
            // 两张卡匹配
            selectedCard.classList.add("matched");
            card.classList.add("matched");
            selectedCard = null;
            score += 10;
            updateScore();
            checkGameOver();
        } else {
            // 两张卡不匹配
            setTimeout(() => {
                selectedCard.classList.remove("selected");
                card.classList.remove("selected");
                selectedCard = null;
            }, 500);
        }
    }
}

// 更新分数
function updateScore() {
    // TODO: 实现分数显示
}

// 检查游戏是否结束
function checkGameOver() {
    if (document.querySelectorAll(".card.matched").length === boardSize * boardSize) {
        // 游戏结束
        alert("恭喜你，游戏胜利！");
        // TODO: 实现游戏结束提示
    }
}

// 重新开始游戏
function restartGame() {
    gameData = [];
    selectedCard = null;
    score = 0;
    board.innerHTML = ""; // 清空游戏面板
    generateGameData();
    createGameBoard();
    updateScore(); // 更新分数显示
}

// 初始化游戏
generateGameData();
createGameBoard();
restartButton.addEventListener("click", restartGame);