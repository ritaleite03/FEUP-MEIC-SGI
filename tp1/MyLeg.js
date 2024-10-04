import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of the leg of a table
 */
class MyLeg extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the leg 
     * @param {number} radius the radius of the leg
     * @param {number} xPosition position of the leg on the axis Ox
     * @param {number} zPosition position of the leg on the axis Oy
     */
    constructor(app, height, radius, xPosition, zPosition) {
        super();
        this.app = app;
        const leg = new THREE.CylinderGeometry(radius,  radius, height); 
        const legMaterial = new THREE.MeshBasicMaterial( {color: "#1fff77"} );
        const legMesh = new THREE.Mesh(leg, legMaterial ); 
        legMesh.position.set(xPosition, 0, zPosition);
        legMesh.position.y = height / 2
        this.add(legMesh);
    }
}

export { MyLeg };