import * as THREE from "three";
import { MyBillboard } from "./object/MyBillboard.js";
import { MyPark } from "./object/MyPark.js";
import { MyBallon } from "./object/MyBallon.js";
import { MyMenuStart } from "./object/MyMenuStart.js";
import { MyFirework } from "./MyFirework.js";
import { MyMenuRun } from "./object/MyMenuRun.js";
import { MyMenuFinish } from "./object/MyMenuFinish.js";

class MyGame {
    constructor(app, track, powerUps, powerDowns, parkPlayer, parkOponent) {
        this.app = app;
        this.obstaclePenalty = 1;
        this.fireworks = [];
        this.state = "initial";
        this.paused = false;
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
        this.parkP = new MyPark(this.app, "player", parkPlayer);
        this.parkO = new MyPark(this.app, "oponent", parkOponent);

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
        this.pickingColor = "0x000000";

        // picker and move event
        document.addEventListener("pointerdown", this.onPointerMove.bind(this));
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    /**
     * Called to start the game
     */
    startGame() {
        //this.app.getActiveCamera().lookAt(0,100,0)
        //const direction = new THREE.Vector3();
        ////console.log(this.app.getActiveCamera());
        //this.app.getActiveCamera().getWorldDirection(direction);
        //console.log(direction);
        //const cameraTarget = new THREE.Vector3()
        //    .copy(this.app.getActiveCamera())
        //    .add(direction);
        //console.log("Câmera está mirando para:", cameraTarget);

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

    /**
     * Called to finish the game
     * @param {Number} time time spent playing
     */
    finishGame(time) {
        this.paused = false;
        this.state = "finish";
        if (this.ballonP.laps > this.ballonO.laps) {
            this.billboard.updateDisplay(
                new MyMenuFinish(this.app, "PLAYER", "OPONENT", time, false)
            );
        } else if (this.ballonP.laps < this.ballonO.laps) {
            this.billboard.updateDisplay(
                new MyMenuFinish(this.app, "OPONENT", "PLAYER", time, false)
            );
        } else {
            this.billboard.updateDisplay(
                new MyMenuFinish(this.app, null, null, time, true)
            );
        }
    }

    /**
     * Called to run the game
     */
    async runGame() {
        const timeTotal = 60 * 5;
        let timeLeft = 60 * 5;

        this.ballonP =
            this.parkP.ballons[this.dictP[this.ballonPickerP.name]].clone();

        this.ballonO =
            this.parkO.ballons[this.dictO[this.ballonPickerO.name]].clone();

        this.ballonP.add(this.app.cameras["FirstPerson"]);

        const heightB = this.ballonP.height;
        if (this.sideP.name === "side_1") {
            this.ballonP.position.set(
                this.track.p1.x,
                this.track.p1.y + heightB / 2,
                this.track.p1.z
            );
            this.ballonO.position.set(
                this.track.p2.x,
                this.track.p2.y + heightB / 2,
                this.track.p2.z
            );
        } else {
            this.ballonP.position.set(
                this.track.p2.x,
                this.track.p2.y + heightB / 2,
                this.track.p2.z
            );
            this.ballonO.position.set(
                this.track.p1.x,
                this.track.p1.y + heightB / 2,
                this.track.p1.z
            );
        }

        this.app.scene.add(this.ballonP);
        this.app.scene.add(this.ballonO);
        this.updateAmbientLight();

        this.ballonO.defineAnimation();
        this.ballonO.positionAction.play();

        let posPrevO = null;
        let pointO1 = this.ballonO.route[0];
        pointO1 = new THREE.Vector3(pointO1.x, pointO1.y, pointO1.z);
        this.ballonO.laps += 1;

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0 || this.state === "finish") {
                const timeSpent = timeTotal - timeLeft;
                timeLeft = 0;
                clearInterval(timerInterval);
                this.finishGame(timeSpent);
            } else {
                if (this.paused === false) {
                    timeLeft--;
                    this.billboard.display.updateTime(timeLeft);
                }
            }
        }, 1000);

