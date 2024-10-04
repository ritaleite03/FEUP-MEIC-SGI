import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyLeg } from './MyLeg.js';

/**
 * This class contains the representation of a table
 */
class MyTable extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height height of the leg of the table
     * @param {number} radius radius of the leg of the table
     * @param {number} xLenght width of the table
     * @param {number} zLenght lenght of the table
     */
    constructor(app, height, radius, xLenght, zLenght) {
        super();
        this.type = 'Group';

        const xPosition = xLenght / 2 - radius;
        const zPosition = zLenght / 2 - radius;

        const leg1 = new MyLeg(app, height, radius, xPosition, zPosition);
        const leg2 = new MyLeg(app, height, radius, -xPosition, zPosition);
        const leg3 = new MyLeg(app, height, radius, xPosition, -zPosition);
        const leg4 = new MyLeg(app, height, radius, -xPosition, -zPosition);

        this.add(leg1);
        this.add(leg2);
        this.add(leg3);
        this.add(leg4);

        const top = new THREE.BoxGeometry(xLenght, 0.1, zLenght); 
        const topMaterial = new THREE.MeshBasicMaterial( {color: "#ffff77"} );
        const topMesh = new THREE.Mesh(top, topMaterial );
        topMesh.position.y = height;
        this.add(topMesh);

    }
}

MyTable.prototype.isGroup = true;

export { MyTable };