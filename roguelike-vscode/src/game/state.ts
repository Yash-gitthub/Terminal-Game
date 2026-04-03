import { GameMap } from '../world/map';
import { generateMap } from '../world/mapgen';

export class GameState {
  map: GameMap;
  playerX: number;
  playerY: number;

  constructor() {
    this.map = new GameMap(40, 20);
    const rooms = generateMap(this.map);

    const start = rooms[0].centre();
    this.playerX = start.x;
    this.playerY = start.y;
  }
}