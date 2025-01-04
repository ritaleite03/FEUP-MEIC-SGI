import * as THREE from "three";
import { MyShader } from "./../MyShader.js";

/**
 * This class contains the representation of the power up
 */
class MyPowerUp extends THREE.Object3D {
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
            "PowerUp Shader",
            "Shader for pulsating power-ups",
            "./../shaders/powerup.vert",
            "./../shaders/powerup.frag",
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
     * Update values of the shader
     * @param {Number} value
     */
    update(value) {
        if (this.shader.ready) {
            this.shader.updateUniformsValue("time", value);
        }
    }

    /**
     * Called to desactivate the power up for a specific time
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

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };
