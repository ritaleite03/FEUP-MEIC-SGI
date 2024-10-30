import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

class MyWindow extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Wall length
       @param {number} place Room placa
       @param {number} height Wall height
       @param {number} width Wall width
    */ 
    constructor(width, height, depth, y, z) {
        super()

        // texture and material of the window's landscape
        let landescapeTexture = new THREE.TextureLoader().load('textures/window.jpg');
        landescapeTexture.wrapS = THREE.MirroredRepeatWrapping;
        landescapeTexture.wrapT = THREE.MirroredRepeatWrapping;
        const landescapeMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: landescapeTexture})

        // texture and material of the window's frame and grid
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})

        // add landescape
        let wall = new THREE.PlaneGeometry(width * 2, height * 4);
        this.wallMesh = new THREE.Mesh (wall, landescapeMaterial);
        this.wallMesh.rotateY(Math.PI)
        this.wallMesh.position.set(0, y - 1, z + 5)
        this.add(this.wallMesh);

        let rectLight = new THREE.RectAreaLight( 0xffffff, 10,  width, height);
        rectLight.position.set(0, y, z - 0.1)
        rectLight.lookAt( 0, y, 0);
        this.add(rectLight)

        //const rectLightHelper = new RectAreaLightHelper(rectLight);
        //rectLight.add(rectLightHelper);

        // add grid
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

        // add frame
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