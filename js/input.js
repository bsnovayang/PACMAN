class InputHandler {
    constructor() {
        this.currentDirection = DIRECTIONS.NONE;
        this.nextDirection = DIRECTIONS.NONE; // For buffering

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.nextDirection = DIRECTIONS.UP;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.nextDirection = DIRECTIONS.DOWN;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.nextDirection = DIRECTIONS.LEFT;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.nextDirection = DIRECTIONS.RIGHT;
                break;
        }
    }

    getDirection() {
        return this.nextDirection;
    }
}
