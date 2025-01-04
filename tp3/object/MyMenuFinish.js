import * as THREE from "three";
import { MyFont } from "../parser/MyFont.js";

class MyMenuFinish extends THREE.Object3D {
    /**
     *
     * @param {*} app
     */
    constructor(app, winner, loser, time, draw) {
        // variables
        super();
        this.app = app;
        this.height = 100;
        this.width = 100;
        this.depth = 0.5;

        this.sM = 10;
        this.sB = 6;
        this.sS = 4;

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
        this.add(mesh);

        this.buildTitle();
        if (draw === false) {
            this.buildWinner(winner);
            this.buildLoser(loser);
        } else {
            this.buildDraw();
        }
        this.buildTime(time);
        this.buildHomeButton();
        this.buildRestartButton();
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

    buildTime(time) {
        const word = "TIME SPENT : " + time.toString();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 3 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildWinner(winner) {
        const word = "WINNER : " + winner.toUpperCase();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 5 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildLoser(loser) {
        const word = "LOSER : " + loser.toUpperCase();
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 7 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildDraw() {
        const word = "THERE WAS A DRAW";
        const mesh = this.fontParser.createTextMesh(word, this.sS, this.sS);
        const x = -this.width / 2 + this.sS;
        const y = this.height / 2 - 5 * this.sB;
        mesh.position.set(x, y, this.depth + 0.001);
        this.add(mesh);
    }

    buildHomeButton() {
        const word = "HOME";
        const mesh = this.fontParser.createTextMesh(word, this.sB, this.sB);
        const x = -(word.length * this.sB) / 2;
        const y = -this.height / 2 + 2 * this.sB;
        mesh.name = "homeButton";
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
        geoMesh.name = "homeButton";
        geoMesh.position.set(-this.sB / 2, y, this.depth + 0.025);

        this.add(geoMesh);
    }

    buildRestartButton() {
        const word = "RESTART";
        const mesh = this.fontParser.createTextMesh(word, this.sB, this.sB);
        const x = -(word.length * this.sB) / 2;
        const y = -this.height / 2 + 4 * this.sB;
        mesh.name = "restartButton";
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
        geoMesh.name = "restartButton";
        geoMesh.position.set(-this.sB / 2, y, this.depth + 0.025);

        this.add(geoMesh);
    }
}

MyMenuFinish.prototype.isGroup = true;
export { MyMenuFinish };
