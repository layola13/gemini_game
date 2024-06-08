const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas dimensions
const canvasWidth = 600;
const canvasHeight = 400;

// Game state
let score = 0;
let lives = 3;
let gameOver = false;

// Fruit properties
const fruitTypes = ["apple", "banana", "orange", "strawberry", "watermelon"];
const fruitColors = {
  apple: "red",
  banana: "yellow",
  orange: "orange",
  strawberry: "red",
  watermelon: "green"
};
const fruitRadius = 25;
let fruits = [];

// Bomb properties
const bombRadius = 30;
const bombImage = new Image();
bombImage.src = "bomb.png"; // Replace with actual bomb image path

// Player properties
const player = {
  x: canvasWidth / 2,
  y: canvasHeight - 50,
  radius: 20,
  color: "blue"
};

// Function to generate random fruit
function generateFruit() {
  const fruit = {
    type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
    x: Math.random() * (canvasWidth - 2 * fruitRadius) + fruitRadius,
    y: -fruitRadius,
    dx: (Math.random() - 0.5) * 5,
    dy: 5 + Math.random() * 5
  };
  fruits.push(fruit);
}

// Function to generate random bomb
function generateBomb() {
  const bomb = {
    x: Math.random() * (canvasWidth - 2 * bombRadius) + bombRadius,
    y: -bombRadius,
    dx: (Math.random() - 0.5) * 5,
    dy: 5 + Math.random() * 5
  };
  fruits.push(bomb);
}

// Function to draw fruit
function drawFruit(fruit) {
  ctx.beginPath();
  ctx.arc(fruit.x, fruit.y, fruitRadius, 0, 2 * Math.PI);
  ctx.fillStyle = fruitColors[fruit.type];
  ctx.fill();
}

// Function to draw bomb
function drawBomb(bomb) {
  ctx.drawImage(bombImage, bomb.x - bombRadius, bomb.y - bombRadius, 2 * bombRadius, 2 * bombRadius);
}

// Function to update fruit positions
function updateFruits() {
  fruits.forEach((fruit, index) => {
    fruit.x += fruit.dx;
    fruit.y += fruit.dy;

    // Check if fruit is off screen
    if (fruit.y > canvasHeight) {
      fruits.splice(index, 1);
      lives--;
    }
  });
}

// Function to check for collisions with fruits
function checkFruitCollision(x, y) {
  let hitFruit = false;
  fruits.forEach((fruit, index) => {
    const distance = Math.sqrt(Math.pow(x - fruit.x, 2) + Math.pow(y - fruit.y, 2));
    if (distance < fruitRadius) {
      fruits.splice(index, 1);
      score++;
      hitFruit = true;
    }
  });
  return hitFruit;
}

// Function to check for collisions with bombs
function checkBombCollision(x, y) {
  fruits.forEach((fruit, index) => {
    if (fruit.type === "bomb") {
      const distance = Math.sqrt(Math.pow(x - fruit.x, 2) + Math.pow(y - fruit.y, 2));
      if (distance < bombRadius) {
        fruits.splice(index, 1);
        lives--;
        gameOver = true;
      }
    }
  });
}

// Function to draw player
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();
}

// Function to handle mouse clicks
function handleMouseClick(event) {
  if (!gameOver) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    checkFruitCollision(mouseX, mouseY);
    checkBombCollision(mouseX, mouseY);
  }
}

// Function to draw the game
function drawGame() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw fruits
  fruits.forEach((fruit) => {
    if (fruit.type === "bomb") {
      drawBomb(fruit);
    } else {
      drawFruit(fruit);
    }
  });

  // Draw player
  drawPlayer();

  // Draw score and lives
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Lives: " + lives, canvasWidth - 100, 30);

  // Draw game over message
  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", canvasWidth / 2 - 100, canvasHeight / 2);
  }
}

// Game loop
function gameLoop() {
  if (!gameOver) {
    // Generate fruits and bombs randomly
    if (Math.random() < 0.05) {
      generateFruit();
    }
    if (Math.random() < 0.01) {
      generateBomb();
    }

    // Update fruit positions
    updateFruits();

    // Draw the game
    drawGame();
  } else {
    // Stop game loop if game over
    cancelAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener("click", handleMouseClick);

// Initialize game
canvas.width = canvasWidth;
canvas.height = canvasHeight;
gameLoop();