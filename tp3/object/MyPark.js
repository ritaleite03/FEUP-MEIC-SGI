import * as THREE from "three";
import { MyBallon } from "./MyBallon.js";

class MyPark extends THREE.Object3D {
    constructor(app, name) {
        // define attributes
        super();
        this.ballons = [
            new MyBallon(name + "_1"),
            new MyBallon(name + "_2"),
            new MyBallon(name + "_3"),
            new MyBallon(name + "_4"),
        ];

        for (let i = 0; i < 4; i++) {
            this.ballons[i].position.set(5 * i, 0, 0);
            this.ballons[i].layers.enable(name);
            this.add(this.ballons[i]);
        }
    }
}

MyPark.prototype.isGroup = true;
export { MyPark };
