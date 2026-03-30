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

**Next:** Milestone 2 — render a 20×10 grid of tiles with `@` as the player.
