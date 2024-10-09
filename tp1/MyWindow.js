import * as THREE from 'three';

class MyWindow extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Wall length
       @param {number} place Room placa
       @param {number} height Wall height
       @param {number} width Wall width
    */ 
    constructor( width, height, depth, y, z) {
        super()

        // texture and material of the window
        let texture = new THREE.TextureLoader().load('textures/window.jpg');
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texture})

        // add landescape
        let wall = new THREE.PlaneGeometry(width, height);
        this.wallMesh = new THREE.Mesh (wall, material);
        this.wallMesh.rotateY(Math.PI)
        this.wallMesh.position.set(0, y, z)
        this.add(this.wallMesh);

        // add grid
        const materialGrid = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0})
        const gridHorizonal = new THREE.BoxGeometry(depth / 2, width, depth)
        const gridVertical = new THREE.BoxGeometry(depth / 2, height, depth)
        const gap = (width - depth) / 3

        this.gridHorizontalMesh = new THREE.Mesh (gridHorizonal, materialGrid);
        this.gridHorizontalMesh.rotateZ(Math.PI/2)
        this.gridHorizontalMesh.position.set(0, y, z - depth / 2)
        this.add(this.gridHorizontalMesh);

        this.gridVertical1Mesh = new THREE.Mesh (gridVertical, materialGrid);
        this.gridVertical1Mesh.position.set(gap / 2, y, z - depth / 2)
        this.add(this.gridVertical1Mesh);

        this.gridVertical2Mesh = new THREE.Mesh (gridVertical, materialGrid);
        this.gridVertical2Mesh.position.set(-gap / 2, y, z - depth / 2)
        this.add(this.gridVertical2Mesh);


        
    }

}

export { MyWindow };