import { GameTerminal, ansi } from '../terminal';
import { GameState } from './state';
import { Renderer } from './renderer';

// Key codes sent by the terminal for special keys
const KEY = {
  escape: '\x1b',
  ctrlC: '\x03',
  enter: '\r',
};

export class GameEngine {
  private terminal: GameTerminal;
  private state: GameState;
  private renderer: Renderer;

  constructor(terminal: GameTerminal) {
    this.terminal = terminal;
    this.state = new GameState();
    this.renderer = new Renderer(terminal);
  }

start(): void {
  this.terminal.onInput((data) => this.handleInput(data));
  // Small delay lets the PTY fully open before we write to it
  setTimeout(() => this.render(), 100);
}

  private handleInput(data: string): void {
    // ESC or Ctrl+C quits
    if (data === KEY.escape || data === KEY.ctrlC) {
      this.terminal.clearScreen();
      this.terminal.write(ansi.yellow + '  Farewell, adventurer.\n\r' + ansi.reset);
      setTimeout(() => this.terminal.exit(), 800);
    }
  }

  private render(): void {
    this.renderer.draw(this.state);
  }
}
