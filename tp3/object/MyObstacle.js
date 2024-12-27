import * as THREE from "three";

class MyObstacle extends THREE.Object3D {
    constructor() {
        super();

        // object
        const material = new THREE.MeshLambertMaterial({
            color: "#ff0000",
        });
        const object = new THREE.BoxGeometry(2, 2, 2);
        const mesh = new THREE.Mesh(object, material);
        this.add(mesh);

        // bounding sphere
        mesh.geometry.computeBoundingSphere();
        this.collisionRadius = mesh.geometry.boundingSphere.radius;
    }
}

MyObstacle.prototype.isGroup = true;

export { MyObstacle };
