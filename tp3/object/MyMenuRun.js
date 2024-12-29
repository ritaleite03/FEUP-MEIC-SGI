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

        this.sM = 10;
        this.sB = 6;
        this.sS = 4;

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
        this.buildTime();
        this.buildLaps();
        this.buildWind();
        this.buildVouchers();
    }

    /**
     * Called to build title of the game on the screen
     */
    buildTitle() {
        const title = "BALLONS RACE";
        const mesh = this.fontParser.createTextMesh(title, this.sB, this.sB);
        const x = -(title.length * this.sB) / 2;
        const y = this.height / 2 - this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildTime() {
        const word = "ELAPSED TIME : " + this.time.toString();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 3 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.meshTime = mesh;
        this.add(mesh);
    }

    buildLaps() {
        const word = "LAPS : " + this.laps.toString();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 5 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.meshLaps = mesh;
        this.add(mesh);
    }

    buildWind() {
        const word = "WIND : " + this.wind.toUpperCase();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 7 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.meshWind = mesh;
        this.add(mesh);
    }

    buildVouchers() {
        const word = "VOUCHERS : " + this.vouchers.toString();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 9 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.meshVouchers = mesh;
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
