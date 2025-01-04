import * as THREE from "three";
import { MyFont } from "../parser/MyFont.js";

class MyMenuBallon extends THREE.Object3D {
    /**
     *
     * @param {*} app
     */
    constructor(app, name) {
        // variables
        super();

        this.app = app;
        this.name = name;
        this.height = 100;
        this.width = 100;
        this.depth = 0.5;
        this.fontParser = new MyFont();

        this.sM = 10;
        this.sB = 6;
        this.sizeMedium = 4;
        this.sS = 4;

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
        this.add(mesh);

        this.buildTitle();
        this.buildText();
    }

    /**
     * Called to build title of the game on the screen
     */
    buildTitle() {
        const title = this.name.toUpperCase() + "'S PARK";
        const mesh = this.fontParser.createTextMesh(title, this.sB, this.sB);
        const x = -(title.length * this.sB) / 2;
        const y = this.height / 2 - this.sM;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildText() {
        // define phrase
        const maxSize = this.width / this.sizeMedium - this.sS;
        const phrase = "SELECT ONE BALLON BEFORE STARTING THE GAME !";
        const phraseList = this.splitText(phrase, maxSize);

        const group = new THREE.Group();
        for (const i in phraseList) {
            // define phrase
            const subphrase = phraseList[i];
            const subphraseLenght = subphrase.length * this.sizeMedium;

            // build mesh
            const mesh = this.fontParser.createTextMesh(
                subphrase,
                this.sizeMedium,
                this.sizeMedium
            );
            const y = this.height / 2 - 3 * this.sM - i * this.sizeMedium;
            mesh.position.set(-subphraseLenght / 2, y, this.depth + 0.001);
            group.add(mesh);
        }

        // add to scene
        this.add(group);
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

MyMenuBallon.prototype.isGroup = true;
export { MyMenuBallon };
