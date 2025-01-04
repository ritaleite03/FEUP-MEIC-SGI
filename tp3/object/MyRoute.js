import * as THREE from 'three';

class MyRoute extends THREE.Object3D {

    constructor(keyframes) {
        super();
        this.keyframes = keyframes;
        this.route = new THREE.CatmullRomCurve3(keyframes, true);
        
    }

    debugRoute() {
        const points = this.route.getPoints(200);
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: "#0000ff" } );
        const curveObject = new THREE.Line( geometry, material );
        this.add(curveObject)

        const pointMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });
        const pointGeometry = new THREE.SphereGeometry(0.5);

        this.keyframes.forEach(point => {
            const sphere = new THREE.Mesh(pointGeometry, pointMaterial);
            sphere.position.copy(point);
            this.add(sphere);
        });
    

        return this;
    }
}

export { MyRoute };