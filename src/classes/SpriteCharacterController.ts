import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IDLE_RIGHT, IDLE_LEFT, RUN_RIGHT, RUN_LEFT } from './SpriteAnimation';
import { SpriteFlipbook } from './SpriteFlipbook';
import * as THREE from 'three'

const CHARACTER_SPRITE_SHEET = 'sprites/sprite_character_32px.png';

export class SpriteCharacterController {

    ANIMATION_DURATION_SECONDS = 1.25;
    MOVEMENT_SPEED_PER_SECOND = 2;

    spriteFlipbook: SpriteFlipbook;
    camera: THREE.Camera;
    orbitControls: OrbitControls;

    isFacingRight = true;
    isMoving = false;
    keysPressed = { w: false, a: false, s: false, d: false };
    currentAnimation = IDLE_RIGHT;

    walkDirection = new THREE.Vector3();
    rotateWalkDirection = new THREE.Quaternion();
    rotateYAxis = new THREE.Vector3(0, 1, 0);


    constructor(camera: THREE.Camera, orbitControls: OrbitControls, scene: THREE.Scene) {
        this.camera = camera;
        this.orbitControls = orbitControls;

        this.spriteFlipbook = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
        this.spriteFlipbook.loop(this.currentAnimation.tiles, this.ANIMATION_DURATION_SECONDS);
        this.spriteFlipbook.setPosition(0, 0.5, 0);

        this.initCamera();

        document.addEventListener('keydown', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = true
        }, false);
        document.addEventListener('keyup', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = false
        }, false);
    }

    public update(delta: number) {
        this.updateStateAndAnimation();
        this.move(delta);
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
            this.spriteFlipbook.loop(this.currentAnimation.tiles, this.ANIMATION_DURATION_SECONDS);
        }
    }

    private move (delta: number) {
        if (!this.isMoving) {
            return;
        }

        this.camera.getWorldDirection(this.walkDirection);  // walk direction where camera is pointing at
        this.walkDirection.y = 0;                           // ignore y-axis movement 
        this.walkDirection.normalize();                     // constant movement into all directions

        const offset = this.directionOffset();              // angle offset based on pressed w,a,s,d keys
        this.rotateWalkDirection.setFromAxisAngle(this.rotateYAxis, offset) // rotation quaternion
        this.walkDirection.applyQuaternion(this.rotateWalkDirection);   // rotate movement direction

        // apply movement speed
        this.walkDirection.multiplyScalar(this.MOVEMENT_SPEED_PER_SECOND * delta)

        // move sprite
        this.spriteFlipbook.addPosition(this.walkDirection.x, 
            this.walkDirection.y, 
            this.walkDirection.z);
        // move camera
        this.camera.position.add(this.walkDirection);
        this.orbitControls.target = this.spriteFlipbook.getPosition();
    }

    private directionOffset() {
        var directionOffset = 0 // w

        if (this.keysPressed.w) {
            if (this.keysPressed.a) {
                directionOffset = Math.PI / 4 // w+a
            } else if (this.keysPressed.d) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (this.keysPressed.s) {
            if (this.keysPressed.a) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (this.keysPressed.d) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (this.keysPressed.a) {
            directionOffset = Math.PI / 2 // a
        } else if (this.keysPressed.d) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }

    private initCamera() {
        this.orbitControls.target = this.spriteFlipbook.getPosition();
        this.camera.position.z = this.spriteFlipbook.getPosition().z + 3;
        this.camera.position.x = this.spriteFlipbook.getPosition().x;
        this.camera.position.y = 1;
    }
}