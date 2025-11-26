# PACMAN - NES Style

A classic PACMAN game recreation with NES/Famicom aesthetics, built with vanilla HTML5, CSS3, and JavaScript.

![PACMAN Game](https://img.shields.io/badge/Game-PACMAN-yellow?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Features

- **Classic Gameplay**: Navigate the maze, eat pellets, and avoid ghosts
- **NES-Style Graphics**: Authentic retro aesthetics with CRT screen effects
- **Smart Ghost AI**: 4 unique ghost personalities (Blinky, Pinky, Inky, Clyde)
- **Power Pellets**: Turn the tables and chase the ghosts
- **Fruit Bonus**: Cherry appears after eating 70 pellets
- **Lives System**: 3 lives with death animation
- **High Score**: Saved locally in browser
- **8-bit Audio**: Retro sound effects using Web Audio API

## 🕹️ How to Play

1. Open `index.html` in a modern web browser
2. Use **Arrow Keys** or **WASD** to move Pacman
3. Eat all pellets to win
4. Avoid ghosts or eat power pellets to turn them blue
5. Press **R** to restart after game over

## 🎯 Scoring

- Small Pellet: **10 points**
- Power Pellet: **50 points**
- Cherry Fruit: **100 points**
- Eating Ghost: **200 points**

## 🏗️ Project Structure

```
PACMAN/
├── index.html          # Main HTML file
├── css/
│   ├── reset.css      # CSS reset
│   ├── main.css       # Main styles
│   └── crt.css        # CRT screen effects
├── js/
│   ├── constants.js   # Game constants
│   ├── input.js       # Input handler
│   ├── map.js         # Map & rendering
│   ├── pacman.js      # Pacman class
│   ├── ghost.js       # Ghost AI
│   ├── audio.js       # Sound effects
│   └── game.js        # Game loop & logic
└── TODOLIST.md        # Development checklist
```

## 🎨 Technical Highlights

- **Grid-based Movement**: Smooth pixel-perfect movement with grid locking
- **Input Buffering**: Pre-queue turns for responsive controls
- **State Machine**: Clean game state management (Playing, Dying, Game Over)
- **Ghost Modes**: Scatter, Chase, and Frightened behaviors
- **Procedural Audio**: No audio files needed - all sounds generated via Web Audio API

## 🚀 Getting Started

No build process required! Simply:

1. Clone this repository
2. Open `index.html` in your browser
3. Start playing!

```bash
git clone https://github.com/bsnovayang/PACMAN.git
cd PACMAN
# Open index.html in your browser
```

## 🎵 Audio

The game features 8-bit style sound effects:
- Pellet eating sounds
- Power pellet activation
- Ghost eating
- Death animation
- Game start melody

*Note: Audio requires user interaction to start (browser security policy)*

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Credits

Inspired by the original PACMAN arcade game by Namco (1980).

---

Made with ❤️ using vanilla JavaScript
