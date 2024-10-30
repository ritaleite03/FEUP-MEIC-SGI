import * as THREE from 'three';

class MyWall extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Wall length
       @param {number} place Displacement relative to the center
       @param {number} height Wall height
       @param {number} width Wall width
    */ 
    constructor(app, length, place, height, width) {
        super()
        this.app = app

        let material = new THREE.MeshLambertMaterial({ color: "#78866b"});

        //Create a wall
        let wall = new THREE.BoxGeometry(width, height, length);
        this.wallMesh = new THREE.Mesh (wall, material);
        this.wallMesh.position.y = height/2;
        this.wallMesh.position.x = place/2 + width/2;
        this.wallMesh.receiveShadow = true
        this.wallMesh.castShadow = true
        this.add(this.wallMesh);
    }

}

export { MyWall };