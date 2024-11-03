import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a spiral spring
 */
class MySpiralSpring extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius spiral's radius
     * @param {number} segments segments of the curve
     * @param {number} height spiral's height
     * @param {number} heightLevel spiral's levels height
     */
    constructor(app, radius, segments, height, heightLevel) {
        super();
        this.type = 'Group';

        // define constants
        const material = new THREE.MeshStandardMaterial({ color: "#b0b0b0", roughness: 0.2, metalness:0.9 ,side: THREE.DoubleSide });
        const segmentsSpiral = segments * heightLevel
        const radiusSpiral = 0.1
        const radiusSegmentsSpiral = 25

        // define points of the curve
        let points = [];
        for (let i = 0; i <= segmentsSpiral; i++) {
            const angle = i / segments * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = height * i / segmentsSpiral;
            const z = radius * Math.sin(angle);
            points.push( new THREE.Vector3( x, y, z ) );
        }

        // create spiral
        const spiralCurve = new THREE.CatmullRomCurve3(points);
        const spiral = new THREE.TubeGeometry(spiralCurve, segmentsSpiral, radiusSpiral, radiusSegmentsSpiral, false);
        const mesh = new THREE.Mesh(spiral, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        // create caps
        const cap = new THREE.CircleGeometry(radiusSpiral, radiusSegmentsSpiral);
        const capMesh1 = new THREE.Mesh(cap, material);
        const capMesh2 = new THREE.Mesh(cap, material);
        capMesh1.position.x = points[0].x;
        capMesh2.position.x = points[points.length-1].x;
        capMesh1.position.y = 0;
        capMesh2.position.y = height;
        this.add(capMesh1);
        this.add(capMesh2);
    }
}

MySpiralSpring.prototype.isGroup = true;
export { MySpiralSpring };
