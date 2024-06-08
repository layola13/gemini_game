const puzzleContainer = document.getElementById("puzzle-container");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const timerDisplay = document.getElementById("timer");

let puzzleImage = null;
let puzzlePieces = [];
let puzzleSize = 4; // 默认拼图尺寸
let startTime = null;
let timerInterval = null;

// 加载图片
function loadPuzzleImage(imageUrl) {
    puzzleImage = new Image();
    puzzleImage.src = imageUrl;
    puzzleImage.onload = startGame;
}

// 开始游戏
function startGame() {
    startButton.disabled = true;
    resetButton.disabled = false;
    startTime = Date.now();
    startTimer();
    createPuzzle();
}

// 重玩游戏
function resetGame() {
    clearInterval(timerInterval);
    puzzleContainer.innerHTML = "";
    puzzlePieces = [];
    startGame();
}

// 创建拼图
function createPuzzle() {
    const pieceWidth = puzzleImage.width / puzzleSize;
    const pieceHeight = puzzleImage.height / puzzleSize;

    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.backgroundImage = `url(${puzzleImage.src})`;
        piece.style.backgroundPosition = `-${(i % puzzleSize) * pieceWidth}px -${Math.floor(i / puzzleSize) * pieceHeight}px`;
        piece.style.left = `${(i % puzzleSize) * pieceWidth}px`;
        piece.style.top = `${Math.floor(i / puzzleSize) * pieceHeight}px`;

        piece.addEventListener("mousedown", handleMouseDown);
        puzzleContainer.appendChild(piece);
        puzzlePieces.push(piece);
    }
}

// 处理鼠标按下事件
function handleMouseDown(event) {
    const piece = event.target;
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;

    piece.classList.add("dragging");

    function handleMouseMove(event) {
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
    }

    function handleMouseUp() {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        piece.classList.remove("dragging");
        checkCompletion();
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

// 检查是否完成拼图
function checkCompletion() {
    for (let i = 0; i < puzzlePieces.length; i++) {
        const piece = puzzlePieces[i];
        if (piece.style.left !== `${(i % puzzleSize) * puzzleImage.width / puzzleSize}px` ||
            piece.style.top !== `${Math.floor(i / puzzleSize) * puzzleImage.height / puzzleSize}px`) {
            return;
        }
    }

    clearInterval(timerInterval);
    alert("恭喜你完成拼图！用时：" + formatTime(Date.now() - startTime));
    startButton.disabled = false;
    resetButton.disabled = true;
}

// 启动计时器
function startTimer() {
    timerInterval = setInterval(() => {
        timerDisplay.textContent = "时间: " + formatTime(Date.now() - startTime);
    }, 1000);
}

// 格式化时间
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// 加载图片并开始游戏
loadPuzzleImage("images/puzzle.jpg"); // 替换为你的图片地址

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);