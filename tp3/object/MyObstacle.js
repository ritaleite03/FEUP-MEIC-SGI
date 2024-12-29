import * as THREE from "three";

class MyObstacle extends THREE.Object3D {
    constructor() {
        super();
        this.activated = true;

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

    async desactivate(penalty) {
        this.activated = false;
        await this.sleep(penalty * 1000 + 10000);
        this.activated = true;
    }

    /**
     * Called to make the function wait for n seconds
     * @param {Number} ms
     * @returns
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

MyObstacle.prototype.isGroup = true;

export { MyObstacle };
