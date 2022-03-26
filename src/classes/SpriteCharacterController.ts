import { IDLE_RIGHT, IDLE_LEFT, RUN_RIGHT, RUN_LEFT } from './SpriteAnimation';
import { SpriteFlipbook } from './SpriteFlipbook';
import * as THREE from 'three'

const CHARACTER_SPRITE_SHEET = 'sprites/sprite_character_32px.png';

export class SpriteCharacterController {

    spriteFlipbook: SpriteFlipbook;
    isFacingRight = true;
    isMoving = false;
    keysPressed = { w: false, a: false, s: false, d: false };
    currentAnimation = IDLE_RIGHT;
    animationDuration = 1.25;

    constructor(camera: THREE.Camera, scene: THREE.Scene) {
        this.spriteFlipbook = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
        this.spriteFlipbook.loop(this.currentAnimation.tiles, this.animationDuration);
        this.spriteFlipbook.position(0, 0.5, 0);

        document.addEventListener('keydown', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = true
        }, false);
        document.addEventListener('keyup', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = false
        }, false);
    }

    public update(delta: number) {
        this.updateStateAndAnimation();

        this.spriteFlipbook.update(delta);
    }

    private updateStateAndAnimation() {
        if (this.keysPressed.a)
            this.isFacingRight = false;
        else if (this.keysPressed.d)
            this.isFacingRight = true;

        if (this.keysPressed.w || this.keysPressed.a || this.keysPressed.s || this.keysPressed.d)
            this.isMoving = true;
        else
            this.isMoving = false;

        let nextAnimation;
        if (!this.isMoving) {
            if (this.isFacingRight)
                nextAnimation = IDLE_RIGHT;
            else
                nextAnimation = IDLE_LEFT;
        } else {
            if (this.isFacingRight)
                nextAnimation = RUN_RIGHT;
            else
                nextAnimation = RUN_LEFT;
        }

        if(this.currentAnimation.key !== nextAnimation.key) {
            this.currentAnimation = nextAnimation;
            this.spriteFlipbook.loop(this.currentAnimation.tiles, this.animationDuration);
        }
    }
}