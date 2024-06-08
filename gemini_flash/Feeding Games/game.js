const foodContainer = document.getElementById('food-container');
const character = document.getElementById('character');
const startButton = document.getElementById('start-button');
const scoreElement = document.getElementById('score');

let score = 0;
let foodInterval;

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    scoreElement.textContent = `分数：${score}`;
    foodContainer.innerHTML = '';
    character.style.left = '50%';
    character.style.bottom = '0';
    startButton.disabled = true;

    createFood();
    foodInterval = setInterval(createFood, 1000);
}

function createFood() {
    const food = document.createElement('div');
    food.classList.add('food');
    food.style.left = `${Math.random() * 90}%`;
    food.style.bottom = `${Math.random() * 90}%`;
    foodContainer.appendChild(food);

    food.addEventListener('click', () => {
        food.remove();
        score++;
        scoreElement.textContent = `分数：${score}`;
    });
}

function moveCharacter(event) {
    if (event.key === 'ArrowLeft' && parseInt(character.style.left) > 0) {
        character.style.left = `${parseInt(character.style.left) - 10}%`;
    } else if (event.key === 'ArrowRight' && parseInt(character.style.left) < 90) {
        character.style.left = `${parseInt(character.style.left) + 10}%`;
    }
}

document.addEventListener('keydown', moveCharacter);

function stopGame() {
    clearInterval(foodInterval);
    startButton.disabled = false;
}

// 游戏结束条件
foodContainer.addEventListener('click', () => {
    if (score >= 10) {
        stopGame();
        alert('恭喜你！你赢了！');
    }
});