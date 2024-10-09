import * as THREE from 'three';

class MyWall extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Wall length
       @param {number} place Room placa
       @param {number} height Wall height
       @param {number} width Wall width
    */ 
    constructor(app, length, place, height, width) {
        super()
        this.app = app

        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
            specular: "#000000", emissive: "#000000", shininess: 90 })
        let wall = new THREE.BoxGeometry(width, height, length);

        this.wallMesh = new THREE.Mesh (wall, boxMaterial);
        
        this.wallMesh.position.y = height/2;
        this.wallMesh.position.x = place/2 + width/2;
        this.add(this.wallMesh);
    }

}

export { MyWall };