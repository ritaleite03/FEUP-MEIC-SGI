import * as THREE from "three";
import { MyFont } from "../parser/MyFont.js";

class MyMenuRun extends THREE.Object3D {
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

        this.time = 0;
        this.meshTime = null;
        this.laps = 0;
        this.meshLaps = null;
        this.wind = "no wind";
        this.meshWind = null;
        this.fontParser = new MyFont();
        this.vouchers = 0;
        this.meshVouchers = null;

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
        this.buildTime();
        this.buildLaps();
        this.buildWind();
        this.buildVouchers();
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

    buildTime() {
        // define constants
        const word = "Elapsed Time : " + this.time.toString();
        const wordLenght = word.length * this.sizeMedium;

        // build mesh
        const mesh = this.fontParser.createTextMesh(
            word,
            this.sizeMedium,
            this.sizeMedium
        );
        const y = this.height / 2 - 2 * this.sizeMargin;
        mesh.position.set(-wordLenght / 2, y, this.depth + 0.001);
        this.meshTime = mesh;

        // add to scene
        this.add(mesh);
    }

    buildLaps() {
        // define constants
        const word = "Laps : " + this.laps.toString();
        const wordLenght = word.length * this.sizeMedium;

        // build mesh
        const mesh = this.fontParser.createTextMesh(
            word,
            this.sizeMedium,
            this.sizeMedium
        );
        const y = this.height / 2 - 3 * this.sizeMargin;
        mesh.position.set(-wordLenght / 2, y, this.depth + 0.001);
        this.meshLaps = mesh;

        // add to scene
        this.add(mesh);
    }

    buildWind() {
        // define constants
        const word = "Wind : " + this.wind;
        const wordLenght = word.length * this.sizeMedium;

        // build mesh
        const mesh = this.fontParser.createTextMesh(
            word,
            this.sizeMedium,
            this.sizeMedium
        );
        const y = this.height / 2 - 4 * this.sizeMargin;
        mesh.position.set(-wordLenght / 2, y, this.depth + 0.001);
        this.meshWind = mesh;

        // add to scene
        this.add(mesh);
    }

    buildVouchers() {
        // define constants
        const word = "Vouchers : " + this.vouchers.toString();
        const wordLenght = word.length * this.sizeMedium;

        // build mesh
        const mesh = this.fontParser.createTextMesh(
            word,
            this.sizeMedium,
            this.sizeMedium
        );
        const y = this.height / 2 - 5 * this.sizeMargin;
        mesh.position.set(-wordLenght / 2, y, this.depth + 0.001);
        this.meshVouchers = mesh;

        // add to scene
        this.add(mesh);
    }

    updateTime(time) {
        if (this.meshTime !== undefined && this.meshTime !== null) {
            this.app.scene.remove(this.meshTime);
            this.remove(this.meshTime);
        }
        this.time = time;
        this.buildTime();
    }

    updateLaps(laps) {
        if (this.meshLaps !== undefined && this.meshLaps !== null) {
            this.app.scene.remove(this.meshLaps);
            this.remove(this.meshLaps);
        }
        this.laps = laps;
        this.buildLaps();
    }

    updateWind(wind) {
        if (this.meshWind !== undefined && this.meshWind !== null) {
            this.app.scene.remove(this.meshWind);
            this.remove(this.meshWind);
        }
        this.wind = wind;
        this.buildWind();
    }

    updateVouchers(vouchers) {
        if (this.meshVouchers !== undefined && this.meshVouchers !== null) {
            this.app.scene.remove(this.meshVouchers);
            this.remove(this.meshVouchers);
        }
        this.vouchers = vouchers;
        this.buildVouchers();
    }
}

MyMenuRun.prototype.isGroup = true;
export { MyMenuRun };
