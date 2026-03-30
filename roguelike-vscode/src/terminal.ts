import * as vscode from 'vscode';

// ANSI escape code helpers
export const ansi = {
  clear: '\x1b[2J',           // clear entire screen
  home: '\x1b[H',             // move cursor to top-left
  hideCursor: '\x1b[?25l',    // hide the blinking cursor
  showCursor: '\x1b[?25h',    // restore cursor
  reset: '\x1b[0m',           // reset all styles

  // Colors
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  bold: '\x1b[1m',

  // Move cursor to row r, col c (1-indexed)
  moveTo: (r: number, c: number) => `\x1b[${r};${c}H`,
};

export type InputHandler = (data: string) => void;

export class GameTerminal implements vscode.Pseudoterminal {
  // VS Code listens on this emitter for text to display
  private readonly _onDidWrite = new vscode.EventEmitter<string>();
  readonly onDidWrite = this._onDidWrite.event;

  // VS Code listens on this to know when the terminal should close
  private readonly _onDidClose = new vscode.EventEmitter<void>();
  readonly onDidClose = this._onDidClose.event;

  private inputHandler: InputHandler | null = null;

  // Called by VS Code when the terminal is opened
  open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
    this.write(ansi.hideCursor);
    this.write(ansi.clear + ansi.home);
  }

  // Called by VS Code when the terminal is closed/destroyed
  close(): void {
    this.write(ansi.showCursor);
    this._onDidClose.fire();
  }

  // Called by VS Code whenever the user types a key
  handleInput(data: string): void {
    this.inputHandler?.(data);
  }

  // Register a callback for keypresses — the game engine will set this
  onInput(handler: InputHandler): void {
    this.inputHandler = handler;
  }

  // Write any string to the terminal display
  write(text: string): void {
    this._onDidWrite.fire(text);
  }

  // Convenience: clear screen and move cursor home before drawing
  clearScreen(): void {
    this.write(ansi.clear + ansi.home);
  }

  // Gracefully shut the terminal down from game code
  exit(): void {
    this.write(ansi.showCursor);
    this._onDidClose.fire();
  }
}
