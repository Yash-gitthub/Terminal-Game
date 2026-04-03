# Devlog

## Milestone 1 — Hello terminal

**Goal:** Get a VS Code terminal to open via a command palette entry and render styled text using ANSI escape codes.

**What I built:**
- `extension.ts` — registers the `roguelike.start` command with VS Code
- `terminal.ts` — implements `vscode.Pseudoterminal`, which gives us full control over what the terminal displays and lets us capture raw keystrokes
- `game/engine.ts` — minimal engine that draws a welcome screen and handles ESC/Ctrl+C to quit

**Key things I learned:**
- A VS Code extension needs a `package.json` manifest with `contributes.commands` to register a command
- `vscode.Pseudoterminal` is an interface — you implement `open()`, `close()`, `handleInput()`, and fire events on `onDidWrite` to push text to the screen
- ANSI escape codes control terminal color and cursor position: `\x1b[2J` clears the screen, `\x1b[H` homes the cursor, `\x1b[32m` makes text green
- The terminal uses `\n\r` (not just `\n`) for line breaks in raw mode

## Milestone 2 — Map and world

**Goal:**  Render a 20×10 grid of tiles (dotted matrix) with `@` as the player

**What I built:**
- `world/map.ts` — takes width (rows, inner array) and height (columns, outer array) as input and forms a dot matrix using Array.from method
- `game/state.js` — a simple object that holds everything the game currently knows: the map, the player's x and y position
- `game/renderer.js` — takes the state and converts it to an ANSI string. The engine calls this every frame

**Key things i learned:**
- A terminal is just a grid of character cells — row 1 col 1, row 1 col 2, and so on. Our "game map" is just a 2D array of characters. 
- The renderer's job is to loop through that array and write each character to the right position on screen using ANSI cursor-move codes. 

## Milestone 3 — Game Controls

**Goal:** Implement movemnets to player `@` using WSAD keys

**What I built**
- `game/engine.ts` — an object with key commands — 
  `up: '\x1b[A'`, `down: '\x1b[B'`,  `right: '\x1b[C'`, `left: '\x1b[D`
  `up: 'w'`,      `down: 's'`,       `right: 'a'`,      `left: d` 
- `A ←` / `D →` → change `playerX` (column, inner array index) - `playerX -= 1` and `playerX += 1`
  `W ↑` / `S ↓` → change `playerY` (  row,  outer array index) - `playerY -= 1` and `playerY += 1`
- Every action also performs boundary check — before moving, verify the new position is still inside the map
  ```
  new x must be >= 0 and < map.width
  new y must be >= 0 and < map.height
  ```

**Key things i learned:**
- Raw key byte parsing from the PTY, separating input from game logic
- The update → render cycle.
  ```
  input → update state → render
  ```
- The foundation every game ever made is built on

**Next:** Milestone 4 — Generate wall, rooms and corridors