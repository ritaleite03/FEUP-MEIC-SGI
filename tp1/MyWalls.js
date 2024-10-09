import * as THREE from 'three';
import { MyWall } from './MyWall.js';
import { MyWindow } from './MyWindow.js';

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
        this.wall2 = new MyWall(app, widthRoom, length, height, widthWall);
        this.wall2.rotateY(Math.PI/2)
        this.add(this.wall2);

        // Left wall
        this.wall3 = new MyWall(app, length, widthRoom, height, widthWall);
        this.wall3.rotateY(Math.PI)
        this.add(this.wall3);

        // Front wall
        this.wallFrontA = new MyWall(app, widthRoom, length, height * 0.2, widthWall);
        this.wallFrontA.rotateY(3*Math.PI/2);
        this.wallFrontA.position.y = height * 0.8;
        this.add(this.wallFrontA);

        this.wallFrontB = new MyWall(app, widthRoom, length, height * 0.4, widthWall);
        this.wallFrontB.rotateY(3*Math.PI/2);
        this.add(this.wallFrontB);

        let gap = widthRoom * 0.8 * 0.5;
        this.wallFrontC = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallFrontC.rotateY(3*Math.PI/2);
        this.wallFrontC.position.x = -gap;
        this.add(this.wallFrontC);

        this.wallFrontD = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallFrontD.rotateY(3*Math.PI/2);
        this.wallFrontD.position.x = gap;
        this.add(this.wallFrontD);

        this.window = new MyWindow(widthRoom * 0.6, height * 0.4, widthWall, height * 0.4 + height * 0.2, length * 0.5 + widthWall)
        this.add(this.window)
    }

}

MyWalls.prototype.isGroup = true;

export { MyWalls };