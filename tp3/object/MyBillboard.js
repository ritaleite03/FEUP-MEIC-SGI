import * as THREE from "three";
import { MyMenuStart } from "./MyMenuStart.js";

/**
 * This class contains the representation of a billboard
 */
class MyBillboard extends THREE.Object3D {
    /**
     *
     * @param {MyApp} app application object
     * @param {MyMenuStart | MyMenuBallon | MyMenuFinish | MyMenyRun} menu menu to be displayed on the billboard
     */
    constructor(app, menu) {
        super();

        // constants
        this.app = app;
        this.pH = 10; // height of the pole
        this.pR = 0.5; // radius of the pole
        this.bH = 10; // height of tha image base
        this.bW = 15; // width of the image base
        this.pLW = this.pR / 2; // height of pole light
        this.pLH = this.pR * 5; // width of pole light
        this.hLW = this.pLW * 4; // width of head light
        this.hLH = this.pLW * 2; // height of head light
        this.yPL = this.pH + this.bH + this.pLW / 2;
        this.display = menu;

        this.material = new THREE.MeshStandardMaterial({
            color: "#808080",
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x000000,
            emissiveIntensity: 0.1,
        });

        this.buildStruture();
        this.builStrutureLight();
        this.buildLight();
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

    /**
     * Called to build basic structure of the billboard
     */
    buildStruture() {
        // define geometries
        const geoPole = new THREE.CylinderGeometry(this.pR, this.pR, this.pH);
        const geoBase = new THREE.BoxGeometry(this.bW, this.bH, this.pR * 2);

        // build poles
        const meshP = new THREE.Mesh(geoPole, this.material);
        meshP.position.set(0, this.pH / 2, this.bW / 4);

        // build base image
        const meshB = new THREE.Mesh(geoBase, this.material);
        meshB.rotateY(Math.PI / 2);
        meshB.position.set(0, this.pH + this.bH / 2, this.bW / 4);

        // define cast and receive shadow
        meshP.castShadow = true;
        meshB.castShadow = true;
        meshP.receiveShadow = true;
        meshB.receiveShadow = true;

        // add to object
        this.add(meshP);
        this.add(meshB);
    }

    /**
     * Called to build basic structure of the focus of light
     */
    builStrutureLight() {
        // define geometries
        const geoPoleL = new THREE.BoxGeometry(this.pLW, this.pLH, this.pLW);
        const geoHeadL = new THREE.BoxGeometry(this.hLW, this.hLH, this.hLW);

        // build poles
        const meshPL1 = new THREE.Mesh(geoPoleL, this.material);
        const meshPL2 = new THREE.Mesh(geoPoleL, this.material);
        const meshPL3 = new THREE.Mesh(geoPoleL, this.material);
        meshPL1.rotateZ(Math.PI / 2);
        meshPL2.rotateZ(Math.PI / 2);
        meshPL3.rotateZ(Math.PI / 2);
        meshPL1.position.set(this.pLH / 2, this.yPL, this.bW / 2);
        meshPL2.position.set(this.pLH / 2, this.yPL, this.bW / 4);
        meshPL3.position.set(this.pLH / 2, this.yPL, 0);

        // build heads
        const meshHL1 = new THREE.Mesh(geoHeadL, this.material);
        const meshHL2 = new THREE.Mesh(geoHeadL, this.material);
        const meshHL3 = new THREE.Mesh(geoHeadL, this.material);
        meshHL1.position.set(
            this.pLH / 2 + this.pLH / 2,
            this.yPL,
            this.bW / 2
        );
        meshHL2.position.set(
            this.pLH / 2 + this.pLH / 2,
            this.yPL,
            this.bW / 4
        );
        meshHL3.position.set(this.pLH / 2 + this.pLH / 2, this.yPL, 0);

        // add to object
        this.add(meshPL1);
        this.add(meshPL2);
        this.add(meshPL3);
        this.add(meshHL1);
        this.add(meshHL2);
        this.add(meshHL3);
    }

    /**
     * Called to build the lights
     */
    buildLight() {
        // build lights
        const lightD = this.pH + this.bH + 5;
        const lightA = Math.PI / 4;
        const light1 = new THREE.SpotLight("#ffffff", 100, lightD, lightA);
        const light2 = new THREE.SpotLight("#ffffff", 100, lightD, lightA);
        const light3 = new THREE.SpotLight("#ffffff", 100, lightD, lightA);

        light1.position.set(this.pLH / 2 + this.pLH / 2, this.yPL, this.bW / 2);
        light2.position.set(this.pLH / 2 + this.pLH / 2, this.yPL, this.bW / 4);
        light3.position.set(this.pLH / 2 + this.pLH / 2, this.yPL, 0);

        // define target
        const target1 = new THREE.Object3D();
        const target2 = new THREE.Object3D();
        const target3 = new THREE.Object3D();

        target1.position.set(this.pLH / 2 + this.pLH / 2, 0, this.bW / 2);
        target2.position.set(this.pLH / 2 + this.pLH / 2, 0, this.bW / 4);
        target3.position.set(this.pLH / 2 + this.pLH / 2, 0, 0);

        this.add(target1);
        this.add(target2);
        this.add(target3);

        light1.target = target1;
        light2.target = target2;
        light3.target = target3;

        // define cast and receive shadow
        light1.castShadow = true;
        light2.castShadow = true;
        light3.castShadow = true;
        light1.receiveShadow = true;
        light2.receiveShadow = true;
        light3.receiveShadow = true;

        // add to object
        this.add(light1);
        this.add(light2);
        this.add(light3);

        const helper1 = new THREE.SpotLightHelper(light1);
        const helper2 = new THREE.SpotLightHelper(light2);
        const helper3 = new THREE.SpotLightHelper(light3);
        //this.add(helper1);
        //this.add(helper2);
        //this.add(helper3);
    }

    /**
     * Called to build the display panel
     */
    buildDisplay() {
        this.display.scale.set(0.15, 0.1, 0.15);
        this.display.rotateY(Math.PI / 2);
        this.display.position.set(
            this.pR + 0.001,
            this.pH + this.bH / 2,
            this.bW / 4
        );
        this.add(this.display);
    }

    /**
     * Changes the screen on the billboard from initial to game status
     */
    updateDisplay(menu) {
        if (this.display !== null && this.display !== undefined) {
            this.remove(this.display);
            this.app.scene.remove(this.display);
        }
        this.display = menu;
        this.buildDisplay();
    }
}

MyBillboard.prototype.isGroup = true;
export { MyBillboard };
