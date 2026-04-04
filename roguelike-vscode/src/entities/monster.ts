import { GameMap } from '../world/map';

export class Monster {
    x: number;
    y: number;
    glyph: string;
    hp: number;
    seen: boolean;
    fovRadius: number;

    constructor(x: number, y: number, glyph: string, hp: number = 10, seen: boolean = false, fovRadius: number = 4){
        this.x = x;
        this.y = y;
        this.glyph = glyph;
        this.hp = hp;
        this.seen = seen;
        this.fovRadius = fovRadius;
    }

    isPlayerVisible(playerX: number, playerY: number): boolean {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        return (dx * dx + dy * dy) <= this.fovRadius * this.fovRadius;
    }

    moveToward(playerX: number, playerY: number, map: GameMap): void {
        const dx = playerX - this.x;
        const dy = playerY - this.y;

        // try moving horizontally first
        const newX = this.x + Math.sign(dx);
        const newY = this.y + Math.sign(dy);

        if (map.getTile(newX, this.y).glyph === '.') {
            this.x = newX;
        } else if (map.getTile(this.x, newY).glyph === '.') {
            this.y = newY;
        }
    }
}