import * as THREE from 'three';
/**
 * MyTriangle
 * @constructor
 * @param x1 - x coordinate vertex 1
 * @param y1 - y coordinate vertex 1
 * @param z1 - y coordinate vertex 1
 * @param x2 - x coordinate vertex 2
 * @param y2 - y coordinate vertex 2
 * @param z2 - y coordinate vertex 2
 * @param x3 - x coordinate vertex 3
 * @param y3 - y coordinate vertex 3
 * @param z3 - y coordinate vertex 3
 * @param afs - afs texture coordinate
 * @param aft - aft texture coordinate
 */
class MyTriangle extends THREE.BufferGeometry {
	constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, afs = 1, aft = 1) {
		super();
		this.afs = afs
		this.aft = aft
        this.p1 = new THREE.Vector3(x1, y1, z1)
		this.p2 = new THREE.Vector3(x2, y2, z2)
		this.p3 = new THREE.Vector3(x3, y3, z3)
        this.initBuffers();
	}

	initBuffers() {

        //CALCULATING NORMALS 
        const vectorAx = this.p2.x - this.p1.x
		const vectorAy = this.p2.y - this.p1.y
		const vectorAz = this.p2.z - this.p1.z

		const vectorBx = this.p3.x - this.p1.x
		const vectorBy = this.p3.y - this.p1.y
		const vectorBz = this.p3.z - this.p1.z

		const crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		const crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		const crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy
		
		const normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
        normal.normalize()

        //TEXTURE COORDINATES
		const a = this.p2.distanceTo(this.p3);
		const b = this.p1.distanceTo(this.p3);
		const c = this.p1.distanceTo(this.p2);

		const cos_alpha = (b * b + c * c - a * a ) / (2 * b * c)
		const sin_alpha = Math.sqrt(1 - cos_alpha * cos_alpha)
		const vertices = new Float32Array( [...this.p1.toArray(),...this.p2.toArray(),...this.p3.toArray()] );
		const indices = [0, 1, 2];
		
		const normals = [...normal.toArray(),...normal.toArray(),...normal.toArray(),];
		const uvs = [0, 0, a / this.afs , 0, c * cos_alpha / this.afs, c * sin_alpha / this.aft]

        this.setIndex( indices );
        this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        this.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2));
	}

	update_uv(afs, aft) {

		this.afs = afs
		this.aft = aft
		
		const a = this.p2.distanceTo(this.p3);
		const b = this.p1.distanceTo(this.p3);
		const c = this.p1.distanceTo(this.p2);

		const cos_alpha = (b * b + c * c - a * a ) / (2 * b * c)
		const sin_alpha = Math.sqrt(1 - cos_alpha * cos_alpha)

		const uvs = [0, 0, a / this.afs , 0, c * cos_alpha / this.afs, c * sin_alpha / this.aft]
        this.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2));
	}
}

export { MyTriangle };