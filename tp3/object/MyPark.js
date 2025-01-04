import * as THREE from "three";
import { MyBallon } from "./MyBallon.js";
import { MyBillboard } from "./MyBillboard.js";
import { MyMenuBallon } from "./MyMenuBallon.js";

class MyPark extends THREE.Object3D {
    /**
     *
     * @param {*} app
     * @param {*} name
     */
    constructor(app, name, ballons) {
        // define attributes
        super();
        this.app = app;
        const sizeF = 50;
        const heightL = 20;
        const radiusL = 0.3;

        // texture
        const loader = new THREE.TextureLoader();
        const textureF = loader.load("./image/concrete.jpg");
        textureF.wrapS = THREE.RepeatWrapping;

        // material
        const materialF = new THREE.MeshBasicMaterial({ map: textureF });
        materialF.wrapS = THREE.MirroredRepeatWrapping;
        materialF.wrapT = THREE.MirroredRepeatWrapping;

        this.ballons = [];
        for (const i in ballons) {
            const index = (Number(i) + 1).toString();
            const color = ballons[i].color;
            this.ballons.push(new MyBallon(app, name + "_" + index, color));
        }

        this.ballonsP = [
            {
                x: -this.ballons[0].boundingBox[0],
                z: -this.ballons[0].boundingBox[0],
            },
            {
                x: -this.ballons[0].boundingBox[0],
                z: this.ballons[0].boundingBox[0],
            },
            {
                x: this.ballons[0].boundingBox[0],
                z: -this.ballons[0].boundingBox[0],
            },
            {
                x: this.ballons[0].boundingBox[0],
                z: this.ballons[0].boundingBox[0],
            },
        ];

        this.lampsP = [
            { x: sizeF / 2, z: sizeF / 2 },
            { x: sizeF / 2, z: -sizeF / 2 },
            { x: -sizeF / 2, z: sizeF / 2 },
            { x: -sizeF / 2, z: -sizeF / 2 },
        ];

        // build ballons
        for (let i = 0; i < 4; i++) {
            const x = this.ballonsP[i].x;
            const z = this.ballonsP[i].z;
            this.ballons[i].position.set(x, 2.5, z);
            this.ballons[i].layers.enable(name);
            this.add(this.ballons[i]);
        }

        // build lights
        for (let i = 0; i < 4; i++) {
            const lamp = new MyParkLamp(app, heightL, radiusL);
            const x = this.lampsP[i].x;
            const z = this.lampsP[i].z;
            lamp.position.set(x, heightL / 2, z);
            this.add(lamp);
        }

        // build floor
        const geometry = new THREE.BoxGeometry(sizeF, 1, sizeF);
        const mesh = new THREE.Mesh(geometry, materialF);
        mesh.position.set(0, 0.5, 0);
        this.add(mesh);

        const display = new MyBillboard(app, new MyMenuBallon(this.app, name));
        display.position.set(-sizeF / 2, 0, 0);
        this.add(display);
    }
}

MyPark.prototype.isGroup = true;
export { MyPark };

class MyParkLamp extends THREE.Object3D {
    /**
     *
     * @param {*} app
     * @param {*} height
     * @param {*} radius
     */
    constructor(app, height, radius) {
        super();
        this.app = app;
        const radiusL = radius / 2;
        const heightL = height / 8;
        const widthB = heightL / 2;
        const depthB = radius * 2;
        const heightB = heightL / 2;

        const material = new THREE.MeshStandardMaterial({
            color: "#808080",
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x000000,
            emissiveIntensity: 0.1,
        });

        const geometryP = new THREE.CylinderGeometry(radius, radius, height);
        const geometryL = new THREE.CylinderGeometry(radiusL, radiusL, heightL);
        const geometryB = new THREE.BoxGeometry(heightB, widthB, depthB);

        const meshP = new THREE.Mesh(geometryP, material);

        for (let i = 1; i <= 3; i++) {
            const groupOut = new THREE.Group();
            const groupIn = new THREE.Group();

            const meshL = new THREE.Mesh(geometryL, material);
            const meshB = new THREE.Mesh(geometryB, material);
            meshB.position.set(0, heightL / 2, 0);

            groupIn.add(meshL);
            groupIn.add(meshB);

            groupIn.rotateX(Math.PI / 2);
            groupIn.position.set(0, 0, heightL / 2);

            groupOut.add(groupIn);
            groupOut.rotateY((i * (2 * Math.PI)) / 3);
            groupOut.position.set(0, height / 2, 0);

            this.add(groupOut);
        }

        this.add(meshP);
    }
}

MyParkLamp.prototype.isGroup = true;
