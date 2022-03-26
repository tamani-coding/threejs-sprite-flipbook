import { Scene } from "three";
import * as THREE from 'three'

/**
 * This class provides to functionality to animate sprite sheets.
 */
export class SpriteFlipbook {

    private tilesHoriz = 0;
    private tilesVert = 0;
    private currentTile = 0 ;

    private map: THREE.Texture;
    private maxDisplayTime = 0;
    private currentTime = 0;
    private currentTileIndex = 0;

    private playSpriteIndices: number[] = []; 
    private sprite : THREE.Sprite;

    /**
     * 
     * @param spriteTexture A sprite sheet with sprite tiles
     * @param tilesHoriz Horizontal number of tiles
     * @param tilesVert Vertical number of tiles
     * @param scene THree.js scene which will contain the sprite
     */
    constructor(spriteTexture: string, tilesHoriz: number, tilesVert: number, scene: Scene) {
        this.tilesHoriz = tilesHoriz;
        this.tilesVert = tilesVert;

        this.map = new THREE.TextureLoader().load(spriteTexture);
        this.map.wrapS = this.map.wrapT = THREE.RepeatWrapping;
        this.map.repeat.set( 1/tilesHoriz, 1/tilesVert );
    
        this.update(0);
    
        const material = new THREE.SpriteMaterial({ map: this.map });
    
        this.sprite = new THREE.Sprite(material);
        
        scene.add(this.sprite);
    }

    public loop(playSpriteIndices: number[], startTileIndex: number, totalDuration: number) {
        this.playSpriteIndices = playSpriteIndices;
        this.currentTile = startTileIndex;
        this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
    }

    public position (x: number, y: number, z: number) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.position.z = z;
    }

    public update(delta: number) {
        this.currentTime += delta;

        if (this.maxDisplayTime > 0 && this.currentTime >= this.maxDisplayTime) {
            this.currentTime = 0;
            this.currentTileIndex = (this.currentTileIndex + 1) % this.playSpriteIndices.length;
            this.currentTile = this.playSpriteIndices[this.currentTileIndex];

            const offsetX  = (this.currentTile % this.tilesHoriz) / this.tilesHoriz;
            const offsetY = (this.tilesVert - Math.floor(this.currentTile / this.tilesHoriz) -1 ) / this.tilesVert;

            this.map.offset.x = offsetX;
            this.map.offset.y = offsetY;
        }
    }
}