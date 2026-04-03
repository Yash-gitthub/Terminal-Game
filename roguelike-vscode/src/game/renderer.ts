import { GameState } from './state';
import { ansi } from '../terminal';

export class Renderer {
  private terminal: { write: (text: string) => void };

  constructor(terminal: { write: (text: string) => void }) {
    this.terminal = terminal;
  }

  draw(state: GameState): void {
    let frame = ansi.clear + ansi.home;

    for (let y = 0; y < state.map.height; y++) {
      let row = '';
      for (let x = 0; x < state.map.width; x++) {
        const tile = state.map.getTile(x, y);
        
        if (x === state.playerX && y === state.playerY) {
          row += '@';
        } else if (tile.visible) {
          row += tile.glyph;
        } else if (tile.explored) {
          row += ansi.gray + tile.glyph + ansi.reset;
        } else {
          row += '█';
        }
      }
      frame += row + '\n\r';
    }

    this.terminal.write(frame);
  }
}