import * as THREE from "three";

class MyPowerUp extends THREE.Object3D {
    constructor() {
        super();

        // object
        const material = new THREE.MeshBasicMaterial({
            color: "#00ff00",
        });
        const object = new THREE.BoxGeometry(2, 2, 2);
        const mesh = new THREE.Mesh(object, material);
        this.add(mesh);

        // bounding sphere
        mesh.geometry.computeBoundingSphere();
        this.collisionRadius = mesh.geometry.boundingSphere.radius;
    }
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };
