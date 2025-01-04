import * as THREE from "three";
import { MyFont } from "../parser/MyFont.js";

class MyMenuStart extends THREE.Object3D {
    /**
     *
     * @param {*} app
     */
    constructor(app) {
        // variables
        super();
        this.app = app;
        this.height = 100;
        this.width = 100;
        this.depth = 0.5;

        this.sM = 10;
        this.sB = 6;
        this.sS = 4;

        this.name = "";
        this.meshNameInput = null;
        this.fontParser = new MyFont();

        // base material
        this.loader = new THREE.TextureLoader();
        this.texture = this.loader.load("./image/billboard.jpg");

        // base mesh
        const planeGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        const material = new THREE.MeshPhongMaterial({
            map: this.texture,
            specular: "#808080",
        });
        const mesh = new THREE.Mesh(planeGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        this.buildText();
        this.buildName(this.name);
        this.buildStartButton();
    }

    buildText() {
        // define text
        const title = "BALLONS RACE";
        const text1 = "MADE BY:";
        const text2 = "RITA LEITE";
        const text3 = "TIAGO AZEVEDO";
        const intro = "WRITE YOUR NAME:";

        // build mesh
        const meshTT = this.fontParser.createTextMesh(title, this.sB, this.sB);
        const meshT1 = this.fontParser.createTextMesh(text1, this.sS, this.sS);
        const meshT2 = this.fontParser.createTextMesh(text2, this.sS, this.sS);
        const meshT3 = this.fontParser.createTextMesh(text3, this.sS, this.sS);
        const meshIN = this.fontParser.createTextMesh(intro, this.sS, this.sS);

        // position mesh
        const xTT = -(title.length * this.sB) / 2 + this.sM / 2;
        const xT1 = -(text1.length * this.sS) / 2 + this.sM / 2;
        const xT2 = -(text2.length * this.sS) / 2 + this.sM / 2;
        const xT3 = -(text3.length * this.sS) / 2 + this.sM / 2;
        const xIN = -(intro.length * this.sS) / 2 + this.sM / 2;
        const yTT = this.height / 2 - this.sB;
        const yT1 = yTT - this.sB - this.sB;
        const yT2 = yT1 - this.sS;
        const yT3 = yT2 - this.sS;
        const yIN = yT3 - this.sS - this.sB;

        meshTT.position.set(xTT, yTT, this.depth + 0.005);
        meshT1.position.set(xT1, yT1, this.depth + 0.005);
        meshT2.position.set(xT2, yT2, this.depth + 0.005);
        meshT3.position.set(xT3, yT3, this.depth + 0.005);
        meshIN.position.set(xIN, yIN, this.depth + 0.005);

        // add to scene
        this.add(meshTT);
        this.add(meshT1);
        this.add(meshT2);
        this.add(meshT3);
        this.add(meshIN);
    }

    /**
     * Called to build the name of the player on the screen
     * @param {string} name name of the player
     */
    buildName(name) {
        const sS = this.sS;
        const sB = this.sB;

        // build and position mesh
        this.meshNameInput = this.fontParser.createTextMesh(name, sS, sS);
        const x = -(name.length * sS) / 2 + this.sM / 2;
        const y = this.height / 2 - 5 * sB - 3 * sS;
        this.meshNameInput.position.set(x, y, this.depth + 0.001);

        // add to scene
        this.add(this.meshNameInput);
    }

    /**
     * Called to build the name of the player on the screen when he changes its input
     * @param {string} name
     */
    updateName(name) {
        if (this.meshNameInput !== undefined && this.meshNameInput !== null) {
            this.app.scene.remove(this.meshNameInput);
            this.remove(this.meshNameInput);
        }
        this.name = name;
        this.buildName(name);
    }

    /**
     * Called to build start button on the screen
     */
    buildStartButton() {
        const word = "START";
        const mesh = this.fontParser.createTextMesh(word, this.sB, this.sB);
        const x = -(word.length * this.sB) / 2;
        const y = -this.height / 2 + 2 * this.sB;
        mesh.name = "startButton";
        mesh.position.set(x, y, this.depth + 0.05);
        this.add(mesh);

        mesh.traverse((child) => {
            child.name = mesh.name;
        });

        const planeH = this.sB + 4;
        const planeW = word.length * this.sB + 4;
        const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
        const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const geoMesh = new THREE.Mesh(planeGeo, material);
        geoMesh.name = "startButton";
        geoMesh.position.set(-this.sB / 2, y, this.depth + 0.025);

        this.add(geoMesh);
    }

    splitText(text, maxLength) {
        const words = text.split(" ");
        const result = [];
        let chunk = "";

        for (const word of words) {
            if ((chunk + word).length <= maxLength) {
                chunk += (chunk ? " " : "") + word;
            } else {
                result.push(chunk);
                chunk = word;
            }
        }
        if (chunk) result.push(chunk);

        return result;
    }
}

MyMenuStart.prototype.isGroup = true;
export { MyMenuStart };
