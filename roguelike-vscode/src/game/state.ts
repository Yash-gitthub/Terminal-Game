import { GameMap } from '../world/map';

export class GameState {
  map: GameMap;
  playerX: number;
  playerY: number;

  constructor() {
    this.map = new GameMap(20, 10);
    this.playerX = 10;
    this.playerY = 5;
  }
}