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
    
    if (this.state.gameOver) {
      if (data === KEY.escape || data === KEY.ctrlC) {
        this.terminal.exit();
      }
      return;
    }
    // ESC or Ctrl+C quits
    if (data === KEY.escape || data === KEY.ctrlC) {
      this.terminal.clearScreen();
      this.terminal.write(ansi.yellow + '  Farewell, adventurer.\n\r' + ansi.reset);
      setTimeout(() => this.terminal.exit(), 800);
      return;
    }

    if ((data == KEY.right || data == KEY.d) && this.state.playerX < this.state.map.width - 1 && 
    this.state.map.getTile(this.state.playerX + 1, this.state.playerY).glyph === '.'){
      
      const target = this.state.monsters.find(
        m => m.x === this.state.playerX + 1 && m.y === this.state.playerY
      );

      if (target) {
        target.hp -= 5;
        if (target.hp <= 0) {
          this.state.monsters = this.state.monsters.filter(m => m !== target);
        }
      } else {
        this.state.playerX += 1;
      }
    
    }
    if ((data == KEY.left || data == KEY.a) && this.state.playerX > 0 &&
    this.state.map.getTile(this.state.playerX - 1, this.state.playerY).glyph === '.'){
      
      const target = this.state.monsters.find(
        m => m.x === this.state.playerX - 1 && m.y === this.state.playerY
      );

      if (target) {
        target.hp -= 5;
        if (target.hp <= 0) {
          this.state.monsters = this.state.monsters.filter(m => m !== target);
        }
      } else {
        this.state.playerX -= 1;
      }
    }

    if ((data == KEY.up || data == KEY.w) && this.state.playerY > 0 &&
    this.state.map.getTile(this.state.playerX, this.state.playerY - 1).glyph === '.'){
      
      const target = this.state.monsters.find(
        m => m.x === this.state.playerX && m.y === this.state.playerY - 1
      );

      if (target) {
        target.hp -= 5;
        if (target.hp <= 0) {
          this.state.monsters = this.state.monsters.filter(m => m !== target);
        }
      } else {
        this.state.playerY -= 1;
      }

    }
    if ((data == KEY.down || data == KEY.s) && this.state.playerY < this.state.map.height - 1 &&
    this.state.map.getTile(this.state.playerX, this.state.playerY + 1).glyph === '.'){
    
      const target = this.state.monsters.find(
        m => m.x === this.state.playerX&& m.y === this.state.playerY + 1
      );

      if (target) {
        target.hp -= 5;
        if (target.hp <= 0) {
          this.state.monsters = this.state.monsters.filter(m => m !== target);
        }
      } else {
        this.state.playerY += 1;
      }

    }
    // after all movement checks, before render
    computeFOV(this.state, 5);
    this.processTurn();

    if (this.state.playerHp <= 0) {
      this.state.gameOver = true;
      this.renderer.draw(this.state);
      this.terminal.write('\n\r' + ansi.yellow + ansi.bold + '  You died. Press ESC to quit.' + ansi.reset);
      return;
    }

    this.render();
  }

  private render(): void {
    this.renderer.draw(this.state);
  }

  private processTurn(): void {
    for (const monster of this.state.monsters) {
      if (monster.isPlayerVisible(this.state.playerX, this.state.playerY)) {
        monster.seen = true;
      }
      if (monster.seen) {
        const newX = monster.x + Math.sign(this.state.playerX - monster.x);
        const newY = monster.y + Math.sign(this.state.playerY - monster.y);
        
        // if monster would step on player — attack instead
        if (newX === this.state.playerX && newY === this.state.playerY) {
          this.state.playerHp -= 3;
        } else {
          monster.moveToward(this.state.playerX, this.state.playerY, this.state.map);
        }
      } else {
        // random movement
        const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const nx = monster.x + dir.dx;
        const ny = monster.y + dir.dy;
        if (this.state.map.getTile(nx, ny).glyph === '.') {
          monster.x = nx;
          monster.y = ny;
        }
      }
    }
  }
}
