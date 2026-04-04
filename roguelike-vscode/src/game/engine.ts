import { GameTerminal, ansi } from '../terminal';
import { GameState } from './state';
import { Renderer } from './renderer';
import { computeFOV } from '../world/fov';

// Key codes sent by the terminal for special keys
const KEY = {
  escape: '\x1b',
  ctrlC: '\x03',
  enter: '\r',
  up: '\x1b[A',
  down: '\x1b[B',  
  right: '\x1b[C',
  left: '\x1b[D',
  w: 'w',
  a: 'a',
  s: 's',
  d: 'd',
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
  setTimeout(() => {
    computeFOV(this.state, 5);
    this.render();
  }, 100);
}

  private handleInput(data: string): void {
    // ESC or Ctrl+C quits
    if (data === KEY.escape || data === KEY.ctrlC) {
      this.terminal.clearScreen();
      this.terminal.write(ansi.yellow + '  Farewell, adventurer.\n\r' + ansi.reset);
      setTimeout(() => this.terminal.exit(), 800);
      return;
    }
    if ((data == KEY.right || data == KEY.d) && this.state.playerX < this.state.map.width - 1 && 
    this.state.map.getTile(this.state.playerX + 1, this.state.playerY).glyph === '.'){
      this.state.playerX += 1;
    }
    if ((data == KEY.left || data == KEY.a) && this.state.playerX > 0 &&
    this.state.map.getTile(this.state.playerX - 1, this.state.playerY).glyph === '.'){
      this.state.playerX -= 1;
    }
    if ((data == KEY.up || data == KEY.w) && this.state.playerY > 0 &&
    this.state.map.getTile(this.state.playerX, this.state.playerY - 1).glyph === '.'){
      this.state.playerY -= 1;
    }
    if ((data == KEY.down || data == KEY.s) && this.state.playerY < this.state.map.height - 1 &&
    this.state.map.getTile(this.state.playerX, this.state.playerY + 1).glyph === '.'){
      this.state.playerY += 1;
    }
    // after all movement checks, before render
    computeFOV(this.state, 5);
    this.render();
  }

  private render(): void {
    this.renderer.draw(this.state);
  }
}
