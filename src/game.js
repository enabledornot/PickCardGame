import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';  // Import OrbitControls
import * as OBJECTS3D from '../src/objects3d.js';
import * as GAMEOBJECTS from '../src/gameObjects.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const table = OBJECTS3D.createTable();
scene.add(table);

camera.position.set(0,14,20);
camera.lookAt(0,0,0);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 5);
sunlight.position.set(0,50,0);
sunlight.target.position.set(0,0,0);
scene.add(sunlight);

// const card = OBJECTS3D.createFoldableCard();
// card.rg.rotation.y = 0.05;
// card.bottom.position.y = 6;
// scene.add(card.bottom);
const cardDeck = GAMEOBJECTS.createDeck();
// GAMEOBJECTS.setCallBack(cardDeck.shuffle);
// cardDeck.shuffle();
// cardDeck.shuffle();
// cardDeck.shuffle();
// cardDeck.shuffle();
// cardDeck.shuffle();
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    GAMEOBJECTS.gameLoop(scene, delta);
    controls.update();
    renderer.render(scene, camera);
}
animate();

function repeat() {
    if(GAMEOBJECTS.execBuffer.length === 0) {
        cardDeck.shuffle();
    }
    setTimeout(repeat, 1000);
}
repeat();
