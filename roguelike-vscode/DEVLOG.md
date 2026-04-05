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
- The terminal uses `\n\r` (not just `\n`) for line breaks in raw PTY mode — without `\r` every line shifts right like a staircase

---

## Milestone 2 — Grid renderer

**Goal:** Render a 20×10 grid of tiles with `@` as the player at the center.

**What I built:**
- `world/map.ts` — holds a 2D array of tiles. Width = columns (inner array), height = rows (outer array). Indexed as `tiles[y][x]` — row first, column second, always
- `game/state.ts` — single source of truth for everything the game knows: the map, and the player's x and y position
- `game/renderer.ts` — loops through state and converts it to an ANSI string. The engine calls this every frame

**Key things I learned:**
- A terminal is a grid of character cells. A game map is just a 2D array of characters that maps onto it
- State is separate from rendering — the map doesn't know how to draw itself, the renderer doesn't know how to update anything
- `tiles[y][x]` not `tiles[x][y]` — row first, column second. This trips everyone up the first time
- `+=` appends to a string, `=` replaces it — critical difference when building a row character by character

---

## Milestone 3 — Player movement

**Goal:** Move `@` around the grid using WASD and arrow keys.

**What I built:**
- `game/engine.ts` — added key constants and movement logic to `handleInput()`

**Key codes:**
- Arrow keys: `up: '\x1b[A'`, `down: '\x1b[B'`, `right: '\x1b[C'`, `left: '\x1b[D'`
- WASD: `w`, `a`, `s`, `d`

**Movement logic:**
- `A ←` / `D →` → change `playerX` (column, inner array index)
- `W ↑` / `S ↓` → change `playerY` (row, outer array index)
- Boundary check before every move — new position must be `>= 0` and `< map.width/height`

**Key things I learned:**
- Raw key bytes from the PTY — arrow keys are multi-byte escape sequences, not single characters
- The core game loop: `input → update state → render`. Every game ever made is built on this
- Separating input handling from rendering keeps the code clean as complexity grows

---

## Milestone 4 — Dungeon generation

**Goal:** Replace the empty dot grid with procedurally generated rooms and corridors.

**What I built:**
- `world/room.ts` — a `Room` class with position `(x, y)`, `width`, `height`. Has `carve(map)` which digs floor tiles into the map, and `centre()` which returns the middle point
- `world/mapgen.ts` — generates up to 6 rooms at random positions and sizes, carves them, then connects each room to the previous with an L-shaped corridor (horizontal then vertical)
- `game/state.ts` — map now starts filled with `█` (solid rock). Player spawns in the center of the first room
- `game/engine.ts` — wall collision added: `getTile(newX, newY).glyph === '.'` check before allowing movement

**Algorithm used:** Random room placement (not BSP — simplified from original plan but achieves the same result for this stage)

**Key things I learned:**
- Procedural generation means writing rules, not maps — every run produces a different dungeon
- L-shaped corridors: carve horizontal from center A to center B's x, then vertical down to center B's y
- `Math.min` / `Math.max` needed when looping between two points — you don't know which is larger
- `Math.sign(dx)` returns -1, 0, or 1 — useful for moving one step in a direction

---

## Milestone 5 — Field of view

**Goal:** Player can only see tiles within a radius. Explored tiles persist as gray. Unseen tiles are dark.

**What I built:**
- `world/fov.ts` — `computeFOV(state, radius)` loops every tile, computes squared distance from player, marks tiles `visible` and `explored`
- `world/map.ts` — `Tile` upgraded from a plain character to an object with `glyph`, `visible`, and `explored` properties. Added `setVisibility()` method
- `game/renderer.ts` — three rendering states: visible (full color), explored (gray), unseen (dark gray `█`)

**Rendering logic:**
```
visible     → draw normally
explored    → draw in gray (you remember it's there)
neither     → draw █ in gray (complete darkness)
```

**Key things I learned:**
- Squared distance avoids `Math.sqrt` — compare `dx*dx + dy*dy <= radius*radius` instead
- `explored` only ever sets to `true`, never back to `false` — once seen, always remembered
- Radius FOV doesn't stop at walls (limitation) — proper shadowcasting would but is more complex
- Upgrading a type from primitive to object requires updating every file that touches it

---

## Milestone 6 — Monsters

**Goal:** Spawn goblins in each room. They roam randomly until they spot the player, then chase.

**What I built:**
- `entities/monster.ts` — `Monster` class with `x`, `y`, `glyph`, `hp`, `seen`, `fovRadius`. Methods: `isPlayerVisible()` (squared distance check) and `moveToward()` (dumb chase using `Math.sign`)
- `game/state.ts` — added `monsters` array. One goblin spawns in the center of each room except the first
- `game/engine.ts` — added `processTurn()` called after every player move. Each monster checks FOV, sets `seen`, then either chases or moves randomly
- `game/renderer.ts` — monsters drawn in cyan when visible. Player drawn in green

**Turn order:**
```
player acts → computeFOV → processTurn (monsters act) → render
```

**Key things I learned:**
- Turn-based means the world only moves when the player moves — no timers needed
- "Dumb chase" with `Math.sign` is surprisingly effective and very simple to implement
- `Array.find()` searches an array and returns the first match — useful for checking if a monster occupies a tile
- `rooms.slice(1)` skips the first element — clean way to exclude the player's starting room

**Next:** Milestone 7 — Items, inventory, win/lose