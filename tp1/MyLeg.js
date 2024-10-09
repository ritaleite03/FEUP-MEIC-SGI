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
     * @param {number} x position of the leg on the axis Ox
     * @param {number} z position of the leg on the axis Oy
     */
    constructor(app, height, radius, x, z) {
        super();

        // texture and material of the leg
        let texture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.rotation = Math.PI / 2;
        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texture})

        // add leg
        const leg = new THREE.CylinderGeometry(radius,  radius, height); 
        const legMesh = new THREE.Mesh(leg, material ); 
        legMesh.position.set(x, 0, z);
        legMesh.position.y = height / 2
        this.add(legMesh);
    }
}

export { MyLeg };