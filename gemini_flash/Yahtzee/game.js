const dice = document.querySelectorAll('.dice');
const rollButton = document.getElementById('roll-button');
const holdButton = document.getElementById('hold-button');
const scoreItems = document.querySelectorAll('.score-item input');
const totalScore = document.getElementById('total');

let currentRoll = 0;
let heldDice = [];
let scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    "three-of-a-kind": 0,
    "four-of-a-kind": 0,
    "full-house": 0,
    "small-straight": 0,
    "large-straight": 0,
    yahtzee: 0,
    chance: 0
};

function rollDice() {
    if (currentRoll < 3) {
        for (let i = 0; i < dice.length; i++) {
            if (!heldDice.includes(i)) {
                let randomNum = Math.floor(Math.random() * 6) + 1;
                dice[i].textContent = randomNum;
            }
        }
        currentRoll++;
        if (currentRoll === 3) {
            rollButton.disabled = true;
        }
    }
}

function holdDice(index) {
    if (heldDice.includes(index)) {
        heldDice.splice(heldDice.indexOf(index), 1);
        dice[index].classList.remove('held');
    } else {
        heldDice.push(index);
        dice[index].classList.add('held');
    }
}

function calculateScore(diceValues) {
    // Calculate scores for each category
    let score = 0;
    for (let i = 0; i < diceValues.length; i++) {
        score += diceValues[i];
    }
    return score;
}

function updateScore() {
    let diceValues = [];
    for (let i = 0; i < dice.length; i++) {
        diceValues.push(parseInt(dice[i].textContent));
    }

    // Update scores based on dice values
    for (let i = 0; i < scoreItems.length; i++) {
        let scoreItemId = scoreItems[i].id;
        let score = calculateScore(diceValues);
        scores[scoreItemId] = score;
        scoreItems[i].value = score;
    }

    // Calculate total score
    let total = 0;
    for (const key in scores) {
        total += scores[key];
    }
    totalScore.value = total;
}

rollButton.addEventListener('click', rollDice);
holdButton.addEventListener('click', () => {
    // Handle holding dice logic
});

for (let i = 0; i < dice.length; i++) {
    dice[i].addEventListener('click', () => {
        holdDice(i);
    });
}

// Function to reset the game
function resetGame() {
    // Reset dice to default
    for (let i = 0; i < dice.length; i++) {
        dice[i].textContent = '';
        dice[i].classList.remove('held');
    }
    // Reset scores and total
    for (let i = 0; i < scoreItems.length; i++) {
        scoreItems[i].value = '';
    }
    totalScore.value = '';
    // Reset roll count and held dice
    currentRoll = 0;
    heldDice = [];
    // Enable roll button
    rollButton.disabled = false;
}

// Add a reset button to the game
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Game';
resetButton.addEventListener('click', resetGame);
document.body.appendChild(resetButton);