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

        this.sizeMargin = 10;
        this.sizeBig = 6;
        this.sizeMedium = 5;
        this.sizeSmall = 4;

        this.name = "";
        this.meshNameInput = null;
        this.fontParser = new MyFont();

        // base material
        this.loader = new THREE.TextureLoader();
        this.texture = this.loader.load("./image/menuBase.jpg");
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // base mesh
        const planeGeometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        const material = new THREE.MeshBasicMaterial({ color: "#000000" });
        const mesh = new THREE.Mesh(planeGeometry, material);
        this.add(mesh);

        this.buildTitle();
        this.buildAuthors();
        this.buildIntroName();
        this.buildName(this.name);
        this.buildStartButton();
    }

    /**
     * Called to build title of the game on the screen
     */
    buildTitle() {
        // define constants
        const title = "BALLONS RACE";
        const titleLenght = title.length * this.sizeBig;

        // build mesh
        const meshTitle = this.fontParser.createTextMesh(
            title,
            this.sizeBig,
            this.sizeBig
        );
        const y = this.height / 2 - this.sizeMargin;
        meshTitle.position.set(-titleLenght / 2, y, this.depth + 0.001);

        // add to scene
        this.add(meshTitle);
    }

    /**
     * Called to build the name of the authors of the game on the screen
     */
    buildAuthors() {
        // define constants
        const intro = "MADE BY";
        const author1 = "RITA LEITE";
        const author2 = "TIAGO AZEVEDO";
        const introLenght = intro.length * this.sizeMedium;
        const author1Lenght = author1.length * this.sizeSmall;
        const author2Lenght = author2.length * this.sizeSmall;

        const yIntro = this.height / 2 - 2 * this.sizeMargin;
        const yAuthor1 =
            this.height / 2 - (2 * this.sizeMargin + this.sizeMedium);
        const yAuthor2 =
            this.height / 2 -
            (2 * this.sizeMargin + this.sizeMedium + this.sizeSmall);

        // build intro mesh
        const meshIntro = this.fontParser.createTextMesh(
            intro,
            this.sizeMedium,
            this.sizeMedium
        );
        meshIntro.position.set(-introLenght / 2, yIntro, this.depth + 0.001);

        // build author 1 mesh
        const meshAuthor1 = this.fontParser.createTextMesh(
            author1,
            this.sizeSmall,
            this.sizeSmall
        );

        meshAuthor1.position.set(
            -author1Lenght / 2,
            yAuthor1,
            this.depth + 0.001
        );

        // build author 2 mesh
        const meshAuthor2 = this.fontParser.createTextMesh(
            author2,
            this.sizeSmall,
            this.sizeSmall
        );
        meshAuthor2.position.set(
            -author2Lenght / 2,
            yAuthor2,
            this.depth + 0.001
        );

        // add to scene
        this.add(meshIntro);
        this.add(meshAuthor1);
        this.add(meshAuthor2);
    }

    /**
     * Called to build the indicating for the player to introduce his name
     */
    buildIntroName() {
        // define constants
        const intro = "WRITE YOUR NAME";
        const introLenght = intro.length * this.sizeMedium;
        const yIntro =
            this.height / 2 -
            (3 * this.sizeMargin + this.sizeMedium + this.sizeSmall);

        // build intro mesh
        const meshIntro = this.fontParser.createTextMesh(
            intro,
            this.sizeMedium,
            this.sizeMedium
        );
        meshIntro.position.set(-introLenght / 2, yIntro, this.depth + 0.001);

        // add to scene
        this.add(meshIntro);
    }

    /**
     * Called to build the name of the player on the screen
     * @param {string} name name of the player
     */
    buildName(name) {
        // define constants
        const nameLenght = name.length * this.sizeBig;
        const yIntro =
            this.height / 2 -
            (4 * this.sizeMargin + this.sizeMedium + this.sizeSmall);

        // build intro mesh
        this.meshNameInput = this.fontParser.createTextMesh(
            name,
            this.sizeBig,
            this.sizeBig
        );
        this.meshNameInput.position.set(
            -nameLenght / 2,
            yIntro,
            this.depth + 0.001
        );

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
        const y =
            this.height / 2 -
            (5 * this.sizeMargin + this.sizeMedium + this.sizeSmall);

        const box = new THREE.PlaneGeometry(20, 10);
        const texture = this.loader.load("./image/start.png");
        const material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        const mesh = new THREE.Mesh(box, material);
        mesh.name = "startButton";
        mesh.position.set(0, y, this.depth + 0.05);
        this.add(mesh);
    }
}

MyMenuStart.prototype.isGroup = true;
export { MyMenuStart };
