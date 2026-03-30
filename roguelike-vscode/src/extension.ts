import * as vscode from 'vscode';
import { GameTerminal } from './terminal';
import { GameEngine } from './game/engine';

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand('roguelike.start', () => {
    // 1. Create our custom PTY
    const pty = new GameTerminal();

    // 2. Create a VS Code terminal backed by that PTY
    const terminal = vscode.window.createTerminal({
      name: '⚔ Roguelike',
      pty,
    });

    // 3. Show the terminal panel
    terminal.show();

    // 4. Hand control to the game engine
    const engine = new GameEngine(pty);
    engine.start();
  });

  context.subscriptions.push(command);
}

export function deactivate(): void {
  // Nothing to clean up yet — the PTY's close() handles teardown
}
