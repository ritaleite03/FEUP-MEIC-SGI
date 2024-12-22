import * as THREE from 'three';

class MyRoute extends THREE.Object3D {

    constructor(control_points) {
        const curve = new THREE.CatmullRomCurve3(control_points);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: "#ffffff" } );
        const curveObject = new THREE.Line( geometry, material );
        this.add(curveObject)
    }
}

export { MyRoute };