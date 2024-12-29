import * as THREE from "three";
import { MyShader } from "./../MyShader.js";

class MyObstacle extends THREE.Object3D {
    constructor() {
        super();
        this.activated = true;

        this.uniformValues = {
            time: { value: 0.0 },
            amplitude: { value: 0.5 },
        };

        this.shader = new MyShader(
            null,
            "Obstacle Shader",
            "Shader for pulsating obstacles",
            "./../shaders/obstacle.vert",
            "./../shaders/obstacle.frag",
            this.uniformValues
        );
        this.geometry = new THREE.BoxGeometry(2, 2, 2);
        this.mesh = null;

        const materialTemp = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const meshTemp = new THREE.Mesh(this.geometry, materialTemp);
        meshTemp.geometry.computeBoundingSphere();
        this.collisionRadius = meshTemp.geometry.boundingSphere.radius;

        const interval = setInterval(() => {
            if (this.shader.ready) {
                this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
                this.add(this.mesh);
                clearInterval(interval);
            }
        }, 100);
    }

    update(value) {
        if (this.shader.ready) {
            this.shader.updateUniformsValue("time", value);
        }
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
