import { GameMap } from './map';
import { Room } from './room';

export function generateMap(map: GameMap): Room[] {
  const rooms: Room[] = [];
  const maxRooms = 6;
  const minSize = 3;
  const maxSize = 6;

  for (let i = 0; i < maxRooms; i++) {
    // pick a random width and height for this room
    const w = randomInt(minSize, maxSize);
    const h = randomInt(minSize, maxSize);

    // pick a random position — must fit inside the map
    const x = randomInt(1, map.width - w - 1);
    const y = randomInt(1, map.height - h - 1);

    const room = new Room(x, y, w, h);
    room.carve(map);

    // if this isn't the first room, connect it to the previous one
    if (rooms.length > 0) {
      const prev = rooms[rooms.length - 1];
      const centre1 = prev.centre();
      const centre2 = room.centre();

      carveHorizontal(map, centre1.y, centre1.x, centre2.x);
      carveVertical(map, centre2.x, centre1.y, centre2.y);

    }

    rooms.push(room);
  }

  return rooms;
}

// returns a random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function carveHorizontal(map: GameMap, y: number, x1: number, x2: number): void {
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2);
  for (let x = start; x <= end; x++) {
    map.setTile(x, y, '.');
  }
}

function carveVertical(map: GameMap, x: number, y1: number, y2: number): void {
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2);
  for (let y = start; y <= end; y++) {
    map.setTile(x, y, '.');
  }
}