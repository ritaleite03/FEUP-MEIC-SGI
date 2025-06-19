import * as THREE from 'three';

class MyWindow extends THREE.Object3D {

    /**
       constructs the object
       @param {number} width window's width
       @param {number} height window's height
       @param {number} depth window's depth
       @param {number} y position in Oy
       @param {number} z position in Oz
    */ 
    constructor(width, height, depth, y, z) {
        super()

        // texture and material of the window's frame and grid
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshLambertMaterial({color: "#ffffff", map: woodenTexture})

        // grid
        const gridHorizonal = new THREE.BoxGeometry(depth / 2, width, depth / 2)
        const gridVertical = new THREE.BoxGeometry(depth / 2, height, depth / 2)
        const gap = (width - depth) / 3

        this.gridHorizontalMesh = new THREE.Mesh (gridHorizonal, woodenMaterial);
        this.gridHorizontalMesh.rotateZ(Math.PI/2)
        this.gridHorizontalMesh.position.set(0, y, z - depth / 4)
        this.gridHorizontalMesh.castShadow = true;
        this.gridHorizontalMesh.receiveShadow = true;
        this.add(this.gridHorizontalMesh);

        this.gridVertical1Mesh = new THREE.Mesh (gridVertical, woodenMaterial);
        this.gridVertical1Mesh.position.set(gap / 2, y, z - depth / 4)
        this.gridVertical1Mesh.castShadow = true;
        this.gridVertical1Mesh.receiveShadow = true
        this.add(this.gridVertical1Mesh);

        this.gridVertical2Mesh = new THREE.Mesh (gridVertical, woodenMaterial);
        this.gridVertical2Mesh.position.set(-gap / 2, y, z - depth / 4)
        this.gridVertical2Mesh.castShadow = true;
        this.gridVertical2Mesh.receiveShadow = true
        this.add(this.gridVertical2Mesh);

        // frame
        const frameHorizonal = new THREE.BoxGeometry(depth / 2, width, depth + depth / 2)
        const frameVertical = new THREE.BoxGeometry(depth / 2, height, depth + depth / 2)

        this.frameHorizontal1Mesh = new THREE.Mesh (frameHorizonal, woodenMaterial);
        this.frameHorizontal1Mesh.rotateZ(Math.PI/2)
        this.frameHorizontal1Mesh.position.set(0, y + height / 2 - depth / 4, z - depth / 2 - depth / 4)
        this.frameHorizontal1Mesh.castShadow = true;
        this.frameHorizontal1Mesh.receiveShadow = true;
        this.add(this.frameHorizontal1Mesh);

        this.frameHorizontal2Mesh = new THREE.Mesh (frameHorizonal, woodenMaterial);
        this.frameHorizontal2Mesh.rotateZ(Math.PI/2)
        this.frameHorizontal2Mesh.position.set(0, y - height / 2 + depth / 4, z - depth / 2 - depth / 4)
        this.frameHorizontal2Mesh.castShadow = true;
        this.frameHorizontal2Mesh.receiveShadow = true
        this.add(this.frameHorizontal2Mesh);

        this.frameVertical1Mesh = new THREE.Mesh (frameVertical, woodenMaterial);
        this.frameVertical1Mesh.position.set(width / 2 - depth / 4, y, z - depth / 2 - depth / 4)
        this.frameVertical1Mesh.castShadow = true;
        this.frameVertical1Mesh.receiveShadow = true
        this.add(this.frameVertical1Mesh);

        this.frameVertical2Mesh = new THREE.Mesh (frameVertical, woodenMaterial);
        this.frameVertical2Mesh.position.set(-width / 2 + depth / 4, y, z - depth / 2 - depth / 4)
        this.frameVertical2Mesh.castShadow = true;
        this.frameVertical2Mesh.receiveShadow = true
        this.add(this.frameVertical2Mesh);
    }

}

export { MyWindow };