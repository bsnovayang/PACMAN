class Ghost {
    constructor(startCol, startRow, color, type) {
        this.col = startCol;
        this.row = startRow;
        this.x = startCol * TILE_SIZE;
        this.y = startRow * TILE_SIZE;
        this.color = color;
        this.type = type; // 'BLINKY', 'PINKY', 'INKY', 'CLYDE'

        this.direction = DIRECTIONS.LEFT; // Initial direction
        this.speed = 2; // Standard speed

        this.mode = GHOST_MODES.SCATTER;
        this.scared = false;

        // Scatter targets (Corners)
        this.scatterTarget = { x: 0, y: 0 };
        this.assignScatterTarget();
    }

    assignScatterTarget() {
        // Standard NES targets
        if (this.type === 'BLINKY') this.scatterTarget = { x: COLS - 2, y: 0 }; // Top Right
        if (this.type === 'PINKY') this.scatterTarget = { x: 1, y: 0 }; // Top Left
        if (this.type === 'INKY') this.scatterTarget = { x: COLS - 1, y: ROWS - 1 }; // Bottom Right
        if (this.type === 'CLYDE') this.scatterTarget = { x: 0, y: ROWS - 1 }; // Bottom Left
    }

    update(pacman, ghosts, map) {
        // 1. Calculate Target
        let target = this.getTarget(pacman, ghosts);

        // 2. Move & Decide Direction
        this.move(target, map);

        // 3. Update Grid Position
        this.col = Math.round(this.x / TILE_SIZE);
        this.row = Math.round(this.y / TILE_SIZE);
    }

    getTarget(pacman, ghosts) {
        if (this.mode === GHOST_MODES.SCATTER) {
            return this.scatterTarget;
        }

        if (this.mode === GHOST_MODES.FRIGHTENED) {
            // Random target logic is handled in move() by picking random valid direction
            return null;
        }

        if (this.mode === GHOST_MODES.CHASE) {
            switch (this.type) {
                case 'BLINKY':
                    return { x: pacman.col, y: pacman.row };
                case 'PINKY':
                    return {
                        x: pacman.col + pacman.direction.x * 4,
                        y: pacman.row + pacman.direction.y * 4
                    };
                case 'INKY':
                    // Complex vector math: 2 * (Pacman+2 - Blinky) ... simplified for now
                    return { x: pacman.col, y: pacman.row };
                case 'CLYDE':
                    // If dist > 8 tiles, chase pacman. Else scatter.
                    let dist = Math.sqrt(Math.pow(this.col - pacman.col, 2) + Math.pow(this.row - pacman.row, 2));
                    if (dist > 8) return { x: pacman.col, y: pacman.row };
                    else return this.scatterTarget;
            }
        }

        // Default
        return { x: pacman.col, y: pacman.row };
    }

    move(target, map) {
        const centerX = this.col * TILE_SIZE;
        const centerY = this.row * TILE_SIZE;
        const dist = Math.abs(this.x - centerX) + Math.abs(this.y - centerY);
        const atCenter = dist === 0;

        if (atCenter) {
            // We are at a tile center, we can decide where to go next.
            // Ghosts look one tile ahead.

            // Available moves: Up, Down, Left, Right
            // Constraints: 
            // 1. Cannot reverse (unless mode changed - TODO)
            // 2. Cannot enter wall

            let possibleDirections = [];
            const dirs = [DIRECTIONS.UP, DIRECTIONS.LEFT, DIRECTIONS.DOWN, DIRECTIONS.RIGHT]; // Priority order

            for (let dir of dirs) {
                // Don't reverse
                if (dir.x === -this.direction.x && dir.y === -this.direction.y) continue;

                // Check wall
                if (!map.isWall(this.row + dir.y, this.col + dir.x)) {
                    possibleDirections.push(dir);
                }
            }

            // If stuck (dead end), reverse is allowed (only option)
            if (possibleDirections.length === 0) {
                possibleDirections.push({ x: -this.direction.x, y: -this.direction.y });
            }

            // Choose best direction based on target
            let bestDir = possibleDirections[0];

            if (this.mode === GHOST_MODES.FRIGHTENED) {
                // Random choice
                bestDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            } else {
                // Target based choice
                let minDistance = Infinity;
                for (let dir of possibleDirections) {
                    let nextCol = this.col + dir.x;
                    let nextRow = this.row + dir.y;

                    // Euclidean distance squared
                    let d = Math.pow(nextCol - target.x, 2) + Math.pow(nextRow - target.y, 2);

                    if (d < minDistance) {
                        minDistance = d;
                        bestDir = dir;
                    }
                }
            }

            this.direction = bestDir;
        }

        // Apply movement
        // Frightened ghosts move slower (usually 50% speed)
        let moveSpeed = (this.mode === GHOST_MODES.FRIGHTENED) ? this.speed * 0.5 : this.speed;

        this.x += this.direction.x * moveSpeed;
        this.y += this.direction.y * moveSpeed;

        // Tunnel
        if (this.x < -TILE_SIZE / 2) {
            this.x = (COLS * TILE_SIZE) + TILE_SIZE / 2;
        } else if (this.x > (COLS * TILE_SIZE) + TILE_SIZE / 2) {
            this.x = -TILE_SIZE / 2;
        }
    }

    draw(ctx) {
        if (this.mode === GHOST_MODES.FRIGHTENED) {
            ctx.fillStyle = '#0000FF'; // Blue
        } else if (this.mode === GHOST_MODES.EATEN) {
            ctx.fillStyle = 'transparent'; // Only eyes visible (TODO)
        } else {
            ctx.fillStyle = this.color;
        }

        // Simple Ghost Shape
        const x = this.x;
        const y = this.y;

        ctx.beginPath();
        ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2 - 2, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE);
        // Little feet
        ctx.lineTo(x + TILE_SIZE * 0.85, y + TILE_SIZE * 0.8);
        ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE);
        ctx.lineTo(x + TILE_SIZE * 0.5, y + TILE_SIZE * 0.8);
        ctx.lineTo(x + TILE_SIZE * 0.3, y + TILE_SIZE);
        ctx.lineTo(x + TILE_SIZE * 0.15, y + TILE_SIZE * 0.8);
        ctx.lineTo(x, y + TILE_SIZE);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE * 0.35, y + TILE_SIZE * 0.4, 4, 0, Math.PI * 2);
        ctx.arc(x + TILE_SIZE * 0.65, y + TILE_SIZE * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'blue';
        let pupilX = this.direction.x * 2;
        let pupilY = this.direction.y * 2;
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE * 0.35 + pupilX, y + TILE_SIZE * 0.4 + pupilY, 2, 0, Math.PI * 2);
        ctx.arc(x + TILE_SIZE * 0.65 + pupilX, y + TILE_SIZE * 0.4 + pupilY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
