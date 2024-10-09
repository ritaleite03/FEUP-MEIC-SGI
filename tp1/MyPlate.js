import * as THREE from 'three';

class MyPlate extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius Plate radius 
       @param {boolean} slice Cake slice
    */ 
    constructor(app, radius, slice) {
        super()
        this.app = app
        this.type = 'Group';

        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", 
            specular: "#000000", emissive: "#000000", shininess: 90 , side: THREE.DoubleSide})
        
        if(slice){
            let top = new THREE.CylinderGeometry(radius * 0.8 , radius * 0.6, 0.03, 36);
            this.topMesh = new THREE.Mesh(top, boxMaterial);
            this.topMesh.position.y =  - 0.015;
            this.add( this.topMesh );
        }
        else {
            let top = new THREE.CylinderGeometry(radius * 1.1 , radius * 1.1, 0.01, 36);
            this.topMesh = new THREE.Mesh(top, boxMaterial);

            let base = new THREE.CylinderGeometry(radius * 0.2 , radius * 0.4, radius * 0.4);
            this.baseMesh = new THREE.Mesh(base, boxMaterial);
            this.baseMesh.position.y =  - radius * 0.2 - 0.005;

            this.add( this.topMesh );
            this.add( this.baseMesh );
        }
    }

}

MyPlate.prototype.isGroup = true;

export { MyPlate };