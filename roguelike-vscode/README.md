# Roguelike VS Code Extension

A 2D roguelike game playable inside the VS Code terminal, built as a VS Code extension.

## How to play

1. Open this folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
4. Run **Roguelike: Start Game**

## Controls

| Key | Action |
|-----|--------|
| `ESC` / `Ctrl+C` | Quit |
| `D` / `→` | Move Right |
| `W` / `↑` | Move Up |
| `S` / `↓` | Move Down |
| `A` / `←` | Move Left |

*(More controls coming in future milestones)*

## Development setup

```bash
npm install
npm run compile   # or: npm run watch  (recompiles on save)
```

Then press `F5` in VS Code to open the Extension Development Host.

## Architecture

```
src/
  extension.ts        VS Code entry point — registers the command
  terminal.ts         Pseudoterminal (PTY) wrapper + ANSI helpers
  game/
    engine.ts         Game loop, input handling, render calls
    renderer.js       Renders the map, player and actions
    state.js          Tells about the map, the player's x and y position.
  world/              (Milestone 4) Map generation, tiles, FOV
    map.js            Creates dot matrix as map with @ as player
  entities/           (Milestone 6) Player, monsters
  items/              (Milestone 7) Items, inventory
```

## Milestones

- [x] **M1** — Hello terminal: PTY, command, ANSI render
- [x] **M2** — Grid renderer: 20×10 map, `@` player
- [x] **M3** — Movement: arrow keys / WASD
- [ ] **M4** — Dungeon generation: BSP rooms + corridors
- [ ] **M5** — Field of view: shadowcasting
- [ ] **M6** — Monsters + turn system
- [ ] **M7** — Items, inventory, win/lose

## Devlog

See [DEVLOG.md](./DEVLOG.md) for development notes.
