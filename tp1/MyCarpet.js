import * as THREE from 'three';


class MyCarpet extends THREE.Object3D {

    /**
    * @param {MyApp} app the application object
    * @param {number} length carpet length 
    * @param {number} width carpet width  
    * @param {texture} patternTexture carpet pattern texture
    * @param {texture} releveTexture carpet releve texture
    */ 
    constructor(app, length, width, patternTexture, releveTexture) {
        super()
        this.app = app;

        const pattern = patternTexture.clone();
        pattern.wrapS = THREE.MirroredRepeatWrapping;
        pattern.wrapT = THREE.MirroredRepeatWrapping;
        pattern.repeat.set(4,4)

        const releve = releveTexture.clone();
        releve.wrapS = THREE.MirroredRepeatWrapping;
        releve.wrapT = THREE.MirroredRepeatWrapping;
        releve.repeat.set(4,4)

        const material = new THREE.MeshStandardMaterial({ color: "#ffffff", map:pattern,  bumpMap:releve, roughness: 0.3}); // normalMap

        const carpet = new THREE.PlaneGeometry(length, width);
        const carpetMesh = new THREE.Mesh(carpet, material);
        carpetMesh.rotateX(-Math.PI/2)
        carpetMesh.position.y = 0.01;
        carpetMesh.receiveShadow = true;

        this.add(carpetMesh)

    }

}


export { MyCarpet };