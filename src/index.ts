import { SpriteFlipbook } from './../SpriteFlipbook';
import { KeyDisplay } from './utils';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const CHARACTER_SPRITE_SHEET = 'sprites/sprite_character_32px.png';
const IDLE_RIGHT = [0,1,2,3];
const RUN_RIGHT = [8,9,10,11,12,13,16,17,18,19,20,21];
const IDLE_LEFT = [24,25,26,27];
const RUN_LEFT = [32,33,34,35,36,37,40,41,42,43,44,45];

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()

//SPRITE
const FLIPBOOKS: SpriteFlipbook[] = [];
const spriteFlipbook1 = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
spriteFlipbook1.loop(IDLE_RIGHT, 0, 1.5);
spriteFlipbook1.position(-1.5, 0.5, 0);
FLIPBOOKS.push(spriteFlipbook1);

const spriteFlipbook2 = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
spriteFlipbook2.loop(RUN_RIGHT, 0, 1.5);
spriteFlipbook2.position(-0.5, 0.5, 0);
FLIPBOOKS.push(spriteFlipbook2);

const spriteFlipbook3 = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
spriteFlipbook3.loop(IDLE_LEFT, 0, 1.5);
spriteFlipbook3.position(0.5, 0.5, 0);
FLIPBOOKS.push(spriteFlipbook3);

const spriteFlipbook4 = new SpriteFlipbook(CHARACTER_SPRITE_SHEET, 8, 8, scene);
spriteFlipbook4.loop(RUN_LEFT, 0, 1.5);
spriteFlipbook4.position(1.5, 0.5, 0);
FLIPBOOKS.push(spriteFlipbook4);

// CONTROL KEYS
const keysPressed = {}
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    FLIPBOOKS.forEach(b => b.update(mixerUpdateDelta));
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition()
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/placeholder/placeholder.png");

    const WIDTH = 4
    const LENGTH = 4
    const NUM_X = 15
    const NUM_Z = 15

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: placeholder
        })
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    for (let i = 0; i < NUM_X; i++) {
        for (let j = 0; j < NUM_Z; j++) {
            const floor = new THREE.Mesh(geometry, material)
            floor.receiveShadow = true
            floor.rotation.x = - Math.PI / 2

            floor.position.x = i * WIDTH - (NUM_X / 2) * WIDTH
            floor.position.z = j * LENGTH - (NUM_Z / 2) * LENGTH

            scene.add(floor)
        }
    }
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, - 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}