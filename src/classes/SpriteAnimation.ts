export class SpriteAnimation {

    public tiles: number[]
    public key: string

    constructor(tiles: number[], key: string) {
        this.tiles = tiles;
        this.key = key;
    }
}

export const IDLE_RIGHT = new SpriteAnimation([0, 1, 2, 3], 'IDLE_RIGHT');
export const RUN_RIGHT = new SpriteAnimation([8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21], 'RUN_RIGHT');
export const IDLE_LEFT = new SpriteAnimation([24, 25, 26, 27], 'IDLE_LEFT');
export const RUN_LEFT = new SpriteAnimation([32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45], 'RUN_LEFT');
