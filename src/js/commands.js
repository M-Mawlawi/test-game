const canvas = document.getElementById("MainObject");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
const ctx = canvas.getContext("2d");

let x = 0;
let y = window.innerHeight - 130;
const playerSize = 100;
let speed = 10;
let score = 0;
let fallingSquares = [];
const squareFallSpeed = 2;
const squareSize = 60;
const spawnInterval = 3000;
let lastSpawnTime = 0;
let leftPressed = false;
let rightPressed = false;
let gameRunning = true;

// Load the player image
const playerImage = new Image();
playerImage.src = './src/img/spaceship.png';

// Load the falling square image
const fallingSquareImage = new Image();
fallingSquareImage.src = './src/img/fuel.png';

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = './src/img/space.png';

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (event.key === "ArrowRight") {
        rightPressed = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
    if (event.key === "ArrowRight") {
        rightPressed = false;
    }
});

// Pause the game when the tab is not active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        gameRunning = false;
    } else {
        gameRunning = true;
    }
});

function drawSquare() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw the player image
    ctx.drawImage(playerImage, x, y, playerSize, playerSize);

    // Draw falling squares
    fallingSquares.forEach(square => {
        ctx.drawImage(fallingSquareImage, square.x, square.y, square.size, square.size);
    });

    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function spawnSquare() {
    const posX = Math.random() * (canvas.width - squareSize);
    fallingSquares.push({ x: posX, y: 0, size: squareSize });
}

function updateFallingSquares() {
    // Handle object hit
    fallingSquares.forEach(square => {
        square.y += squareFallSpeed;
        if (
            square.x < x + playerSize &&
            square.x + square.size > x &&
            square.y < y + playerSize &&
            square.y + square.size > y
        ) {
            score++;
            square.y = canvas.height;
        }
    });
    // Remove taken or fallen squares
    fallingSquares = fallingSquares.filter(square => square.y < canvas.height);
}

function gameLoop() {
    if (!gameRunning) return;
    // Controlls
    if (leftPressed) {
        x -= speed;
        if (x < 0) x = 0;
    }
    if (rightPressed) {
        x += speed;
        if (x + playerSize > canvas.width) x = canvas.width - playerSize;
    }
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > spawnInterval) {
        spawnSquare();
        lastSpawnTime = currentTime;
    }
    updateFallingSquares();
    drawSquare();
}

// Start
playerImage.onload = function() {
    fallingSquareImage.onload = function() {
        backgroundImage.onload = function() {
            setInterval(gameLoop, 10);
        };
    };
};