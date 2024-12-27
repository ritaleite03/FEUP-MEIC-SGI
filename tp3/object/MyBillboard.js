import * as THREE from "three";
import { MyMenuStart } from "./MyMenuStart.js";
import { MyMenuRun } from "./MyMenuRun.js";

class MyBillboard extends THREE.Object3D {
    /**
     *
     * @param {*} app
     */
    constructor(app) {
        super();

        // constants
        this.app = app;
        this.poleH = 10;
        this.poleR = 0.5;
        this.baseH = 15;
        this.baseW = 20;

        // geometries
        const geometryP = new THREE.CylinderGeometry(
            this.poleR,
            this.poleR,
            this.poleH
        );
        const geometryB = new THREE.BoxGeometry(
            this.baseW,
            this.baseH,
            this.poleR * 2
        );

        // materials
        const materialP = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const materialB = new THREE.MeshBasicMaterial({ color: "#000000" });

        // poles mesh
        const meshP1 = new THREE.Mesh(geometryP, materialP);
        meshP1.position.set(0, this.poleH / 2, 0);
        this.add(meshP1);
        const meshP2 = new THREE.Mesh(geometryP, materialP);
        meshP2.position.set(0, this.poleH / 2, this.poleH);
        this.add(meshP2);

        // base mesh
        const meshB = new THREE.Mesh(geometryB, materialB);
        meshB.rotateY(Math.PI / 2);
        meshB.position.set(0, this.poleH + this.baseH / 2, this.baseW / 4);
        this.add(meshB);

        this.display = new MyMenuStart(app);
        this.buildDisplay();

        document.addEventListener("keydown", (event) => {
            // deal with screen input
            if (this.display instanceof MyMenuStart) {
                // remove letter or space
                if (event.key === "Backspace")
                    this.display.updateName(this.display.name.slice(0, -1));

                // add letter
                if (/^[a-zA-Z]$/.test(event.key))
                    this.display.updateName(
                        this.display.name + event.key.toUpperCase()
                    );

                // add space
                if (event.key === " ")
                    this.display.updateName(this.display.name + " ");
            }
        });
    }

    buildDisplay() {
        this.display.scale.set(0.2, 0.15, 0.2);
        this.display.rotateY(Math.PI / 2);
        this.display.position.set(
            this.poleR + 0.001,
            this.poleH + this.baseH / 2,
            this.baseW / 4
        );
        this.app.scene.add(this.display);
    }

    /**
     * Changes the screen on the billboard from initial to game status
     */
    updateDisplay() {
        if (this.display !== null && this.display !== undefined) {
            this.remove(this.display);
            this.app.scene.remove(this.display);
        }
        this.display = new MyMenuRun(this.app);
        this.buildDisplay();
    }
}

MyBillboard.prototype.isGroup = true;
export { MyBillboard };
