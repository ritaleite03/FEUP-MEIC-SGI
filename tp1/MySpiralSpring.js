import * as THREE from 'three';

/**
 * This class contains the representation of a spiral spring
 */
class MySpiralSpring extends THREE.Object3D {

    /**
     * 
     * @param {number} radius spiral's radius
     * @param {number} segments segments of the curve
     * @param {number} height spiral's height
     * @param {number} heightLevel spiral's levels height
     */
    constructor(radius, segments, height, heightLevel) {
        super();
        this.type = 'Group';

        // define constants
        const material = new THREE.MeshStandardMaterial({ color: "#dcdcdc", roughness: 0.2, metalness: 0.7 ,side: THREE.DoubleSide });
        const startSpiral = Math.floor(segments * 0.60);
        const segmentsSpiral = segments * heightLevel + startSpiral * 2;
        const radiusSpiral = 0.1
        const radiusSegmentsSpiral = 25

        // define points of the curve
        let points = [];
        for (let i = 0; i <= segmentsSpiral; i++) {
            const angle = i / segments * Math.PI * 2;
            const x = radius * Math.cos(angle);
            let y;
            if(i <= startSpiral ) {
                y = 0;  // 
            }
            else if (i >= segmentsSpiral - startSpiral) {
                y = height;
            } else {
                const t = (i - startSpiral) / (segmentsSpiral - 2 * startSpiral); 
                y = t * height;
            }
            const z = radius * Math.sin(angle);
            points.push( new THREE.Vector3( x, y, z ) );
        }

        // create spiral
        const spiralCurve = new THREE.CatmullRomCurve3(points);
        const spiral = new THREE.TubeGeometry(spiralCurve, segmentsSpiral, radiusSpiral, radiusSegmentsSpiral, false);
        const mesh = new THREE.Mesh(spiral, material);
        mesh.position.y = 0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        // create caps
        const cap = new THREE.CircleGeometry(radiusSpiral, radiusSegmentsSpiral);
        const capMesh1 = new THREE.Mesh(cap, material);
        const capMesh2 = new THREE.Mesh(cap, material);

        capMesh1.position.copy(points[0]);
        capMesh2.position.copy(points[points.length - 1]);
        capMesh1.position.y += 0.1;
        capMesh2.position.y += 0.1;
  
        const tangentStart = spiralCurve.getTangent(0).normalize();
        const tangentEnd = spiralCurve.getTangent(1).normalize();
        const up = new THREE.Vector3(0, 0, 1);  
        capMesh1.quaternion.setFromUnitVectors(up, tangentStart);
        capMesh2.quaternion.setFromUnitVectors(up, tangentEnd);

        this.add(capMesh1);
        this.add(capMesh2);
    }
}

MySpiralSpring.prototype.isGroup = true;
export { MySpiralSpring };
