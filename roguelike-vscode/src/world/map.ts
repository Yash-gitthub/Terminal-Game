// A tile is just one character — '.' for floor, '#' for wall
type Tile = '.' | '#';

export class GameMap {
  readonly width: number;
  readonly height: number;
  private tiles: Tile[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({length:height}, () => 
        Array.from({length:width}, ()=>'.')
    );
  }

  getTile(x: number, y: number): Tile {
    return tiles[x][y];
  }

  setTile(x: number, y: number, tile: Tile): void {
    this.tiles[y][x] = tile;
  }
}