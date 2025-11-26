const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const highScoreElement = document.getElementById('high-score');

// Set canvas size
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const map = new GameMap();
const input = new InputHandler();
const audio = new AudioController();
const pacman = new Pacman(14, 23); // Standard start position approx
const ghosts = [
    new Ghost(13, 11, COLORS.GHOST_BLINKY, 'BLINKY'),
    new Ghost(14, 11, COLORS.GHOST_PINKY, 'PINKY'),
    new Ghost(12, 11, COLORS.GHOST_INKY, 'INKY'),
    new Ghost(15, 11, COLORS.GHOST_CLYDE, 'CLYDE')
];

// Game State
let score = 0;
let highScore = localStorage.getItem('pacman_highscore') || 0;
let lives = 3;
let gameTime = 0;
let frightenedTime = 0;
let currentMode = GHOST_MODES.SCATTER;
let gameState = GAME_STATES.PLAYING;
let deathTimer = 0;
let pelletsEaten = 0;
let fruitSpawned = false;

// Init High Score
highScoreElement.innerText = highScore;

function gameLoop() {
    if (gameState === GAME_STATES.PLAYING) {
        updateGame();
    } else if (gameState === GAME_STATES.DYING) {
        updateDeathAnimation();
    } else if (gameState === GAME_STATES.GAME_OVER) {
        // Draw Game Over Screen
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '30px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.font = '14px "Press Start 2P"';
        ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }

    requestAnimationFrame(gameLoop);
}

// Add restart listener
window.addEventListener('keydown', (e) => {
    if (gameState === GAME_STATES.GAME_OVER && e.key.toLowerCase() === 'r') {
        fullReset();
    }
});

function updateGame() {
    gameTime++;

    // Mode Logic
    if (frightenedTime > 0) {
        frightenedTime--;
        currentMode = GHOST_MODES.FRIGHTENED;
        if (frightenedTime === 0) {
            currentMode = GHOST_MODES.CHASE;
        }
    } else {
        currentMode = (gameTime % 1620 < 420) ? GHOST_MODES.SCATTER : GHOST_MODES.CHASE;
    }

    // Fruit Logic (Spawn at 70 pellets)
    if (!fruitSpawned && pelletsEaten >= 70) {
        map.setTile(20, 14, TILE_TYPES.FRUIT); // Spawn below ghost house
        fruitSpawned = true;
        // Remove fruit after 10 seconds
        setTimeout(() => {
            if (map.getTile(20, 14) === TILE_TYPES.FRUIT) {
                map.setTile(20, 14, TILE_TYPES.EMPTY);
            }
        }, 10000);
    }

    // Update Pacman
    pacman.update(input.getDirection(), map);

    // Check what Pacman ate
    let eatenItem = pacman.eat(map);
    if (eatenItem === TILE_TYPES.PELLET) {
        score += 10;
        pelletsEaten++;
        audio.playEatPellet();
    } else if (eatenItem === TILE_TYPES.POWER_PELLET) {
        score += 50;
        pelletsEaten++;
        frightenedTime = 60 * 6; // 6 Seconds
        audio.playEatPowerPellet();
        ghosts.forEach(g => {
            g.direction = { x: -g.direction.x, y: -g.direction.y };
        });
    } else if (eatenItem === TILE_TYPES.FRUIT) {
        score += 100;
        audio.playEatPowerPellet(); // Use power pellet sound for fruit
    }

    scoreElement.innerText = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
        localStorage.setItem('pacman_highscore', highScore);
    }

    // Update Ghosts
    ghosts.forEach(g => {
        g.mode = currentMode;
        g.update(pacman, ghosts, map);

        // Collision Check
        let dist = Math.sqrt(Math.pow(g.x - pacman.x, 2) + Math.pow(g.y - pacman.y, 2));
        if (dist < TILE_SIZE) {
            if (g.mode === GHOST_MODES.FRIGHTENED) {
                // Eat Ghost
                score += 200;
                audio.playEatGhost();
                g.x = 13 * TILE_SIZE;
                g.y = 11 * TILE_SIZE;
                g.col = 13;
                g.row = 11;
                g.mode = GHOST_MODES.SCATTER;
            } else {
                // Die
                startDeath();
            }
        }
    });

    // Clear & Draw
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    map.draw(ctx);
    pacman.draw(ctx);
    ghosts.forEach(g => g.draw(ctx));
}

function startDeath() {
    gameState = GAME_STATES.DYING;
    deathTimer = 0;
    audio.playDeath();
}

function updateDeathAnimation() {
    deathTimer++;

    // Clear & Draw Map (Ghosts disappear usually)
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    map.draw(ctx);

    // Draw Pacman spinning/shrinking
    if (deathTimer < 60) {
        // Freeze for 1 second
        pacman.draw(ctx);
    } else if (deathTimer < 120) {
        // Spin/Shrink animation
        let progress = (deathTimer - 60) / 60;
        let angle = progress * Math.PI * 4; // Spin
        let scale = 1 - progress;

        ctx.save();
        ctx.translate(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2);
        ctx.rotate(angle);
        ctx.scale(scale, scale);

        ctx.fillStyle = COLORS.PACMAN;
        ctx.beginPath();
        ctx.arc(0, 0, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    } else {
        // Animation done
        lives--;
        livesElement.innerText = lives;

        if (lives > 0) {
            resetPositions();
            gameState = GAME_STATES.PLAYING;
        } else {
            gameState = GAME_STATES.GAME_OVER;
        }
    }
}

function resetPositions() {
    pacman.reset();

    ghosts[0].x = 13 * TILE_SIZE; ghosts[0].y = 11 * TILE_SIZE;
    ghosts[1].x = 14 * TILE_SIZE; ghosts[1].y = 11 * TILE_SIZE;
    ghosts[2].x = 12 * TILE_SIZE; ghosts[2].y = 11 * TILE_SIZE;
    ghosts[3].x = 15 * TILE_SIZE; ghosts[3].y = 11 * TILE_SIZE;

    ghosts.forEach(g => {
        g.col = Math.round(g.x / TILE_SIZE);
        g.row = Math.round(g.y / TILE_SIZE);
        g.direction = DIRECTIONS.LEFT; // Reset direction too
    });

    gameTime = 0; // Reset wave timer? Optional.
}

function fullReset() {
    score = 0;
    lives = 3;
    pelletsEaten = 0;
    fruitSpawned = false;
    livesElement.innerText = lives;
    scoreElement.innerText = score;
    resetPositions();
    map.initMap(); // Respawn pellets
    gameState = GAME_STATES.PLAYING;
}

// Start
audio.playGameStart();
gameLoop();
