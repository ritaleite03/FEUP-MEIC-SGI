import * as THREE from "three";
import { MyShader } from "./../MyShader.js";

class MyPowerUp extends THREE.Object3D {
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

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };
