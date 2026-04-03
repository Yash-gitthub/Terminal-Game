import { GameMap } from '../world/map';

export class Room {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    carve(map: GameMap){
        for (let y = this.y; y < this.y+this.height; y++){
            for (let x = this.x; x < this.x+this.width; x++){
                map.setTile(x,y,'.');
            }
        }
    }

    centre(){
        return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + Math.floor(this.height / 2)
        };
    }
}