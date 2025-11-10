import * as THREE from 'three';

export function createTable() {
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('/textures/wood.jpg');

    const geometry = new THREE.CircleGeometry(20, 128);
    // const material = new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const material = new THREE.MeshStandardMaterial({
        map: woodTexture,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.0
    })
    const table = new THREE.Mesh(geometry, material);
    table.rotation.x = -Math.PI / 2;
    return table;
}

function cardBackTexture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 180;
    canvas.height = 360;
    const edgeIn = 5;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0,0,canvas.width, canvas.height);
    context.fillStyle = '#0000FF';
    context.fillRect(edgeIn, edgeIn, canvas.width - edgeIn, canvas.height - edgeIn);
    context.fillStyle = '#FF0000';
    context.fillRect(100, 100, 200, 200);
    const texture = new THREE.CanvasTexture(canvas);
    texture.repeat.set(1,1);
    texture.needsUpdate = true;
    return texture;
}

export function createCard() {
    const width = 3/2;
    const height = 6/2;
    const radius = 0.2;

    const shape = new THREE.Shape();

    shape.moveTo(radius - width, height);
    shape.lineTo(width-radius, height);
    shape.quadraticCurveTo(width, height, width, height-radius);
    shape.lineTo(width, radius - height);
    shape.quadraticCurveTo(width, -height, width - radius, -height);
    shape.lineTo(radius - width, -height);
    shape.quadraticCurveTo(-width, -height, -width, radius - height);
    shape.lineTo(-width, height - radius);
    shape.quadraticCurveTo(-width, height, radius - width, height);
    shape.closePath();
    const extrudeSettings = {
        depth: 0.02,
        bevelEnabled: false,
        bevelThinkness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 2
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // geometry.computeBoundingBox();
    // const max = geometry.boundingBox.max;
    // const min = geometry.boundingBox.min;
    // const uvs = geometry.attributes.uv.array;
    // for (let i = 0; i < uvs.length; i += 2) {
    //     uvs[i] = (uvs[i] - min.x) / (max.x - min.x);
    //     uvs[i + 1] = (uvs[i + 1] - min.y) / (max.y - min.y);
    //   }
    // geometry.attributes.uv.needsUpdate = true;
    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const frontMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // const backMaterial = new THREE.MeshBasicMaterial({ map: cardBackTexture() });
    const backMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    const card = new THREE.Mesh(geometry, [frontMaterial, sideMaterial, backMaterial]);
    card.geometry.faces[0].materialIndex = 1;
    card.geometry.faces[1].materialIndex = 2;
    card.rotation.x = -Math.PI/2;
    return card;
}