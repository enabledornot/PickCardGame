import * as OBJECTS3D from '/src/objects3d.js';
import * as TEXTURES from '/src/textures.js';
import * as THREE from 'three';

const execBuffer = [];
let currentExec;
let currentExecCnt = 0;

export function gameLoop(scene, timeDelta) {
    // console.log(execBuffer);
    // return;
    if (currentExec === undefined) {
        currentExec = execBuffer.shift();
        if (currentExec === undefined) {
            return;
        }
        currentExecCnt = 0;
    }
    else {
        currentExecCnt += timeDelta;
    }
    console.log(currentExec);
    console.log(currentExecCnt);
    if(currentExec.time != 0) {
        let execFactor;
        if (currentExecCnt > currentExec.time) {
            execFactor = 1;
        }
        else {
            execFactor = currentExecCnt / currentExec.time;
        }
        currentExec.apply(scene, execFactor);
        console.log(execFactor);
        if(execFactor === 1) {
            currentExec = undefined;
        }
    }
    else {
        currentExec.apply(scene, 0);
        currentExec = undefined;
    }
}

const stackSep = 0.023;
export function createDeck() {
    const group = new THREE.Group();
    const cards = [];
    let cnt = 0;
    for(const cid of TEXTURES.cardIDs) {
        const newCard = OBJECTS3D.createFoldableCard(cid);
        group.add(newCard.mesh);
        newCard.mesh.position.set(0,stackSep*cnt,0);
        cards.push(newCard);
        cnt += 1;
    }
    const halfDeck = Math.trunc(cards.length / 2) + 1;
    const deckObject = {
        c: cards,
        g: group,
        shuffle() {
            const newDeck = [];
            let i = 0;
            let j = 0;
            let k = halfDeck;
            while(i < this.c.length) {
                if(i % 2 === 0) {
                    newDeck.push(this.c[j]);
                    j++;
                }
                else {
                    newDeck.push(this.c[k]);
                    k++;
                }
                i+=1;
            }
            execBuffer.push({
                deck: this,
                time: 0.1,
                apply(scene, t) {
                    let i = 0;
                    while(i < halfDeck) {
                        this.deck.c[i].mesh.position.z = t*4;
                        i+=1;
                    }
                    while(i < this.deck.c.length) {
                        this.deck.c[i].mesh.position.z = t*-4;
                        i+=1;
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0.1,
                apply(scene, t) {
                    let i = halfDeck;
                    while(i < this.deck.c.length) {
                        const pindex = i - halfDeck;
                        this.deck.c[i].mesh.position.y = (1-t) * (stackSep * i) + t * (stackSep * pindex);
                        i += 1;
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0,
                apply(scene, t) {
                    let i = 0;
                    while(i < halfDeck) {
                        this.deck.c[i].mesh.rotation.y = Math.PI;
                        i+=1;
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0.1,
                apply(scene, t) {
                    let i = 0;
                    while(i < this.deck.c.length) {
                        this.deck.c[i].setR(t*-0.05);
                        i += 1;
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0.1,
                apply(scene, t) {
                    let i = 0;
                    while(i < halfDeck) {
                        this.deck.c[i].mesh.position.z = (1-t)*4 + (t)*2;
                        i+=1;
                    }
                    while(i < this.deck.c.length) {
                        this.deck.c[i].mesh.position.z = (1-t)*-4 + (t)*-2;
                        i+=1;
                    }
                }
            });
            execBuffer.push({
                deck: this,
                newDeck: newDeck,
                time: 10,
                icards: 0,
                apply(scene, t) {
                    while(this.icards < this.deck.c.length*t) {
                        let cardT = (t - (this.icards/this.deck.c.length))*this.deck.c.length;
                        if (cardT > 1) {
                            cardT = 1;
                        }
                        let cCard;
                        if (this.icards % 2 === 0) {
                            cCard = Math.floor(this.icards/2);
                        }
                        else {
                            cCard = Math.floor(this.icards/2) + halfDeck;
                        }
                        console.log(cCard);
                        // if (this.newDeck.length === 0 || this.newDeck[this.newDeck.length-1] !== this.deck.c[cCard]) {
                        //     this.newDeck.push(this.deck.c[cCard]);
                        // }
                        this.deck.c[cCard].setR((1-cardT)*-0.05);
                        this.icards += 1;
                    }
                    if(this.icards > 0) {
                        this.icards -= 1;
                    }
                    for(let i = 0; i < this.newDeck.length; i++) {
                        let cardT = t * (this.newDeck.length-i);
                        if(cardT > 1) {
                            cardT = 1;
                        }
                        this.newDeck[i].mesh.position.y = (cardT-1)*Math.floor(i/2)*stackSep + cardT*i*stackSep;
                        // this.newDeck[i].mesh.position.y = (1-cardT)*Math.floor(i/2)*stackSep + cardT*i*stackSep;
                    }
                }

            })
        }
    }
    execBuffer.push({
        deck: deckObject,
        time: 0,
        apply(scene, t) {
            scene.add(this.deck.g);
        }
    });
    return deckObject;
}