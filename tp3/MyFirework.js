import * as THREE from "three";

class MyFirework {
    constructor(app, scene, vertices, s_color) {
        this.app = app;
        this.scene = scene;

        this.done = false;
        this.dest = [];

        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;

        this.material = new THREE.PointsMaterial({
            size: 0.5,
            color: s_color,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });

        this.height = 50;
        this.speed = 20;
        this.time = Date.now();

        this.vV = null;
        this.vP = null;

        this.launch(vertices);
    }

    /**
     * compute particle launch
     */

    launch(vertices) {
        let color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);
        let colors = [color.r, color.g, color.b];

        let x = THREE.MathUtils.randFloat(-5, 5);
        let y = THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.1);
        let z = THREE.MathUtils.randFloat(-5, 5);

        let vx = THREE.MathUtils.randFloat(-20, 20);
        let vy = THREE.MathUtils.randFloat(50, 80);
        let vz = THREE.MathUtils.randFloat(-20, 20);
        let t = THREE.MathUtils.randFloat(1, 5);

        const xf = vertices[0] + vx * t;
        const yf = vertices[1] + vy * t + 0.5 * -9.8 * t * t;
        const zf = vertices[2] + vz * t;

        this.vV = [vx, vy, vz];
        this.vP = [vertices[0], vertices[1], vertices[2]];

        this.dest.push(xf, yf, zf);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(vertices), 3)
        );
        this.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
        );
        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);
    }

    explode(origin, n, rangeBegin, rangeEnd) {
        let vertices = [];
        let destination = [];

        const phiStep = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < n; i++) {
            let phi = Math.acos(1 - (2 * (i + 1)) / n);
            let theta = phiStep * i;

            let xO = rangeBegin * Math.sin(phi) * Math.cos(theta) + origin[0];
            let yO = rangeBegin * Math.sin(phi) * Math.sin(theta) + origin[1];
            let zO = rangeBegin * Math.cos(phi) + origin[2];

            let xD = rangeEnd * Math.sin(phi) * Math.cos(theta) + origin[0];
            let yD = rangeEnd * Math.sin(phi) * Math.sin(theta) + origin[1];
            let zD = rangeEnd * Math.cos(phi) + origin[2];

            vertices.push(xO, yO, zO);
            destination.push(xD, yD, zD);
        }

        this.dest = destination;
        this.app.scene.remove(this.points);

        let color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);
        let colors = new Array(n).fill([color.r, color.g, color.b]).flat();

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(vertices), 3)
        );
        this.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
        );

        this.points = new THREE.Points(this.geometry, this.material);
        this.app.scene.add(this.points);
    }

    /**
     * cleanup
     */
    reset() {
        this.app.scene.remove(this.points);
        this.dest = [];
        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;
    }

    /**
     * update firework
     * @returns
     */
    update() {
        // do only if objects exist
        if (this.points && this.geometry) {
            let verticesAtribute = this.geometry.getAttribute("position");
            let vertices = verticesAtribute.array;
            let count = verticesAtribute.count;

            // lerp particle positions
            let j = 0;
            const timeNow = Date.now();
            const t = (timeNow - this.time) / 1000;
            for (let i = 0; i < vertices.length; i += 3) {
                if (vertices.length === 3) {
                    vertices[i] = this.vP[0] + this.vV[0] * t;
                    vertices[i + 1] = this.vP[1] + this.vV[1] * t - 4.9 * t * t;
                    vertices[i + 2] = this.vP[2] + this.vV[2] * t;
                } else {
                    vertices[i] += (this.dest[i] - vertices[i]) / this.speed;
                    vertices[i + 1] +=
                        (this.dest[i + 1] - vertices[i + 1]) / this.speed;
                    vertices[i + 2] +=
                        (this.dest[i + 2] - vertices[i + 2]) / this.speed;
                }
            }
            verticesAtribute.needsUpdate = true;
            //this.time = timeNow;

            // only one particle?
            if (count === 1) {
                //is YY coordinate higher close to destination YY?
                if (Math.ceil(vertices[1]) > this.dest[1] * 0.95) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(
                        vertices,
                        40,
                        this.height * 0.05,
                        this.height * 0.4
                    );
                    return;
                }
            }

            // are there a lot of particles (aka already exploded)?
            if (count > 1) {
                // fade out exploded particles
                this.material.opacity -= 0.015;
                this.material.needsUpdate = true;
            }

            // remove, reset and stop animating
            if (this.material.opacity <= 0) {
                this.reset();
                this.done = true;
                return;
            }
        }
    }
}

export { MyFirework };
