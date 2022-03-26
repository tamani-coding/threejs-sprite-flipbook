import { SpriteFlipbook } from './classes/SpriteFlipbook';
import { SpriteCharacterController } from './classes/SpriteCharacterController';
import { KeyDisplay } from './classes/utils';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


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

// ORBIT CAMERA CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05 // prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 3        // prevent top down view
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()

// CONTROLABLE SPRITE CHARACTER
const spriteController = new SpriteCharacterController(camera, orbitControls, scene);

const flipBooks: SpriteFlipbook[] = []
// SOME MORE SPRITES
const knight = new SpriteFlipbook('sprites/knight_idle.png', 4, 1, scene);
knight.setPosition(1, 0.5, -5);
knight.loop([0,1,2,3], 1.5);
flipBooks.push(knight);

const fire = new SpriteFlipbook('sprites/red_fire.png', 9, 9, scene);
fire.setPosition(-2, 0.25, 0);
fire.loop([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42
,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64], 1.5);
flipBooks.push(fire);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let deltaTime = clock.getDelta();
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    spriteController.update(deltaTime);
    flipBooks.forEach(s => s.update(deltaTime));
}
document.body.appendChild(renderer.domElement);
animate();

// PRESSED BUTTONS DISPLAY
const keyDisplayQueue = new KeyDisplay();

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
    const groundTexture = textureLoader.load("./textures/pixelgrass.png");

    const WIDTH = 3
    const LENGTH = 3
    const NUM_X = 10
    const NUM_Z = 10

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: groundTexture
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

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
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

const church = 'objects/Church_RedTeam';
const market = 'objects/Market_BlueTeam';
const house = 'objects/House_Level1_BlueTeam';
const normal_tree = 'objects/Normal_tree';

function loadObjects () {

    const mtlLoader = new MTLLoader();

    mtlLoader.load(`${church}.mtl`, function (materials) {
        new OBJLoader().setMaterials(materials).loadAsync(`${church}.obj`).then((group) => {
          const obj = group.children[0];

          obj.scale.x = 0.15
          obj.scale.y = 0.15
          obj.scale.z = 0.15

          obj.position.y = 2
          obj.position.z = -12
          obj.position.x = 2

          obj.castShadow = true
          obj.receiveShadow = true

          obj.rotation.y = -Math.PI/2

          scene.add(obj)
        })
      });

      mtlLoader.load(`${market}.mtl`, function (materials) {
        new OBJLoader().setMaterials(materials).loadAsync(`${market}.obj`).then((group) => {
          const obj = group.children[0];

          obj.scale.x = 0.15
          obj.scale.y = 0.15
          obj.scale.z = 0.15

          obj.position.y = 0.3
          obj.position.z = -3
          obj.position.x = 3

          obj.castShadow = true
          obj.receiveShadow = true

          obj.rotation.y = -Math.PI/5

          scene.add(obj)
        })
      });

      mtlLoader.load(`${house}.mtl`, function (materials) {
        new OBJLoader().setMaterials(materials).loadAsync(`${house}.obj`).then((group) => {
            group.children.forEach(obj => {

                obj.scale.x = 0.2
                obj.scale.y = 0.2
                obj.scale.z = 0.2
      
                obj.position.y = 1
                obj.position.z = -5
                obj.position.x = -2
      
                obj.castShadow = true
                obj.receiveShadow = true
      
                obj.rotation.y = -Math.PI/3
      
                scene.add(obj)
            })
        })
      });

      mtlLoader.load(`${normal_tree}.mtl`, function (materials) {
        new OBJLoader().setMaterials(materials).loadAsync(`${normal_tree}.obj`).then((group) => {
            group.children.forEach(obj => {

                obj.scale.x = 0.2
                obj.scale.y = 0.2
                obj.scale.z = 0.2
      
                obj.position.y = 0.9
                obj.position.z = -2
                obj.position.x = -4
      
                obj.castShadow = true
                obj.receiveShadow = true
      
                obj.rotation.y = -Math.PI/3
      
                scene.add(obj)
            })
        })
      });

}
loadObjects ();