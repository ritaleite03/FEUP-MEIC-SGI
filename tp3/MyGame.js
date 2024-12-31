import * as THREE from "three";
import { MyBillboard } from "./object/MyBillboard.js";
import { MyPark } from "./object/MyPark.js";
import { MyBallon } from "./object/MyBallon.js";
import { MyMenuStart } from "./object/MyMenuStart.js";
import { MyFirework } from "./MyFirework.js";

class MyGame {
    constructor(app, track, powerUps, powerDowns) {
        this.app = app;
        this.obstaclePenalty = 1;
        this.fireworks = [];
        this.state = "initial";
        this.ambientLight = new THREE.AmbientLight("#ffffff");

        // options mesh's name
        this.optionsP = ["player_1", "player_2", "player_3", "player_4"];
        this.optionsO = ["oponent_1", "oponent_2", "oponent_3", "oponent_4"];
        this.optionsS = ["side_1", "side_2"];

        // option to index map
        this.dictP = {
            player_1: 0,
            player_2: 1,
            player_3: 2,
            player_4: 3,
        };
        this.dictO = {
            oponent_1: 0,
            oponent_2: 1,
            oponent_3: 2,
            oponent_4: 3,
        };

        // constants
        this.track = track;
        this.powerUps = powerUps;
        this.powerDowns = powerDowns;
        this.billboard = new MyBillboard(this.app, new MyMenuStart(this.app));
        this.parkP = new MyPark(this.app, "player");
        this.parkO = new MyPark(this.app, "oponent");

        // player configuration
        this.ballonPickerP = null;
        this.ballonPickerO = null;
        this.ballonP = null;
        this.ballonO = null;
        this.sideP = null;

        // wind
        this.wE = 1;
        this.wN = 1;
        this.wW = 1;
        this.wS = 1;

        // picker configuration
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 200;
        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0x00ff00";

        // picker and move event
        document.addEventListener("pointerdown", this.onPointerMove.bind(this));
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    /**
     * Called to start the game
     */
    startGame() {
        this.app.scene.add(this.ambientLight);
        this.app.scene.add(this.track.object);
        this.app.scene.add(this.billboard);

        this.parkP.position.set(-20, 0, 50);
        this.parkO.position.set(-20, 0, -50);
        this.app.scene.add(this.parkP);
        this.app.scene.add(this.parkO);

        for (const i in this.powerUps) {
            this.app.scene.add(this.powerUps[i]);
        }
        for (const i in this.powerDowns) {
            this.app.scene.add(this.powerDowns[i]);
        }
    }

    finishGame() {
        this.state = "finish";
    }

    /**
     * Called to run the game
     */
    async runGame() {
        let timeLeft = 60 * 5;

        this.ballonP =
            this.parkP.ballons[this.dictP[this.ballonPickerP.name]].clone();

        this.ballonO =
            this.parkO.ballons[this.dictO[this.ballonPickerO.name]].clone();

        if ((this.sideP.name = "side_1")) {
            this.ballonP.position.set(
                this.track.p1.x,
                this.track.p1.y + 3,
                this.track.p1.z
            );
            this.ballonO.position.set(
                this.track.p2.x,
                this.track.p2.y + 3,
                this.track.p2.z
            );
        } else {
            this.ballonP.position.set(
                this.track.p2.x,
                this.track.p2.y + 3,
                this.track.p2.z
            );
            this.ballonO.position.set(
                this.track.p1.x,
                this.track.p1.y + 3,
                this.track.p1.z
            );
        }

        this.app.scene.add(this.ballonP);
        this.app.scene.add(this.ballonO);

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                this.finishGame();
            } else {
                timeLeft--;
                this.billboard.display.updateTime(timeLeft);
            }
        }, 1000);

        const simulationInterval = setInterval(async () => {
            // Só executa se o tempo restante for maior que 0
            if (timeLeft <= 0) {
                clearInterval(simulationInterval);
                return;
            }
            const posOld = this.ballonP.position.clone();
            this.ballonP.moveWind(this.wN, this.wS, this.wE, this.wW);

            // check for colisions
            const colisionT = this.colisionTrack(this.ballonP);
            const colisionU = this.collisionPowerUps(this.ballonP);
            const colisionD = this.collisionPowerDowns(this.ballonP);

            // update billboard in relation to vouchers
            this.billboard.display.updateVouchers(this.ballonP.vouchers);

            // update billboard in relation to wind
            if (this.ballonP.position.y > 0 && this.ballonP.position.y <= 5)
                this.billboard.display.updateWind("no wind");
            if (this.ballonP.position.y > 5 && this.ballonP.position.y <= 10)
                this.billboard.display.updateWind("north");
            if (this.ballonP.position.y > 10 && this.ballonP.position.y <= 15)
                this.billboard.display.updateWind("south");
            if (this.ballonP.position.y > 15 && this.ballonP.position.y <= 20)
                this.billboard.display.updateWind("east");
            if (this.ballonP.position.y > 20 && this.ballonP.position.y <= 25)
                this.billboard.display.updateWind("west");

            // collision with power up
            if (colisionU === true) {
                this.ballonP.vouchers += 1;
            }

            // collision with obstacle or off track
            if (colisionD === true || colisionT === true) {
                if (this.ballonP.vouchers > 0) this.ballonP.vouchers -= 1;
                else await this.sleep(this.obstaclePenalty * 1000);
            }

            // off track
            if (colisionT === true) {
                const position = this.colisionTrackRepositing(this.ballonP);
                const posX = position.x;
                const posY = this.ballonP.position.y;
                const posZ = position.z;
                this.ballonP.position.set(posX, posY, posZ);
            }

            // check if finish line was passed
            const posNow = this.ballonP.position.clone();
            const finish = this.checkFinishLine(posOld, posNow);
            if (finish === true) {
                this.ballonP.laps += 1;
                this.billboard.display.updateLaps(this.ballonP.laps);
            }
        }, 1000);
    }

    checkFinishLine(posOld, posNow) {
        // define first point of track
        const posCurTemp = this.track.path.getPointAt(0);
        const posCurX = posCurTemp.x * this.track.widthS;
        const posCurY = posCurTemp.y * this.track.widthS;
        const posCurZ = posCurTemp.z * this.track.widthS;
        const posCur = new THREE.Vector3(-posCurX, posCurY, posCurZ);

        // define equation plane finish
        const v1 = this.track.finish.normalize();
        const v2 = new THREE.Vector3(0, 1, 0).normalize();
        const nx = v1.y * v2.z - v1.z * v2.y;
        const ny = v1.z * v2.x - v1.x * v2.z;
        const nz = v1.x * v2.y - v1.y * v2.z;
        const nr = nx * posCur.x + ny * posCur.y + nz * posCur.z;

        // define equation direction ballon
        let dx = posNow.x - posOld.x;
        let dy = posNow.y - posOld.y;
        let dz = posNow.z - posOld.z;
        const vd = new THREE.Vector3(dx, dy, dz).normalize();
        dx = vd.x;
        dy = vd.y;
        dz = vd.z;

        // define equation direction curve first two points
        const curve1 = this.track.points[0];
        const curve2 = this.track.points[2];
        let cx = -(curve1.x - curve2.x);
        let cy = curve1.y - curve2.y;
        let cz = curve1.z - curve2.z;
        const vc = new THREE.Vector3(cx, cy, cz).normalize();
        cx = vc.x;
        cy = vc.y;
        cz = vc.z;

        // calculate t value
        const num = nr - (nx * posOld.x + ny * posOld.y + nz * posOld.z);
        const den = nx * dx + ny * dy + nz * dz;

        // direction and plane are parallels (no intersection)
        if (den === 0) return false;

        const t = num / den;
        const interX = posOld.x + t * dx;
        const interY = posOld.y + t * dy;
        const interZ = posOld.z + t * dz;
        const intersection = new THREE.Vector3(interX, interY, interZ);
        const center = new THREE.Vector3(posCur.x, interY, posCur.z);

        const righDir = dx * cx + dy * cy + dz * cz;
        const dist = center.distanceTo(intersection);

        // intersection not between posOld and posNew
        if (t < 0 || t > 1) return false;
        // intersection outside track limits
        if (dist > this.track.widthS + 1) return false;
        // intersection when going backwards
        if (righDir > 0) return false;
        // complete
        return true;
    }

    /**
     * Called to check if ballon collied with power ups
     * @param {MyBallon} ballon ballon of the player or the oponent
     * @returns true if collision with power up and false otherwise
     */
    collisionPowerUps(ballon) {
        const position = ballon.position;
        const radius = ballon.collisionRadius;

        for (const i in this.powerUps) {
            // check if powerup is activated
            if (this.powerUps[i].activated === true) {
                // variables
                const positionP = this.powerUps[i].position;
                const radiusP = this.powerUps[i].collisionRadius;
                const distMax = radius + radiusP;

                // check if they are colliding
                if (positionP.distanceTo(position) <= distMax) {
                    this.powerUps[i].desactivate(this.obstaclePenalty);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Called to check if ballon collied with obstacle
     * @param {MyBallon} ballon ballon of the player or the oponent
     * @returns true if collision with obstacle and false otherwise
     */
    collisionPowerDowns(ballon) {
        const position = ballon.position;
        const radius = ballon.collisionRadius;

        for (const i in this.powerDowns) {
            // check if powerdown is activated
            if (this.powerDowns[i].activated === true) {
                // variables
                const positionP = this.powerDowns[i].position;
                const radiusP = this.powerDowns[i].collisionRadius;
                const distMax = radius + radiusP;

                // check if they are colliding
                if (positionP.distanceTo(position) <= distMax) {
                    this.powerDowns[i].desactivate(this.obstaclePenalty);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Called to check if ballon is inside or outside the track
     * @param {MyBallon} ballon ballon of the player or the oponent
     * @returns true if off track and false otherwise
     */
    colisionTrack(ballon) {
        // variables
        const position = ballon.shadow.position;
        const radius = ballon.shadow.geometry.parameters.radiusTop;
        const samples = 1000;
        const distMax = radius + this.track.width * this.track.widthS;

        // check colision with points of the track
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;

            // coordinates of a point in the track with scale if it
            const oldPos = this.track.path.getPointAt(t);
            const xPos = -oldPos.x * this.track.widthS;
            const yPos = oldPos.y * this.track.widthS;
            const zPos = oldPos.z * this.track.widthS;
            const newPos = new THREE.Vector3(xPos, yPos, zPos);

            // calculate distance
            if (newPos.distanceTo(position) <= distMax) return false;
        }
        return true;
    }

    /**
     * Called to get the position of point in the track closest to the ballon (used when ballon is off track)
     * @param {MyBallon} ballon ballon of the player or the oponent
     * @returns position of closest point of the track
     */
    colisionTrackRepositing(ballon) {
        // variables
        const position = ballon.position;
        const samples = 1000;
        let closestPoint = null;
        let closestDist = null;

        // check distance to points
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;

            // coordinates of a point in the track with scale if it
            const oldPos = this.track.path.getPointAt(t);
            const xPos = -oldPos.x * this.track.widthS;
            const yPos = oldPos.y * this.track.widthS;
            const zPos = oldPos.z * this.track.widthS;
            const newPos = new THREE.Vector3(xPos, yPos, zPos);

            const dist = newPos.distanceTo(position);
            if (closestDist === null || dist < closestDist) {
                closestDist = dist;
                closestPoint = newPos;
            }
        }

        return closestPoint;
    }

    /**
     * Called to make the function wait for n seconds
     * @param {Number} ms
     * @returns
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /*
     * Change the color of the first intersected object
     *
     */
    changePickedObj(obj, name) {
        // define object
        let objNew = null;
        if (name == "player") objNew = this.ballonPickerP;
        if (name == "oponent") objNew = this.ballonPickerO;
        if (name == "side") objNew = this.sideP;

        // change color
        if (objNew != obj) {
            if (objNew) objNew.material.color.setHex(objNew.currentHex);
            objNew = obj;
            objNew.currentHex = objNew.material.color.getHex();
            objNew.material.color.setHex(this.pickingColor);
        }

        // update object
        if (name == "player") this.ballonPickerP = objNew;
        if (name == "oponent") this.ballonPickerO = objNew;
        if (name == "side") this.sideP = objNew;
    }

    /**
     * Called to update ambient light according with the height of the player's ballon
     */
    updateAmbientLight() {
        const posY = this.ballonP.position.y;
        if (posY > 0 && posY <= 5) {
            this.ambientLight.color = new THREE.Color("#ffffff");
        } else if (posY > 5 && posY <= 10) {
            this.ambientLight.color = new THREE.Color("#ffbcb0");
        } else if (posY > 10 && posY <= 15) {
            this.ambientLight.color = new THREE.Color("#eaffb0");
        } else if (posY > 15 && posY <= 20) {
            this.ambientLight.color = new THREE.Color("#b0ffb3");
        } else if (posY > 20 && posY <= 25) {
            this.ambientLight.color = new THREE.Color("#b6e7fa");
        }
    }

    /**
     * Called to deal with the event of a key pressed
     * @param {*} event
     */
    onKeyPressed(event) {
        if (this.state === "game") {
            if (event.key == "ArrowDown") {
                this.ballonP.moveDown();
                this.updateAmbientLight();
            } else if (event.key === "ArrowUp") {
                this.ballonP.moveUp();
                this.updateAmbientLight();
            }
        }
    }

    /**
     * Called to deal with the event of pointer movimentation
     * @param {*} event
     */
    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
        var intersects = this.raycaster.intersectObjects(
            this.app.scene.children
        );

        if (intersects.length > 0) {
            // initial state
            if (this.state === "initial") {
                const obj = intersects[0].object;
                const name = obj.name;

                // players configuration options
                if (this.optionsP.includes(name))
                    this.changePickedObj(obj, "player");
                if (this.optionsO.includes(name))
                    this.changePickedObj(obj, "oponent");
                if (this.optionsS.includes(name))
                    this.changePickedObj(obj, "side");

                // click on button start game
                if (name == "startButton") {
                    if (
                        this.ballonPickerP !== null &&
                        this.ballonPickerO !== null &&
                        this.billboard.display.name !== "" &&
                        this.sideP !== null
                    ) {
                        this.state = "game";
                        this.billboard.updateDisplay();
                        this.runGame();
                    }
                }
            }
        }
    }

    update() {
        let t = this.app.clock.getElapsedTime();
        for (const i in this.powerUps) {
            if (this.powerUps[i]) {
                this.powerUps[i].update(t);
            }
        }
        for (const i in this.powerDowns) {
            if (this.powerDowns[i]) {
                this.powerDowns[i].update(t);
            }
        }

        if (this.state === "finish") {
            // add new fireworks every 5% of the calls
            if (Math.random() < 0.05) {
                for (let i = 0; i < 5; i++) {
                    const x = Math.random() * 50 - 25;
                    const z = Math.random() * 50 - 25;
                    const vertices = [x, 0, z];
                    const color = this.getRandomColor();
                    this.fireworks.push(
                        new MyFirework(this.app, this, vertices, color)
                    );
                }
            }

            // for each fireworks
            for (let i = 0; i < this.fireworks.length; i++) {
                // is firework finished?
                if (this.fireworks[i].done) {
                    // remove firework
                    this.fireworks.splice(i, 1);
                    continue;
                }
                // otherwise upsdate  firework
                this.fireworks[i].update();
            }
        }
    }

    getRandomColor() {
        // Gera valores aleatórios para cada componente de cor (R, G, B)
        const r = Math.floor(Math.random() * 256); // Valor para o componente R (0 a 255)
        const g = Math.floor(Math.random() * 256); // Valor para o componente G (0 a 255)
        const b = Math.floor(Math.random() * 256); // Valor para o componente B (0 a 255)

        // Converte os valores para hexadecimal e combina em um valor final
        return 0x1000000 + r * 0x10000 + g * 0x100 + b;
    }
}

export { MyGame };
