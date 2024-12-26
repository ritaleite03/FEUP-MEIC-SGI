import * as THREE from "three";

class MyBallon extends THREE.Object3D {
    constructor(name, route) {
        // variables
        super();
        this.vouchers = 0;
        this.route = route;
        this.state = "park";

        // materials
        const blue_material = new THREE.MeshLambertMaterial({
            color: "#0000ff",
        });

        // base
        const base = new THREE.BoxGeometry(1, 1, 1);
        const mesh_base = new THREE.Mesh(base, blue_material);
        mesh_base.position.set(0, 0.5, 0);
        mesh_base.name = name;

        // top
        const top = new THREE.SphereGeometry(2);
        const mesh_top = new THREE.Mesh(top, blue_material);
        mesh_top.position.set(0, 3, 0);
        mesh_top.name = name;

        // combine objects
        const group = new THREE.Group();
        group.add(mesh_base);
        group.add(mesh_top);
        group.position.set(0, -1.5, 0);
        this.add(group);
    }

    moveUp() {
        this.position.y += 1;
    }

    moveDown() {
        this.position.y = this.position.y - 1 > 0 ? this.position.y - 1 : 0;
    }

    moveWind(n, s, e, w) {
        console.log(n, s, e, w);
        const posY = this.position.y;
        // layer 1 - North
        if (posY > 10 && posY <= 20) this.position.z -= 1 * n;
        // layer 2 - South
        if (posY > 20 && posY <= 30) this.position.z += 1 * s;
        // layer 3 - East
        if (posY > 30 && posY <= 40) this.position.x += 1 * e;
        // layer 4 - West
        if (posY > 40 && posY <= 50) this.position.x -= 1 * w;
    }
}

export { MyBallon };
