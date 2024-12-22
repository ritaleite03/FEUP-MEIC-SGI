import * as THREE from 'three';

class MyBallon extends THREE.Object3D {

    constructor(route) {
        
        // variables
        super()
        this.vouchers = 0
        this.route = route

        // materials
        const blue_material = new THREE.MeshLambertMaterial( { color: "#0000ff"} );
        
        // base
        const base = new THREE.BoxGeometry(1, 1, 1)
        const mesh_base = new THREE.Mesh(base, blue_material)
        mesh_base.position.set(0, 0.5, 0)
        
        // top
        const top = new THREE.SphereGeometry(2)
        const mesh_top = new THREE.Mesh(top, blue_material)
        mesh_top.position.set(0, 3, 0)
        
        // combine objects
        const group = new THREE.Group()
        group.add(mesh_base)
        group.add(mesh_top)
        group.position.set(0, -1.5, 0)
        this.add(group)
    }
}

export { MyBallon };