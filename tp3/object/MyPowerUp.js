import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {

    constructor() {
        super()
        const green_material = new THREE.MeshLambertMaterial( { color: "#00ff00"} );
        const object = new THREE.BoxGeometry(2, 2, 2)
        const mesh = new THREE.Mesh(object, green_material)
        this.add(mesh)
    }
}

export { MyPowerUp };