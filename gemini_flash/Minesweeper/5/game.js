// game.js
import { GameBoard } from "./board.js";

const gameBoardElement = document.getElementById("gameBoard");
const timerElement = document.getElementById("timer");
const minesElement = document.getElementById("mines");
const resetButton = document.getElementById("resetButton");
const pauseButton = document.getElementById("pauseButton");
const difficultySelect = document.getElementById("difficulty");
const gameModal = document.getElementById("game-modal");
const closeModalButton = document.querySelector(".close-modal");

let gameBoard;
let timerInterval;
let startTime = 0;
let isPaused = false;
let isFirstGame = true;

// 初始化游戏
function initGame() {
  // 获取难度设置
  const difficulty = difficultySelect.value;
  gameBoard = new GameBoard(difficulty);
  gameBoard.render(gameBoardElement);

  // 设置炸弹数量显示
  minesElement.textContent = gameBoard.minesCount;

  // 设置重置按钮事件
  resetButton.addEventListener("click", resetGame);

  // 设置暂停按钮事件
  pauseButton.addEventListener("click", togglePause);

  // 开始游戏计时
  startTimer();

  // 首次进入游戏，显示新手引导
  if (isFirstGame) {
    showModal();
    isFirstGame = false;
  }
}

// 重置游戏
function resetGame() {
  clearInterval(timerInterval);
  timerElement.textContent = "0";
  startTime = 0;
  isPaused = false;
  gameBoard.reset();
  gameBoard.render(gameBoardElement);
}

// 开始计时
function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      startTime++;
      timerElement.textContent = startTime;
    }
  }, 1000);
}

// 切换暂停状态
function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseButton.textContent = "继续";
  } else {
    pauseButton.textContent = "暂停";
  }
}

// 游戏结束
function gameOver(isWin) {
  clearInterval(timerInterval);
  let message = isWin ? "恭喜你，你赢了！" : "很遗憾，你输了！";
  if (!isWin) {
    // 显示所有雷区
    gameBoard.revealAllMines();
  }
  alert(message + " 游戏用时: " + startTime + " 秒");
}

// 监听游戏结束事件
gameBoard.onGameOver = gameOver;

// 初始化游戏
initGame();

// 监听难度选择变化
difficultySelect.addEventListener("change", initGame);

// 显示模态框
function showModal() {
  gameModal.style.display = "block";
}

// 关闭模态框
function hideModal() {
  gameModal.style.display = "none";
}

// 监听模态框关闭按钮
closeModalButton.addEventListener("click", hideModal);

// 监听模态框外部点击
window.onclick = function(event) {
  if (event.target == gameModal) {
    hideModal();
  }
}