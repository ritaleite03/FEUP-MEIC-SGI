import * as THREE from "three";
import { MyShader } from "./../MyShader.js";

/**
 * This class contains the representation of the obstacle
 */
class MyObstacle extends THREE.Object3D {
    /**
     *
     */
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
            new URL("../shaders/obstacle.vert", import.meta.url).href,
            new URL("../shaders/obstacle.frag", import.meta.url).href,
            this.uniformValues
        );
        this.geometry = new THREE.BoxGeometry(2, 2, 2);
        this.mesh = null;
        this.boundingBox = [2, 2, 2];

        const interval = setInterval(() => {
            if (this.shader.ready) {
                this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
                this.add(this.mesh);
                clearInterval(interval);
            }
        }, 100);
    }

    /**
     * Called to update values of the shader
     * @param {Number} value
     */
    update(value) {
        if (this.shader.ready) {
            this.shader.updateUniformsValue("time", value);
        }
    }

    /**
     * Called to desactivate the obstacle for a specific time
     * @param {Number} penalty duration of the penalty
     */
    async desactivate(penalty) {
        this.activated = false;
        await this.sleep(penalty * 1000 + 10000);
        this.activated = true;
    }

    /**
     * Called to make the function wait for n seconds
     * @param {Number} ms seconds to wait
     * @returns
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

MyObstacle.prototype.isGroup = true;

export { MyObstacle };
