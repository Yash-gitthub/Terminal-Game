import { GameState } from "../game/state";


export function computeFOV(state: GameState, radius: number): void {
    for (let y = 0; y < state.map.height; y++){
        for (let x = 0; x < state.map.width; x++){
            if (distance(state.playerX ,state.playerY, x, y) <= radius * radius){
                state.map.setVisibility(x,y,true,true);
            }else{
                state.map.setVisibility(x,y,false,state.map.getTile(x, y).explored);
            }
        }
    }
}

function distance(x1:number, y1: number, x2: number, y2:number): number{
    return ((x2 - x1)**2) + ((y2 - y1)**2);
}