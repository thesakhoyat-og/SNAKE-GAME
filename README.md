# Snake Game — Cyber Terminal Edition

A browser-based Snake game built with HTML, CSS, and JavaScript.

This project gives the classic Snake game a cyber-terminal visual style with neon colours, grid effects, status panels, keyboard controls, score tracking, game-over messages, and a responsive game interface.

## Project Preview

The game includes:

- A neon cyberpunk terminal interface
- A central game grid
- Session statistics
- Live score and high-score tracking
- Snake length and speed display
- System log messages
- Pause and restart controls
- Game-over screen
- Keyboard movement using WASD or arrow keys

## Features

- Classic Snake gameplay
- Smooth keyboard controls
- Food spawning
- Snake growth after eating food
- Score tracking
- High-score tracking
- Increasing difficulty
- Collision detection
- Boundary detection
- Pause functionality
- Restart functionality
- Animated neon effects
- Cyber-terminal inspired interface
- Responsive browser-based layout

## Controls

| Key | Action |
|---|---|
| `W` or `↑` | Move up |
| `A` or `←` | Move left |
| `S` or `↓` | Move down |
| `D` or `→` | Move right |
| `Space` | Pause or resume |
| `R` | Restart the game |

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and canvas element |
| CSS3 | Layout, animations, colours, and visual effects |
| JavaScript | Game logic, controls, scoring, and rendering |
| Canvas API | Drawing the snake, food, grid, and game effects |

## Project Structure

```text
SNAKEGAME/
├── index.html
├── style.css
├── script.js
└── README.md
```

### File Descriptions

| File | Description |
|---|---|
| `index.html` | Contains the page structure and game interface |
| `style.css` | Contains the cyber-terminal design and animations |
| `script.js` | Contains the Snake game logic |
| `README.md` | Contains the project documentation |

## How the Game Works

1. The game starts when the player presses a movement key.
2. The snake moves continuously across the grid.
3. The player changes direction using WASD or the arrow keys.
4. Food appears at a random position.
5. When the snake eats the food:
   - the score increases
   - the snake becomes longer
   - the food moves to another random position
6. The game ends when the snake:
   - hits the edge of the grid
   - collides with its own body
7. The player can press `R` to restart.

## How to Run the Project

This project does not require Node.js or any package installation.

### Option 1 — Open Directly

1. Download or clone the project.
2. Open the project folder.
3. Double-click `index.html`.
4. The game will open in your browser.

### Option 2 — Use Live Server in VS Code

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

You can also click **Go Live** in the bottom-right corner of VS Code.

## Run from GitHub

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/SNAKE-GAME.git
```

Open the folder:

```bash
cd SNAKE-GAME
```

Then open `index.html` in your browser.

## Important Note

Do not run `script.js` directly using the VS Code Run Code button.

This JavaScript file is designed to run inside the browser through `index.html`. Node.js is not required for this project.

Make sure this line exists near the bottom of `index.html`:

```html
<script src="script.js"></script>
```

## Technical Concepts Demonstrated

This project demonstrates:

- JavaScript functions
- Arrays and objects
- Loops
- Conditional statements
- Event listeners
- Keyboard input handling
- DOM manipulation
- Canvas rendering
- Collision detection
- Random position generation
- Game loops
- Score management
- State management
- Responsive interface design

## Future Improvements

Possible future improvements include:

- Mobile touch controls
- Difficulty selection
- Sound effects
- Background music
- Multiple themes
- Local storage for the high score
- Power-ups
- Obstacles
- Multiple game modes
- Online leaderboard
- Start menu
- Settings panel
- Full-screen mode

## Author

Md Sakhoyat Hossain Siam

## Licence

This project was created for educational and portfolio purposes.
