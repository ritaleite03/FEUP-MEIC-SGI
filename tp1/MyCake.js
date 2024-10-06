import * as THREE from 'three';

class MyCake extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius radius 
       @param {number} height height
       @param {number} angleLength 
    */ 
    constructor(app, radius, height, angleLength) {
        super()
        this.app = app

        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
            specular: "#000000", emissive: "#000000", shininess: 90 })

        
        let startAngle = 0;
        let gapAngle = 2*Math.PI - angleLength + startAngle;

        let cake = new THREE.CylinderGeometry(radius, radius, height, 36, 1, false, startAngle, angleLength);
        this.cakeMesh = new THREE.Mesh(cake, boxMaterial);
        this.add(this.cakeMesh);

        let insideCake = new THREE.PlaneGeometry( radius, height);
        this.insideMesh1 = new THREE.Mesh(insideCake, boxMaterial);
        let rotateAngle1 = startAngle - Math.PI/2;
        this.insideMesh1.rotateY(rotateAngle1);
        this.insideMesh1.position.x= 0.5 * Math.cos(rotateAngle1);
        this.insideMesh1.position.z= -0.5 * Math.sin(rotateAngle1);

        this.insideMesh2 = new THREE.Mesh( insideCake, boxMaterial);
        let rotateAngle2 = Math.PI/2 - gapAngle;
        this.insideMesh2.rotateY(rotateAngle2);
        this.insideMesh2.position.x= -0.5 * Math.cos(rotateAngle2);
        this.insideMesh2.position.z= 0.5 * Math.sin(rotateAngle2);

        this.add( this.insideMesh1);
        this.add( this.insideMesh2 );

    }

}

MyCake.prototype.isGroup = true;

export { MyCake };