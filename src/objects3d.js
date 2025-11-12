import * as THREE from 'three';
import * as TEXTURES from '/src/textures.js';

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

    geometry.computeBoundingBox();

    const bbox = geometry.boundingBox;
    const pos = geometry.attributes.position;
    const uvs = new Float32Array(pos.count * 2);

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x);
        const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y);

        uvs[i * 2] = u;
        uvs[i * 2 + 1] = v;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const backMaterial = new THREE.MeshStandardMaterial({ map: TEXTURES.cards['9-8'] });
    // backTexture.wrapS = backTexture.wrapT = THREE.ClampToEdgeWrapping;
    // backTexture.repeat.set(1,1);
    const frontMaterial = new THREE.MeshStandardMaterial({ map: TEXTURES.cards[''] });
    // const backMaterial = new THREE.MeshBasicMaterial( { color: 0x00f0ff } );
    const faceCount = geometry.groups[0].count/2;
    const edgeCount = geometry.groups[1].count;
    geometry.clearGroups();
    geometry.addGroup(0, faceCount, 0);
    geometry.addGroup(faceCount, faceCount, 1);
    geometry.addGroup(2*faceCount, edgeCount, 2);
    const card = new THREE.Mesh(geometry, [frontMaterial, backMaterial, sideMaterial]);
    // console.log(geometry.attributes.uv.array.slice(0, 20));

    // card.rotation.x = -Math.PI/2;
    return card;
}