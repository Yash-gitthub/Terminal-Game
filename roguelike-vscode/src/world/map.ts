// A tile is just one character — '.' for floor, '#' for wall
type Tile = {
  glyph: '.' | '█';
  visible: boolean;
  explored: boolean;
};

export class GameMap {
  readonly width: number;
  readonly height: number;
  private tiles: Tile[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({length:height}, () => 
        Array.from({length:width}, ()=>({
          glyph: '█',
          visible: false,
          explored: false
        }))
    );
  }

  getTile(x: number, y: number): Tile {
    return this.tiles[y][x];
  }

  setTile(x: number, y: number, glyph: '.' | '█'): void {
    this.tiles[y][x].glyph = glyph;
  }
}