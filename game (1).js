
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let score = 0;
let timeLeft = 30;
let isShooting = false;
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    radius: 20,
    dx: 0,
    dy: 0,
    dragStartX: 0,
    dragStartY: 0
};

let basket = {
    x: canvas.width - 100,
    y: 100,
    width: 100,
    height: 20,
    speed: 2
};

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5733';
    ctx.fill();
    ctx.closePath();
}

// Draw basket
function drawBasket() {
    ctx.beginPath();
    ctx.rect(basket.x, basket.y, basket.width, basket.height);
    ctx.fillStyle = '#008C00';
    ctx.fill();
    ctx.closePath();
}

// Draw score and time
function drawInfo() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('time').textContent = `Time: ${timeLeft}`;
}

// Timer function
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft -= 1;
    } else {
        endGame();
    }
}

// Shooting mechanics
function shootBall() {
    if (isShooting) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.dy += 0.1; // Gravity effect
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.dy = 0;
            isShooting = false;
            checkScore();
        }
    }
}

// Check if the ball goes into the basket
function checkScore() {
    if (ball.x > basket.x && ball.x < basket.x + basket.width &&
        ball.y - ball.radius < basket.y + basket.height) {
        score++;
        basket.speed += 0.2; // Increase difficulty
    }
}

// Start dragging the ball
function startDrag(e) {
    if (!isShooting) {
        ball.dragStartX = e.clientX;
        ball.dragStartY = e.clientY;
    }
}

// Drag the ball and aim
function dragBall(e) {
    if (!isShooting) {
        let dx = e.clientX - ball.dragStartX;
        let dy = e.clientY - ball.dragStartY;
        ball.x = canvas.width / 2 + dx;
        ball.y = canvas.height - 100 + dy;
    }
}

// Release the ball to shoot
function releaseBall() {
    if (!isShooting) {
        let dx = ball.x - canvas.width / 2;
        let dy = ball.y - (canvas.height - 100);
        ball.dx = dx * 0.1;
        ball.dy = dy * 0.1;
        isShooting = true;
    }
}

// Move the basket and make the game more difficult
function increaseDifficulty() {
    basket.x += basket.speed;
    if (basket.x + basket.width > canvas.width || basket.x < 0) {
        basket.speed = -basket.speed;
    }
}

// End game function
function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2 - 70, canvas.height / 2 + 40);
    cancelAnimationFrame(gameLoop); // Stop the game loop
}

// Update the game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBasket();
    drawInfo();
    shootBall();
    increaseDifficulty();
    updateTimer();
}

// Event listeners for mouse events
canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', dragBall);
canvas.addEventListener('mouseup', releaseBall);

// Start the game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
