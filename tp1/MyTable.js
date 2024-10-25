import * as THREE from 'three';
import { MyApp } from './MyApp.js';

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
        this.app = app;

        // variables
        const x = xLenght / 2 - radius; // position of the leg in Ox
        const z = zLenght / 2 - radius; // position of the leg in Oz

        // texture and material
        let texture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(xLenght, zLenght);
        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texture});

        // geometries (leg and top)
        const leg = new THREE.CylinderGeometry( radius, radius, height ); 
        const top = new THREE.BoxGeometry(xLenght, radius, zLenght); 

        // add leg
        const legMesh1 = new THREE.Mesh( leg, material );
        const legMesh2 = new THREE.Mesh( leg, material );
        const legMesh3 = new THREE.Mesh( leg, material );
        const legMesh4 = new THREE.Mesh( leg, material );
        legMesh1.position.set( +x, height / 2, +z );
        legMesh2.position.set( -x, height / 2, +z );
        legMesh3.position.set( +x, height / 2, -z );
        legMesh4.position.set( -x, height / 2, -z );
        legMesh1.castShadow = true;
        legMesh1.receiveShadow = true;
        legMesh2.castShadow = true;
        legMesh2.receiveShadow = true;
        legMesh3.castShadow = true;
        legMesh3.receiveShadow = true;
        legMesh4.castShadow = true;
        legMesh4.receiveShadow = true;
        this.add( legMesh1 );
        this.add( legMesh2 );
        this.add( legMesh3 );
        this.add( legMesh4 );

        // add top
        const topMesh = new THREE.Mesh( top, material );
        topMesh.position.y = height;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        this.add(topMesh);
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };