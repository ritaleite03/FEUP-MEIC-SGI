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

        // variables
        const x = xLenght / 2 - radius; // position of the leg in Ox
        const z = zLenght / 2 - radius; // position of the leg in Oz

        // texture and material of the top
        let topTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        topTexture.wrapS = THREE.MirroredRepeatWrapping;
        topTexture.wrapT = THREE.MirroredRepeatWrapping;
        //topTexture.rotation = Math.PI / 2;
        topTexture.repeat.set(xLenght, zLenght);
        const topMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: topTexture})

        // add legs
        this.add(
            new MyLeg(app, height, radius, x, z),
            new MyLeg(app, height, radius, -x, z),
            new MyLeg(app, height, radius, x, -z),
            new MyLeg(app, height, radius, -x, -z)
        )

        // add top
        const top = new THREE.BoxGeometry(xLenght, radius, zLenght); 
        const topMesh = new THREE.Mesh(top, topMaterial );
        topMesh.position.y = height;
        this.add(topMesh);
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };