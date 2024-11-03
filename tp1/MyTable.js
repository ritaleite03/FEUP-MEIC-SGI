import * as THREE from 'three';

/**
 * This class contains the representation of a table
 */
class MyTable extends THREE.Object3D {

    /**
     * 
     * @param {number} height height of the leg of the table
     * @param {number} radius radius of the leg of the table
     * @param {number} xLenght width of the table
     * @param {number} zLenght lenght of the table
     */
    constructor(height, radius, xLenght, zLenght) {
        super();
        this.type = 'Group';

        // variables
        const x = xLenght / 2 - radius * 2; // position of the leg in Ox
        const z = zLenght / 2 - radius * 2; // position of the leg in Oz

        // texture and material
        let texture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;

        const topMaterial = new THREE.MeshLambertMaterial({map: texture});
        const legsMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 100});

        // geometries (leg and top)
        const leg = new THREE.CylinderGeometry( radius, radius, height ); 
        const top = new THREE.BoxGeometry(xLenght, radius, zLenght); 

        // add leg
        const legMesh1 = new THREE.Mesh( leg, legsMaterial );
        const legMesh2 = new THREE.Mesh( leg, legsMaterial );
        const legMesh3 = new THREE.Mesh( leg, legsMaterial );
        const legMesh4 = new THREE.Mesh( leg, legsMaterial );
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
        const topMesh = new THREE.Mesh( top, topMaterial );
        topMesh.position.y = height;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        this.add(topMesh);
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };