# PACMAN Game Development Plan (NES Style)

## 1. Project Setup & Visual Style (NES/Famicom Theme)
- [ ] **Initialize Project**: Setup modular structure.
    - `index.html`
    - **CSS**: `css/reset.css`, `css/main.css`, `css/crt.css`
    - **JS**: `js/constants.js`, `js/input.js`, `js/map.js`, `js/pacman.js`, `js/ghost.js`, `js/game.js`
- [ ] **NES Color Palette**: Use strict colors (Black background `#000000`, Neon Blue walls `#1919A6`, Pacman Yellow `#FFFF00`).
- [ ] **CRT Effect**: Add a CSS overlay to simulate scanlines and slight screen curvature for that authentic 80s feel.
- [ ] **Typography**: Use a pixelated 8-bit font (e.g., "Press Start 2P" or similar) for Score and "READY!".

## 2. The Maze (Level 1)
- [x] **Grid System**: Implement a tile-based grid (standard 28x31 tiles).
- [x] **Map Design**: Recreate the classic Level 1 layout using a 2D array.
- [ ] **Rendering**: Draw walls using HTML5 Canvas paths to mimic the double-line style.
- [ ] **The Tunnel**: Implement the warp tunnel on the left and right edges.

## 3. Pacman Mechanics
- [x] **Movement**: Smooth movement between tiles, but logic locked to the grid.
- [x] **Controls**: Arrow keys / WASD with input buffering (remember next turn before reaching intersection).
- [x] **Animation**: 3-frame mouth animation (Closed, Half, Open).
- [x] **Collision**: Stop at walls, collect items.

## 4. Game Objects
- [x] **Pellets**: 240 small dots (10 pts each).
- [x] **Power Pellets**: 4 large flashing dots (50 pts each).
- [x] **Fruit**: Cherry bonus (100 pts) appearing below the ghost house.

## 5. Ghost AI (The 4 Personalities)
- [x] **Blinky (Red)**: Chases Pacman directly (Shadow).
- [x] **Pinky (Pink)**: Targets 4 tiles in front of Pacman (Speedy).
- [x] **Inky (Cyan)**: Complex targeting based on Blinky and Pacman (Bashful).
- [x] **Clyde (Orange)**: Chases when far, scatters when close (Pokey).
- [x] **States**: Implement Scatter, Chase, and Frightened (Blue) modes.

## 6. Game Loop & Logic
- [x] **Scoring**: Update score display in real-time.
- [x] **High Score**: Save locally.
- [x] **Lives**: Start with 3 lives. Handle death animation (spinning away).
- [x] **Win/Loss**: 
    - Win: Clear all pellets -> Reset board (Level 2 speed increase optional).
    - Loss: Lose life -> Reset positions -> Game Over if 0 lives.

## 7. Audio (8-bit)
- [x] **Sound Manager**: Simple oscillator-based or sample-based audio.
- [x] **Tracks**: Intro music, Waka-waka loop, Siren (background hum), Eat Ghost, Death.
