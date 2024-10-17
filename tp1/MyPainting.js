import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of the leg of a table
 */
class MyPainting extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the leg 
     * @param {number} radius the radius of the leg
     * @param {number} x position of the leg on the axis Ox
     * @param {number} z position of the leg on the axis Oy
     */
    constructor(app, x, y, z) {
        super();
        let scale = 0.2
        z += 0.01

        // draw Beetle
        app.initCubicBezierCurve([new THREE.Vector3(x - 3 * scale, y, z), new THREE.Vector3(x - 3 * scale, y + 4 * scale, z), new THREE.Vector3(x + 3 * scale, y + 4 * scale, z), new THREE.Vector3(x + 3 * scale, y , z)], new THREE.Vector3(x + 3 * scale, y, z))
        app.initCubicBezierCurve([new THREE.Vector3(x - 3 * scale, y, z), new THREE.Vector3(x - 3 * scale, y + 4 * scale, z), new THREE.Vector3(x + 3 * scale, y + 4 * scale, z), new THREE.Vector3(x + 3 * scale, y , z)], new THREE.Vector3(x + 13 * scale, y, z))  
        app.initCubicBezierCurve([new THREE.Vector3(x, y, z), new THREE.Vector3(x, y + 4 / 3 * (Math.sqrt(2) - 1) * 8 * scale, z), new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 8 * scale, y + 8 * scale, z), new THREE.Vector3(x + 8 * scale, y + 8 * scale, z)],new THREE.Vector3(x, y, z))
        app.initCubicBezierCurve([new THREE.Vector3(x, y + 4 * scale, z), new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, y + 4 * scale, z), new THREE.Vector3(x + 4 * scale, y + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, z), new THREE.Vector3(x + 4 * scale, y, z)], new THREE.Vector3(x + 8 * scale, y + 4 * scale, z))
        app.initCubicBezierCurve([new THREE.Vector3(x, y + 4 * scale, z), new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, y + 4 * scale, z), new THREE.Vector3(x + 4 * scale, y + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, z), new THREE.Vector3(x + 4 * scale, y, z)], new THREE.Vector3(x + 12 * scale, y, z))
        
        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0})
        const background = new THREE.PlaneGeometry(25 * scale, 15 * scale)
        const backgroundMesh = new THREE.Mesh(background, material); 
        backgroundMesh.position.set(x * 4, y * 2.5, z * 2 - 0.01);
        this.add(backgroundMesh);
    }


}

export { MyPainting };