import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {

    constructor() {
        super()
        const red_material = new THREE.MeshLambertMaterial( { color: "#ff0000"} );
        const object = new THREE.BoxGeometry(2, 2, 2)
        const mesh = new THREE.Mesh(object, red_material)
        this.add(mesh)
    }
}

export { MyObstacle };