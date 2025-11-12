import * as THREE from 'three';
function generateCardTexture(type) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 180;
    canvas.height = 360;
    const edgeIn = 10;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0,0,canvas.width, canvas.height);
    if (type == '') {
        context.fillStyle = '#0000FF';
        context.fillRect(edgeIn, edgeIn, canvas.width - edgeIn*2, canvas.height - edgeIn*2);
    }
    else if (type != '-') {
        const [a, b] = type.split('-').map(Number);
        drawSide(canvas, context, a, edgeIn);
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.PI);
        context.translate(-canvas.width / 2, -canvas.height / 2);
        drawSide(canvas, context, b, edgeIn);
        context.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function drawSide(canvas, context, value, edgeIn) {
    const colors = [
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#7FFF00',
        '#00FF00',
        '#00FF7F',
        '#00FFFF',
        '#007FFF',
        '#0000FF',
        '#8B00FF'
      ];
    context.fillStyle = colors[value];
    context.beginPath();
    context.moveTo(edgeIn, edgeIn);
    context.lineTo(edgeIn, canvas.height-edgeIn);
    context.lineTo(canvas.width - edgeIn, edgeIn);
    context.closePath();
    context.fill();
    context.fillStyle = 'black';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(value, 4*edgeIn, 4*edgeIn);
}

// export const cardBack = generateCardTexture('');
export const cards = {};
cards[''] = generateCardTexture('');
cards['-'] = generateCardTexture('-');
for(let i = 0; i < 10; i++) {
    for(let j = 0; j < i; j++) {
        const key = `${i}-${j}`;
        cards[key] = generateCardTexture(key);
    }
}