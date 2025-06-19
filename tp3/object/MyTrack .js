import * as THREE from "three";

/**
 * This class contains the representation of the track
 */
class MyTrack extends THREE.Object3D {
    /**
     *
     * @param {MyApp} app application object
     * @param {Array} points points of the path
     */
    constructor(app, points) {
        // define attributes
        super();
        this.app = app;
        this.points = points;
        this.segments = 300;
        this.width = 20;
        this.textureRepeat = 10;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = true;
        this.path = new THREE.CatmullRomCurve3(points, true);
        this.object = null;

        this.widthS = 5;
        this.heightS = 0.2;

        // define texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load("./image/road.jpg");
        texture.rotation = Math.PI / 2;
        texture.center.set(0.5, 0.5);

        // define material
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(this.textureRepeat, 1);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        // finish line
        this.finish = null;
        this.p1 = null;
        this.p2 = null;

        // build object
        this.buildObject();
        this.buildSideSelector();
    }

    /**
     * Called to build two objects the select side of the track that the player wants to use
     */
    buildSideSelector() {
        let trackPt = this.path.getPointAt(0).clone();
        trackPt.x = trackPt.x; //* this.widthS;
        trackPt.y = trackPt.y; //* this.widthS;
        trackPt.z = trackPt.z; //* this.widthS;

        const trackTg = this.path.getTangentAt(0).normalize();

        const trackUp = new THREE.Vector3(0, 1, 0);
        const trackFL = new THREE.Vector3()
            .crossVectors(new THREE.Vector3(trackTg.x, 0, trackTg.z), trackUp)
            .normalize();

        const p1 = trackPt.clone().add(trackFL.clone().multiplyScalar(5));
        const p2 = trackPt.clone().add(trackFL.clone().multiplyScalar(-5));

        // define geometry and materials
        const geometryS = new THREE.SphereGeometry(1);
        const materialA = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const materialB = new THREE.MeshBasicMaterial({ color: "#ffffff" });

        // build meshes
        this.selectorA = new THREE.Mesh(geometryS, materialA);
        this.selectorB = new THREE.Mesh(geometryS, materialB);
        this.selectorA.name = "side_1";
        this.selectorB.name = "side_2";

        this.selectorA.position.set(p1.x, trackPt.y * this.heightS + 1, p1.z);
        this.selectorB.position.set(p2.x, trackPt.y * this.heightS + 1, p2.z);

        this.app.scene.add(this.selectorA);
        this.app.scene.add(this.selectorB);

        this.finish = trackFL;
        this.p1 = p1;
        this.p2 = p2;
    }

    /**
     * Called to build the track
     */
    buildObject() {
        // define geometry
        //const geometry = new THREE.TubeGeometry(
        //    this.path,
        //    this.segments,
        //    this.width,
        //    3,
        //    this.closedCurve
        //);

        //// define mesh, wireframe and line
        //this.mesh = new THREE.Mesh(geometry, this.material);
        //this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
        //let points = this.path.getPoints(this.segments);
        //let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        //this.line = new THREE.Line(bGeometry, this.lineMaterial);

        //// build object
        this.object = new THREE.Group();

        //this.mesh.visible = this.showMesh;
        //this.wireframe.visible = this.showWireframe;
        //this.line.visible = this.showLine;
        //this.object.add(this.mesh);
        //this.object.add(this.wireframe);
        //this.object.add(this.line);
        //this.object.rotateZ(Math.PI);
        //this.object.scale.set(this.widthS, this.heightS, this.widthS);

        //Track
        const L = this.width;
        const up = new THREE.Vector3(0, 1, 0);
        const leftPoints = [];
        const rightPoints = [];

        const points = this.path.getPoints(this.segments);

        for (let i = 0; i < points.length; i++) {
            const t = i / (points.length - 1);
            const tangent = this.path.getTangent(t).normalize();
            const normal = new THREE.Vector3()
                .crossVectors(up, tangent)
                .normalize();
            const left = points[i]
                .clone()
                .add(normal.clone().multiplyScalar(L / 2));
            const right = points[i]
                .clone()
                .add(normal.clone().multiplyScalar(-L / 2));

            leftPoints.push(left);
            rightPoints.push(right);
        }

        const vertices = [];
        const indices = [];
        const uvs = [];

        let totalLength = 0;
        let lengths = [0];
        for (let i = 1; i < points.length; i++) {
            const dist = points[i - 1].distanceTo(points[i]);
            totalLength += dist;
            lengths.push(totalLength);
        }

        for (let i = 0; i < leftPoints.length - 1; i++) {
            vertices.push(
                leftPoints[i].x,
                leftPoints[i].y,
                leftPoints[i].z,
                points[i].x,
                points[i].y,
                points[i].z,
                rightPoints[i].x,
                rightPoints[i].y,
                rightPoints[i].z,
                leftPoints[i + 1].x,
                leftPoints[i + 1].y,
                leftPoints[i + 1].z,
                points[i + 1].x,
                points[i + 1].y,
                points[i + 1].z,
                rightPoints[i + 1].x,
                rightPoints[i + 1].y,
                rightPoints[i + 1].z
            );

            const baseIndex = i * 6;

            //left
            indices.push(baseIndex, baseIndex + 1, baseIndex + 3);
            indices.push(baseIndex + 1, baseIndex + 4, baseIndex + 3);

            //right
            indices.push(baseIndex + 1, baseIndex + 2, baseIndex + 4);
            indices.push(baseIndex + 2, baseIndex + 5, baseIndex + 4);

            const v1 = lengths[i] / totalLength;
            const v2 = lengths[i + 1] / totalLength;

            uvs.push(0, v1, 0.5, v1, 1, v1, 0, v2, 0.5, v2, 1, v2);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.translateY(0.1);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        const bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.line = new THREE.Line(bGeometry, this.lineMaterial);
        this.line.translateY(0.2);

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;
        this.object.add(this.mesh);
        this.object.add(this.wireframe);
        this.object.add(this.line);
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
        this.material.map.repeat.set(value, 1);
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
}

export { MyTrack };
