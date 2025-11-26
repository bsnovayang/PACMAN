class Pacman {
    constructor(startCol, startRow) {
        this.col = startCol;
        this.row = startRow;
        this.x = startCol * TILE_SIZE;
        this.y = startRow * TILE_SIZE;

        this.direction = DIRECTIONS.NONE;
        this.nextDirection = DIRECTIONS.NONE;

        this.speed = 2; // Must be a divisor of TILE_SIZE (24)

        this.mouthOpen = 0;
        this.mouthSpeed = 0.2;
        this.mouthOpening = true;
    }

    update(inputDirection, map) {
        // 1. Update intended direction from input
        if (inputDirection !== DIRECTIONS.NONE) {
            this.nextDirection = inputDirection;
        }

        // Calculate current grid position
        this.col = Math.round(this.x / TILE_SIZE);
        this.row = Math.round(this.y / TILE_SIZE);

        // Check if we are exactly at the center of a tile
        const centerX = this.col * TILE_SIZE;
        const centerY = this.row * TILE_SIZE;
        const dist = Math.abs(this.x - centerX) + Math.abs(this.y - centerY);
        const atCenter = dist === 0;

        // 2. Try to turn
        if (this.nextDirection !== DIRECTIONS.NONE) {
            // Reverse direction is always allowed immediately
            if (this.nextDirection.x === -this.direction.x && this.nextDirection.y === -this.direction.y) {
                this.direction = this.nextDirection;
                this.nextDirection = DIRECTIONS.NONE;
            }
            // 90 degree turn: only allowed at center
            else if (atCenter) {
                if (this.isValidMove(this.nextDirection, map)) {
                    this.direction = this.nextDirection;
                    this.nextDirection = DIRECTIONS.NONE;
                }
            }
        }

        // 3. Move
        if (this.direction !== DIRECTIONS.NONE) {
            // If we are at center, check if we can continue in current direction
            if (atCenter && !this.isValidMove(this.direction, map)) {
                // Hit wall, stop
                // We are already at center, so just stay there
            } else {
                // Move
                this.x += this.direction.x * this.speed;
                this.y += this.direction.y * this.speed;

                // Animation
                if (this.mouthOpening) {
                    this.mouthOpen += this.mouthSpeed;
                    if (this.mouthOpen >= 1) this.mouthOpening = false;
                } else {
                    this.mouthOpen -= this.mouthSpeed;
                    if (this.mouthOpen <= 0) this.mouthOpening = true;
                }
            }
        }

        // 4. Handle Tunnel
        this.handleTunnel();

        // 5. Eat Pellets
        // Check if we are close enough to the center to eat
        if (dist < this.speed) {
            this.eat(map);
        }
    }

    isValidMove(direction, map) {
        let nextCol = this.col + direction.x;
        let nextRow = this.row + direction.y;

        // Tunnel handling for collision check
        if (nextCol < 0 || nextCol >= COLS) return true;

        return !map.isWall(nextRow, nextCol);
    }

    handleTunnel() {
        if (this.x < -TILE_SIZE / 2) {
            this.x = (COLS * TILE_SIZE) + TILE_SIZE / 2;
        } else if (this.x > (COLS * TILE_SIZE) + TILE_SIZE / 2) {
            this.x = -TILE_SIZE / 2;
        }
    }

    eat(map) {
        let tile = map.getTile(this.row, this.col);
        if (tile === TILE_TYPES.PELLET || tile === TILE_TYPES.POWER_PELLET || tile === TILE_TYPES.FRUIT) {
            map.setTile(this.row, this.col, TILE_TYPES.EMPTY);
            return tile;
        }
        return TILE_TYPES.EMPTY;
    }

    reset() {
        this.col = 14;
        this.row = 23;
        this.x = 14 * TILE_SIZE;
        this.y = 23 * TILE_SIZE;
        this.direction = DIRECTIONS.NONE;
        this.nextDirection = DIRECTIONS.NONE;
        this.mouthOpen = 0;
        this.mouthOpening = true;
        this.rotation = 0;
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.PACMAN;

        // Calculate rotation based on direction
        let angle = 0;
        if (this.direction === DIRECTIONS.RIGHT) angle = 0;
        if (this.direction === DIRECTIONS.DOWN) angle = Math.PI / 2;
        if (this.direction === DIRECTIONS.LEFT) angle = Math.PI;
        if (this.direction === DIRECTIONS.UP) angle = -Math.PI / 2;

        ctx.save();
        ctx.translate(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2);
        ctx.rotate(angle);

        // Draw Pacman
        let mouthAngle = 0.2 * this.mouthOpen * Math.PI;

        ctx.beginPath();
        ctx.arc(0, 0, TILE_SIZE / 2 - 2, mouthAngle, 2 * Math.PI - mouthAngle);
        ctx.lineTo(0, 0);
        ctx.fill();

        ctx.restore();
    }
}
