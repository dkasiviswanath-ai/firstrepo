const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const gameStatus = document.getElementById('gameStatus');

const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;
const playerSpeed = 8;
const bulletSpeed = 8;
const enemySpeed = 2;
const enemySpawnInterval = 1400;

let playerX = gameWidth / 2 - 22;
let score = 0;
let keys = { left: false, right: false };
let bullets = [];
let enemies = [];
let gameOver = false;

player.style.left = `${playerX}px`;

window.addEventListener('keydown', event => {
    if (event.code === 'ArrowLeft') {
        keys.left = true;
    }
    if (event.code === 'ArrowRight') {
        keys.right = true;
    }
    if (event.code === 'Space') {
        shootBullet();
    }
});

window.addEventListener('keyup', event => {
    if (event.code === 'ArrowLeft') {
        keys.left = false;
    }
    if (event.code === 'ArrowRight') {
        keys.right = false;
    }
});

function shootBullet() {
    if (gameOver) return;

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${playerX + 19}px`;
    bullet.style.top = `${gameHeight - 46}px`;
    gameArea.appendChild(bullet);
    bullets.push(bullet);

    gameArea.classList.add('fire');
    setTimeout(() => gameArea.classList.remove('fire'), 100);
}

function spawnEnemy() {
    if (gameOver) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');

    const x = Math.floor(Math.random() * (gameWidth - 60)) + 10;
    enemy.style.left = `${x}px`;
    enemy.style.top = '-30px';

    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function movePlayer() {
    if (keys.left && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys.right && playerX < gameWidth - 44) {
        playerX += playerSpeed;
    }
    player.style.left = `${playerX}px`;
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        const top = parseInt(bullet.style.top, 10) - bulletSpeed;
        if (top < -20) {
            bullet.remove();
            bullets.splice(index, 1);
            return;
        }
        bullet.style.top = `${top}px`;
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const top = parseInt(enemy.style.top, 10) + enemySpeed;
        enemy.style.top = `${top}px`;

        if (top > gameHeight - 40) {
            endGame();
        }
    });
}

function detectCollisions() {
    enemies.forEach((enemy, enemyIndex) => {
        const enemyRect = enemy.getBoundingClientRect();
        const enemyTop = parseInt(enemy.style.top, 10);

        bullets.forEach((bullet, bulletIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const bulletTop = parseInt(bullet.style.top, 10);

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletTop < enemyTop + 24 &&
                bulletTop + 16 > enemyTop
            ) {
                enemy.remove();
                bullet.remove();
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    });
}

function endGame() {
    if (gameOver) return;
    gameOver = true;
    gameStatus.textContent = 'Game Over! Reload the page to play again.';
}

function gameLoop() {
    if (gameOver) return;
    movePlayer();
    moveBullets();
    moveEnemies();
    detectCollisions();
    requestAnimationFrame(gameLoop);
}

spawnEnemy();
setInterval(spawnEnemy, enemySpawnInterval);
gameLoop();
