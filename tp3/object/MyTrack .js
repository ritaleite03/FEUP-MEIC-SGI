import * as THREE from "three";

class MyTrack extends THREE.Object3D {
    /**
     *
     * @param {*} app
     * @param {*} points
     */
    constructor(app, points) {
        // define attributes
        super();
        this.app = app;
        this.points = points;
        this.segments = 300;
        this.width = 1;
        this.textureRepeat = 50;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = true;
        this.path = new THREE.CatmullRomCurve3(points);
        this.object = null;

        this.widthS = 10;
        this.heightS = 0.2;

        // define texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load("./image/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        // define material
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(this.textureRepeat, 3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        // build object
        this.buildObject();
        this.buildSideSelector();
    }

    /**
     * Called to build two objects the select side of the track that the player wants to use
     */
    buildSideSelector() {
        // define geometry and materials
        const geometryS = new THREE.SphereGeometry(3);
        const materialA = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const materialB = new THREE.MeshBasicMaterial({ color: "#ffffff" });

        // build meshes
        this.selectorA = new THREE.Mesh(geometryS, materialA);
        this.selectorB = new THREE.Mesh(geometryS, materialB);
        this.selectorA.name = "side_1";
        this.selectorB.name = "side_2";

        const posX = -this.points[0].x * this.widthS;
        const posY = this.points[0].y * this.heightS;
        const posZ = this.points[0].z * this.widthS;

        this.selectorA.position.set(posX - 5, posY + 3, posZ);
        this.selectorB.position.set(posX + 5, posY + 3, posZ);

        this.app.scene.add(this.selectorA);
        this.app.scene.add(this.selectorB);
    }

    /**
     * Called to build the track
     */
    buildObject() {
        // define geometry
        const geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            3,
            this.closedCurve
        );

        // define mesh, wireframe and line
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        // build object
        this.object = new THREE.Group();
        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;
        this.object.add(this.mesh);
        this.object.add(this.wireframe);
        this.object.add(this.line);
        this.object.rotateZ(Math.PI);
        this.object.scale.set(this.widthS, this.heightS, this.widthS);
    }

    /**
     * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
     */
    updateCurve() {
        if (this.object !== undefined && this.object !== null) {
            this.app.scene.remove(this.object);
        }
        this.buildObject();
        this.app.scene.add(this.object);
    }

    /**
     * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
     */
    updateCurveClosing() {
        if (this.object !== undefined && this.object !== null) {
            this.app.scene.remove(this.object);
        }
        this.buildObject();
        this.app.scene.add(this.object);
    }

    /**
     * Called when user changes number of texture repeats in UI. Updates the repeat vector for the curve's texture.
     * @param {number} value - repeat value in S (or U) provided by user
     */
    updateTextureRepeat(value) {
        this.material.map.repeat.set(value, 3);
    }

    /**
     * Called when user changes line visibility. Shows/hides line object.
     */
    updateLineVisibility() {
        this.line.visible = this.showLine;
    }

    /**
     * Called when user changes wireframe visibility. Shows/hides wireframe object.
     */
    updateWireframeVisibility() {
        this.wireframe.visible = this.showWireframe;
    }

    /**
     * Called when user changes mesh visibility. Shows/hides mesh object.
     */
    updateMeshVisibility() {
        this.mesh.visible = this.showMesh;
    }

    /**
     * Called to detect collision between track and the shadow of the ballon
     * @param {THREE.Vector3Like} position position of the center of the shadow of the ballon
     * @param {Number} radius radius of shadow of the ballon
     * @returns
     */
    colision(position, radius) {
        const samples = 1000;
        const distMax = radius + this.width * this.widthS;
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            if (this.path.getPointAt(t).distanceTo(position) <= distMax)
                return true;
        }
        return false;
    }
}

export { MyTrack };
