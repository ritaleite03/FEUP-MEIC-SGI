import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a flame
 */
class MyFlame extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius radius of the flame's base
     * @param {number} height height of the flame
     * @param {number} x position of the flame on Ox
     * @param {number} y position of the flame on Oy
     * @param {number} z position of the flame on Oz
     * @param {number} segments number of segments for construction
     */
    constructor(app, radius, height, x, y, z, segments) {
        super();
        this.type = 'Group';
        const heightCone = height - radius // height of the cone
        const ySphere = y + radius // position of the sphere on Oy
        const yCone = ySphere + heightCone / 2 // position of the cone on Oy

        const sphere = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI , 0, Math.PI)
        const sphereMaterial = new THREE.MeshBasicMaterial( {color: "#e6b449",side: THREE.DoubleSide} );
        const sphereMesh = new THREE.Mesh(sphere, sphereMaterial );
        sphereMesh.position.set(x, ySphere, z);
        sphereMesh.rotation.x = Math.PI/2
        this.add(sphereMesh);

        const cone = new THREE.ConeGeometry(radius, heightCone, segments, segments, false)
        const coneMaterial = new THREE.MeshBasicMaterial( {color: "#e6b449"} );
        const coneMesh = new THREE.Mesh(cone, coneMaterial);
        coneMesh.position.set(x, yCone, z);
        this.add(coneMesh); 
    }
}

MyFlame.prototype.isGroup = true;

export { MyFlame };