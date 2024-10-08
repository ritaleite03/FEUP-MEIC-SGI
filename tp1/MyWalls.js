import * as THREE from 'three';
import { MyWall } from './MyWall.js';

class MyWalls extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Room length
       @param {number} widthRoom Room width
       @param {number} height Walls height
       @param {number} widthWall Walls width
    */ 
    constructor(app, widthRoom, length, height, widthWall) {
        super();
        this.app = app
        this.type = 'Group';

        // Right wall
        this.wallA = new MyWall(app, length, widthRoom, height * 0.2, widthWall);
        this.wallA.position.y = height * 0.8;
        this.add(this.wallA);

        this.wallB = new MyWall(app, length * 0.5, widthRoom, height * 0.8, widthWall);
        this.wallB.position.z = -length * 0.5 * 0.5;
        this.add(this.wallB);

        this.wallC = new MyWall(app, length * 0.2, widthRoom, height * 0.8, widthWall);
        this.wallC.position.z = length * 0.8 * 0.5;
        this.add(this.wallC);

        // Back wall
        this.wallBackA = new MyWall(app, widthRoom, length, height * 0.2, widthWall);
        this.wallBackA.rotateY(Math.PI/2);
        this.wallBackA.position.y = height * 0.8;
        this.add(this.wallBackA);

        this.wallBackB = new MyWall(app, widthRoom, length, height * 0.4, widthWall);
        this.wallBackB.rotateY(Math.PI/2);
        this.add(this.wallBackB);

        let gap = widthRoom * 0.8 * 0.5;
        this.wallBackC = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallBackC.rotateY(Math.PI/2);
        this.wallBackC.position.x = -gap;
        this.add(this.wallBackC);

        this.wallBackD = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallBackD.rotateY(Math.PI/2);
        this.wallBackD.position.x = gap;
        this.add(this.wallBackD);

        // Front wall
        this.wall3 = new MyWall(app, length, widthRoom, height, widthWall);
        this.wall3.rotateY(Math.PI)
        this.add(this.wall3);

        // Left wall
        this.wall4 = new MyWall(app, widthRoom, length, height, widthWall);
        this.wall4.rotateY(3*Math.PI/2)
        this.add(this.wall4);
    }

}

MyWalls.prototype.isGroup = true;

export { MyWalls };