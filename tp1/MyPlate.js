import * as THREE from 'three';

class MyPlate extends THREE.Object3D {

    /**
       constructs the object
       @param {number} radius plate radius 
       @param {boolean} slice cake slice
    */ 
    constructor(radius, slice) {
        super()
        this.type = 'Group';

        const material = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#aaaaaa", emissive: "#000000", shininess: 90})
        
        if(slice){
            // Simple plate
            const plate = new THREE.CylinderGeometry(radius * 0.8 , radius * 0.6, 0.03, 36);
            const plateMesh = new THREE.Mesh(plate, material);
            plateMesh.castShadow = true;
            plateMesh.receiveShadow = true;
            plateMesh.position.y =  - 0.015;
            this.add( plateMesh );
        }
        else {
            // Cake stand
            const top = new THREE.CylinderGeometry(radius * 1.1 , radius * 1.1, 0.01, 36);
            const topMesh = new THREE.Mesh(top, material);
            topMesh.castShadow = true;
            topMesh.receiveShadow = true;
            
            const base = new THREE.CylinderGeometry(radius * 0.2 , radius * 0.4, radius * 0.4);
            const baseMesh = new THREE.Mesh(base, material);
            baseMesh.castShadow = true;
            baseMesh.receiveShadow = true;
            baseMesh.position.y =  - radius * 0.2 - 0.005;

            this.add( topMesh );
            this.add( baseMesh );
        }
    }

}

MyPlate.prototype.isGroup = true;

export { MyPlate };