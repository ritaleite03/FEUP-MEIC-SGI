import * as THREE from "three";
import { MyFont } from "../parser/MyFont.js";

class MyMenuStart extends THREE.Object3D {
    constructor(app) {
        // variables
        super();
        this.app = app;
        this.height = 100;
        this.width = 100;
        this.depth = 0.5;
        this.marginSize = 6;
        this.textSize = 3;
        this.introSize = 4;
        this.titleSize = 6;
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

    buildTitle() {
        // define constants
        const title = "BALLONS RACE";
        const titleLenght = title.length * this.titleSize;

        // build mesh
        const meshTitle = this.fontParser.createTextMesh(
            title,
            this.titleSize,
            this.titleSize
        );
        const y = this.height / 2 - this.marginSize;
        meshTitle.position.set(-titleLenght / 2, y, this.depth + 0.001);

        // add to scene
        this.add(meshTitle);
    }

    buildAuthors() {
        // define constants
        const intro = "MADE BY";
        const author1 = "RITA LEITE";
        const author2 = "TIAGO AZEVEDO";
        const introLenght = intro.length * this.introSize;
        const author1Lenght = author1.length * this.textSize;
        const author2Lenght = author2.length * this.textSize;
        const yIntro = this.height / 2 - (this.marginSize + 2 * this.titleSize);
        const yAuthor1 =
            this.height / 2 -
            (this.marginSize + 2 * this.titleSize + this.introSize);
        const yAuthor2 =
            this.height / 2 -
            (this.marginSize +
                2 * this.titleSize +
                this.textSize +
                this.introSize);

        // build intro mesh
        const meshIntro = this.fontParser.createTextMesh(
            intro,
            this.introSize,
            this.introSize
        );
        meshIntro.position.set(-introLenght / 2, yIntro, this.depth + 0.001);

        // build author 1 mesh
        const meshAuthor1 = this.fontParser.createTextMesh(
            author1,
            this.textSize,
            this.textSize
        );

        meshAuthor1.position.set(
            -author1Lenght / 2,
            yAuthor1,
            this.depth + 0.001
        );

        // build author 2 mesh
        const meshAuthor2 = this.fontParser.createTextMesh(
            author2,
            this.textSize,
            this.textSize
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

    buildIntroName() {
        // define constants
        const intro = "WRITE YOUR NAME";
        const introLenght = intro.length * this.introSize;
        const yIntro =
            this.height / 2 -
            (this.marginSize * 2 +
                2 * this.titleSize +
                3 * this.textSize +
                this.introSize);

        // build intro mesh
        const meshIntro = this.fontParser.createTextMesh(
            intro,
            this.introSize,
            this.introSize
        );
        meshIntro.position.set(-introLenght / 2, yIntro, this.depth + 0.001);

        // add to scene
        this.add(meshIntro);
    }

    buildName(name) {
        // define constants
        const nameLenght = name.length * this.titleSize;
        const yIntro =
            this.height / 2 -
            (this.marginSize * 2 +
                2 * this.titleSize +
                3 * this.textSize +
                3 * this.introSize);

        // build intro mesh
        this.meshNameInput = this.fontParser.createTextMesh(
            name,
            this.titleSize,
            this.titleSize
        );
        this.meshNameInput.position.set(
            -nameLenght / 2,
            yIntro,
            this.depth + 0.001
        );

        // add to scene
        this.add(this.meshNameInput);
    }

    updateName(name) {
        if (this.meshNameInput !== undefined && this.meshNameInput !== null) {
            this.app.scene.remove(this.meshNameInput);
            this.remove(this.meshNameInput);
        }
        this.name = name;
        this.buildName(name);
    }

    buildStartButton() {
        const y =
            this.height / 2 -
            (this.marginSize * 2 +
                3 * this.titleSize +
                3 * this.textSize +
                5 * this.introSize);

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