        const oponentMoviment = setInterval(async () => {
            if (timeLeft <= 0) {
                clearInterval(oponentMoviment);
                return;
            }

            // check if game is paused or not
            if (this.paused === true) this.ballonO.mixer.timeScale = 0;
            else this.ballonO.mixer.timeScale = 1;

            // move oponent ballon
            this.ballonO.moveAnimation();
            const now = this.ballonO.position.clone();

            // check if finish line was passed
            if (
                now.x === pointO1.x &&
                now.y === pointO1.y &&
                now.z === pointO1.z
            ) {
                if (posPrevO !== null) {
                    posPrevO = null;
                    this.ballonO.laps += 1;
                }
            } else {
                posPrevO = now.clone();
            }
        }, 10);

        const playerMoviment = setInterval(async () => {
            if (this.paused === false && this.ballonP.penalty !== true) {
                if (timeLeft <= 0) {
                    clearInterval(playerMoviment);
                    return;
                }

                // move player ballon
                const posOld = this.ballonP.position.clone();
                this.ballonP.moveWind(this.wN, this.wS, this.wE, this.wW);

                // check for colisions
                const colisionT = this.colisionTrack(this.ballonP);
                const colisionU = this.collisionPowerUps(this.ballonP);
                const colisionD = this.collisionPowerDowns(this.ballonP);
                const colisionB = this.checkCollisionBallons();
                //console.log(colisionT, colisionU, colisionD);

                // update billboard in relation to vouchers
                this.billboard.display.updateVouchers(this.ballonP.vouchers);

                // update billboard in relation to wind
                if (this.ballonP.position.y > 0 && this.ballonP.position.y <= 5)
                    this.billboard.display.updateWind("no wind");
                if (
                    this.ballonP.position.y > 5 &&
                    this.ballonP.position.y <= 10
                )
                    this.billboard.display.updateWind("north");
                if (
                    this.ballonP.position.y > 10 &&
                    this.ballonP.position.y <= 15
                )
                    this.billboard.display.updateWind("south");
                if (
                    this.ballonP.position.y > 15 &&
                    this.ballonP.position.y <= 20
                )
                    this.billboard.display.updateWind("east");
                if (
                    this.ballonP.position.y > 20 &&
                    this.ballonP.position.y <= 25
                )
                    this.billboard.display.updateWind("west");

                // collision with power up
                if (colisionU === true) {
                    this.ballonP.vouchers += 1;
                }

                // collision with obstacle or off track
                if (
                    colisionD === true ||
                    colisionT === true ||
                    colisionB === true
                ) {
                    if (this.ballonP.vouchers > 0) this.ballonP.vouchers -= 1;
                    else {
                        this.ballonP.penalty = true;
                        await this.sleep(this.obstaclePenalty * 1000);
                        this.ballonP.penalty = false;
                    }
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

                const posCX = posNow.x + 20;
                const posCY = posNow.y + 20;
                const posCZ = posNow.z + 20;
                this.app.cameras["ThirdPerson"].position.set(
                    posCX,
                    posCY,
                    posCZ
                );
                this.app.cameras["ThirdPerson"].lookAt(this.ballonP.position);
            }
        }, 1000);
    }

    /**
     * Called to check if ballon passed finish line
     * @param {THREE.Vector3} posOld previous position of the ballon
     * @param {THREE.Vector3} posNow current position of the ballon
     * @returns true if ballon passed finish line and false otherwise
     */
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

    checkCollisionBallons() {
        const posP = this.ballonP.position;
        const bbxP = this.ballonP.boundingBox;
        const posO = this.ballonO.position;
        const bbxO = this.ballonO.boundingBox;

        // distances
        const distX = Math.abs(Math.abs(posP.x) - Math.abs(posO.x));
        const distY = Math.abs(Math.abs(posP.y) - Math.abs(posO.y));
        const distZ = Math.abs(Math.abs(posP.z) - Math.abs(posO.z));

        // check if they are colliding

        if (
            distX <= bbxP[0] / 2 + bbxO[0] / 2 &&
            distY <= bbxP[1] / 2 + bbxO[1] / 2 &&
            distZ <= bbxP[2] / 2 + bbxO[2] / 2
        ) {
            // check if they are colliding
            return true;
        }
        return false;
    }

