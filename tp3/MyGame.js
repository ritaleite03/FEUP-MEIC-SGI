import * as THREE from "three";
import { MyBillboard } from "./object/MyBillboard.js";
import { MyPark } from "./object/MyPark.js";
import { MyBallon } from "./object/MyBallon.js";

class MyGame {
    constructor(app, track, powerUps, powerDowns) {
        this.app = app;
        this.obstaclePenalty = 1;
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
        this.billboard = new MyBillboard(this.app);
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

    /**
     * Called to run the game
     */
    async runGame() {
        const postTrackX = -this.track.points[0].x * this.track.widthS;
        const postTrackZ = this.track.points[0].z * this.track.widthS;

        this.ballonP =
            this.parkP.ballons[this.dictP[this.ballonPickerP.name]].clone();

        this.ballonO =
            this.parkO.ballons[this.dictO[this.ballonPickerO.name]].clone();

        if ((this.sideP.name = "side_1")) {
            this.ballonP.position.set(postTrackX - 5, 4, postTrackZ);
            this.ballonO.position.set(postTrackX + 5, 4, postTrackZ);
        } else {
            this.ballonP.position.set(postTrackX + 5, 4, postTrackZ);
            this.ballonO.position.set(postTrackX - 5, 4, postTrackZ);
        }

        this.app.scene.add(this.ballonP);
        this.app.scene.add(this.ballonO);

        while (true) {
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
            await this.sleep(1000);
        }
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
            const positionP = this.powerUps[i].position;
            const radiusP = this.powerUps[i].collisionRadius;
            const distMax = radius + radiusP;
            if (positionP.distanceTo(position) <= distMax) return true;
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
            const positionP = this.powerDowns[i].position;
            const radiusP = this.powerDowns[i].collisionRadius;
            const distMax = radius + radiusP;
            if (positionP.distanceTo(position) <= distMax) return true;
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
}

export { MyGame };
