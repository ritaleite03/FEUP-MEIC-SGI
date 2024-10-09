import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';

class MyCake extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius Bottom Cake radius 
       @param {number} height Tier height
       @param {number} angleLength 
       @param {boolean} slice Cake slice (default false)
       @param {number} tiers Number of tiers (default 1)
       @param {number} tiers Top tier radius (default radius)

    */ 
    constructor(app, radius, height, angleLength, slice = false, tiers = 1,  radiusLast = radius) {
        super()
        this.app = app
        this.type = 'Group';

        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
            specular: "#000000", emissive: "#000000", shininess: 90 })

        
        let startAngle = 0;
        let gapAngle = 2*Math.PI - angleLength + startAngle;
        let diff = (radius - radiusLast)/tiers;

        for(let i = 0; i < tiers; i++){
            if(i === tiers - 1){
                let segments = (angleLength * 36) / (2* Math.PI); 
                let cake = new THREE.CylinderGeometry(radiusLast, radiusLast, height, segments, 1, false, startAngle, angleLength);
                let cakeMesh = new THREE.Mesh(cake, boxMaterial);
                cakeMesh.position.y = height * i;  
                this.add(cakeMesh);

                let insideCake = new THREE.PlaneGeometry( radiusLast, height);
                let insideMesh1 = new THREE.Mesh(insideCake, boxMaterial);
                let rotateAngle1 = startAngle - Math.PI/2;
                insideMesh1.rotateY(rotateAngle1);
                insideMesh1.position.x= 0.5 * Math.cos(rotateAngle1) * radiusLast;
                insideMesh1.position.z= -0.5 * Math.sin(rotateAngle1) * radiusLast;
                insideMesh1.position.y = height * i; 

                let insideMesh2 = new THREE.Mesh( insideCake, boxMaterial);
                let rotateAngle2 = Math.PI/2 - gapAngle;
                insideMesh2.rotateY(rotateAngle2);
                insideMesh2.position.x= -0.5 * Math.cos(rotateAngle2) * radiusLast;
                insideMesh2.position.z= 0.5 * Math.sin(rotateAngle2) * radiusLast;
                insideMesh2.position.y = height * i; 

                this.add( insideMesh1);
                this.add( insideMesh2 );
            }
            else{
                let r = radius - i * diff;
                let cake = new THREE.CylinderGeometry(r, r, height, 36, 1);
                let cakeMesh = new THREE.Mesh(cake, boxMaterial);
                cakeMesh.position.y = height * i;  
                this.add(cakeMesh);
                
            }
        }

        this.plate = new MyPlate(app, radius, slice);
        this.plate.position.y =  -height/2;
        if(slice){
            let place = startAngle + angleLength/2;
            this.plate.position.x =  0.5 * Math.sin(place) * radius;
            this.plate.position.z=  0.5 * Math.cos(place) * radius;
        }

        this.add(this.plate);

    }

}

MyCake.prototype.isGroup = true;

export { MyCake };