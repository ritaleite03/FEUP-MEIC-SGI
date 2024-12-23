import * as THREE from "three";
import { MyMenuStart } from "./MyMenuStart.js";

class MyBillboard extends THREE.Object3D {
    /**
     *
     * @param {*} app
     */
    constructor(app) {
        super();

        // constants
        const poleH = 10;
        const poleR = 0.5;
        const baseH = 15;
        const baseW = 20;

        // geometries
        const geometryP = new THREE.CylinderGeometry(poleR, poleR, poleH);
        const geometryB = new THREE.BoxGeometry(baseW, baseH, poleR * 2);

        // materials
        const materialP = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const materialB = new THREE.MeshBasicMaterial({ color: "#ff0000" });

        // pole mesh
        const meshP1 = new THREE.Mesh(geometryP, materialP);
        meshP1.position.set(0, poleH / 2, 0);
        this.add(meshP1);
        const meshP2 = new THREE.Mesh(geometryP, materialP);
        meshP2.position.set(0, poleH / 2, poleH);
        this.add(meshP2);

        // base mesh
        const meshB = new THREE.Mesh(geometryB, materialB);
        meshB.rotateY(Math.PI / 2);
        meshB.position.set(0, poleH + baseH / 2, baseW / 4);
        this.add(meshB);

        this.display = new MyMenuStart(app);
        this.display.scale.set(0.2, 0.15, 0.2);
        this.display.rotateY(Math.PI / 2);
        this.display.position.set(poleR + 0.001, poleH + baseH / 2, baseW / 4);
        this.add(this.display);

        // deal with screen
        document.addEventListener("keydown", (event) => {
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
        });
    }
}

MyBillboard.prototype.isGroup = true;
export { MyBillboard };