    /**
     * Called to check if ballon collied with power ups
     * @param {MyBallon} ballon ballon of the player or the oponent
     * @returns true if collision with power up and false otherwise
     */
    collisionPowerUps(ballon) {
        const posB = ballon.position;
        const bbxB = ballon.boundingBox;

        for (const i in this.powerUps) {
            // check if powerup is activated
            if (this.powerUps[i].activated === true) {
                // variables
                const posP = this.powerUps[i].position;
                const bbxP = this.powerUps[i].boundingBox;

                // distances
                const distX = Math.abs(Math.abs(posB.x) - Math.abs(posP.x));
                const distY = Math.abs(Math.abs(posB.y) - Math.abs(posP.y));
                const distZ = Math.abs(Math.abs(posB.z) - Math.abs(posP.z));

                if (
                    distX <= bbxB[0] / 2 + bbxP[0] / 2 &&
                    distY <= bbxB[1] / 2 + bbxP[1] / 2 &&
                    distZ <= bbxB[2] / 2 + bbxP[2] / 2
                ) {
                    // check if they are colliding
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
        const posB = ballon.position;
        const bbxB = ballon.boundingBox;

        for (const i in this.powerDowns) {
            // check if powerup is activated
            if (this.powerDowns[i].activated === true) {
                // variables
                const posP = this.powerDowns[i].position;
                const bbxP = this.powerDowns[i].boundingBox;

                // distances
                const distX = Math.abs(Math.abs(posB.x) - Math.abs(posP.x));
                const distY = Math.abs(Math.abs(posB.y) - Math.abs(posP.y));
                const distZ = Math.abs(Math.abs(posB.z) - Math.abs(posP.z));

                if (
                    distX <= bbxB[0] / 2 + bbxP[0] / 2 &&
                    distY <= bbxB[1] / 2 + bbxP[1] / 2 &&
                    distZ <= bbxB[2] / 2 + bbxP[2] / 2
                ) {
                    // check if they are colliding
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
            } else if (event.key === " ") {
                this.paused = !this.paused;
                let status = this.paused === true ? "paused" : "running";
                this.billboard.display.updateStatusGame(status);
            } else if (event.key === "Escape") {
                this.state = "finish";
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
                        this.billboard.updateDisplay(new MyMenuRun(this.app));
                        this.runGame();
                    }
                }
            }

            // finish state
            if (this.state === "finish") {
                const obj = intersects[0].object;
                const name = obj.name;

                if (name === "restartButton") {
                    this.state = "game";
                    this.app.scene.remove(this.ballonP.shadow);
                    this.app.scene.remove(this.ballonO.shadow);
                    this.app.scene.remove(this.ballonP);
                    this.app.scene.remove(this.ballonO);
                    this.billboard.updateDisplay(new MyMenuRun(this.app));
                    this.runGame();
                }

                if (name === "homeButton") {
                    this.state = "initial";
                    this.app.scene.remove(this.ballonP.shadow);
                    this.app.scene.remove(this.ballonO.shadow);
                    this.app.scene.remove(this.ballonP);
                    this.app.scene.remove(this.ballonO);
                    this.billboard.updateDisplay(new MyMenuStart(this.app));
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

        if (
            (this.state === "game" || this.state === "initial") &&
            this.fireworks.length != 0
        ) {
            for (const i in this.fireworks) {
                this.fireworks[i].reset();
                this.fireworks.splice(i, 1);
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
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return 0x1000000 + r * 0x10000 + g * 0x100 + b;
    }
}

export { MyGame };
