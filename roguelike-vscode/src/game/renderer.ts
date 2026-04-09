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
        const monster = state.monsters.find(m => m.x === x && m.y === y);
        const tile = state.map.getTile(x, y);
        
        if (x === state.playerX && y === state.playerY) {
          row += ansi.green + '@' + ansi.reset;
        } else if (monster && tile.visible) {
          row += ansi.cyan + monster.glyph + ansi.reset;
        } else if (tile.visible) {
          row += tile.glyph;
        } else if (tile.explored) {
          row += ansi.gray + tile.glyph + ansi.reset;
        } else {
          row += ansi.gray + '█' + ansi.reset;
        }
      }
      frame += row + '\n\r';
    }
    frame += '\n\r';
    frame += ansi.white + ' HP: ' + ansi.reset;
    frame += state.playerHp > 15
      ? ansi.green + state.playerHp + ansi.reset
      : ansi.yellow + state.playerHp + ansi.reset;
    this.terminal.write(frame);
  }
}