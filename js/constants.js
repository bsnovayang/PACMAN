const TILE_SIZE = 24; // Scaled up from 8px original
const ROWS = 31;
const COLS = 28;

const COLORS = {
    BACKGROUND: '#000000',
    WALL: '#1919A6',
    PACMAN: '#FFFF00',
    PELLET: '#FFB8AE',
    POWER_PELLET: '#FFB8AE', // Flashing logic handled in render
    GHOST_BLINKY: '#FF0000',
    GHOST_PINKY: '#FFB8FF',
    GHOST_INKY: '#00FFFF',
    GHOST_CLYDE: '#FFB852'
};

const TILE_TYPES = {
    EMPTY: 0,
    WALL: 1,
    PELLET: 2,
    POWER_PELLET: 3,
    GHOST_HOUSE: 4,
    FRUIT: 5
};

const GHOST_MODES = {
    SCATTER: 0,
    CHASE: 1,
    FRIGHTENED: 2,
    EATEN: 3
};

const GAME_STATES = {
    PLAYING: 0,
    DYING: 1,
    GAME_OVER: 2
};

const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    NONE: { x: 0, y: 0 }
};
