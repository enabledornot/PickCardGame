import { stack } from 'three/tsl';
import * as OBJECTS3D from '/src/objects3d.js';
import * as TEXTURES from '/src/textures.js';
import * as THREE from 'three';
export const execBuffer = [];
let currentExec;
let currentExecCnt = 0;
let callBack;
export function setCallBack(cb) {
    callBack = cb;
}
export function gameLoop(scene, timeDelta) {
    // console.log(execBuffer);
    // return;
    if (currentExec === undefined) {
        currentExec = execBuffer.shift();
        if (currentExec === undefined) {
            if(callBack !== undefined) {
                // callBack();
            }
            return;
        }
        currentExecCnt = 0;
    }
    else {
        currentExecCnt += timeDelta;
    }
    // console.log(currentExec);
    // console.log(currentExecCnt);
    if(currentExec.time != 0) {
        let execFactor;
        if (currentExecCnt > currentExec.time) {
            execFactor = 1;
        }
        else {
            execFactor = currentExecCnt / currentExec.time;
        }
        currentExec.apply(scene, execFactor);
        // console.log(execFactor);
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
            execBuffer.push({
                deck: this,
                time: 0.5,
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
                time: 0.25,
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
                time: 1,
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
                time: 0.25,
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
                newDeck: undefined,
                time: 1,
                icards: 0,
                apply(scene, t) {
                    if(this.newDeck === undefined) {
                        this.newDeck = [];
                        while(i < this.deck.c.length) {
                            if(i % 2 === 0) {
                                this.newDeck.push(this.deck.c[j]);
                                j++;
                            }
                            else {
                                this.newDeck.push(this.deck.c[k]);
                                k++;
                            }
                            i+=1;
                        }
                    }
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
                        // console.log(cCard);
                        this.deck.c[cCard].setR((1-cardT)*-0.05);
                        this.icards += 1;
                    }
                    if(this.icards > 0) {
                        this.icards -= 1;
                    }
                    for(let i = this.icards; i < this.newDeck.length; i++) {
                        let cardT = t * (1 + (this.newDeck.length - i) / this.newDeck.length);
                        if(cardT > 1) {
                            cardT = 1;
                        }
                        this.newDeck[i].mesh.position.y = (1-cardT)*Math.floor(i/2)*stackSep + cardT*i*stackSep;
                    }
                    if(t === 1) {
                        this.deck.c = this.newDeck;
                        // console.log(this.deck.c);
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0.25,
                apply(scene, t) {
                    for(let i = 0; i < this.deck.c.length; i++) {
                        if(i % 2 === 0) {
                            this.deck.c[i].mesh.position.z = (1-t)*2;
                        }
                        else {
                            this.deck.c[i].mesh.position.z = (1-t)*-2;
                        }
                    }
                }
            });
            execBuffer.push({
                deck: this,
                time: 0,
                apply(scene, t) {
                    let i = 0;
                    while(i < this.deck.c.length) {
                        this.deck.c[i].mesh.rotation.y = 0;
                        i+=1;
                    }
                }
            });
            execBuffer.push({
                time: 0.5,
                apply(scene, t) {}
            });
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