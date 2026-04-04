import { GameMap } from '../world/map';
import { generateMap } from '../world/mapgen';
import { Monster } from '../entities/monster';

export class GameState {
  map: GameMap;
  playerX: number;
  playerY: number;
  playerHp: number;
  monsters: Monster[];

  constructor() {
    this.map = new GameMap(40, 20);
    const rooms = generateMap(this.map);

    const start = rooms[0].centre();
    this.playerX = start.x;
    this.playerY = start.y;
    this.playerHp = 30;

    this.monsters = rooms.slice(1).map(room => {
      const c = room.centre();
      return new Monster(c.x, c.y, 'g');
    });
  }
}