import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

class MyCake extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app the application object
       @param {number} radius bottom Cake radius 
       @param {number} height tier height
       @param {number} angleLength topTier's angle
       @param {boolean} slice cake slice (default false)
       @param {number} tiers number of tiers (default 1)
       @param {number} tiers top tier radius (default radius)

    */ 
    constructor(app, radius, height, angleLength, slice = false, tiers = 1,  radiusLast = radius) {
        super()
        this.app = app
        this.type = 'Group';

        // Candle dimension
        const radiusStick = 0.02 * radius;
        const radiusFlame = 0.05 * radius;
        const heightStick = 0.2 * radius;
        const heightFlame = 0.15 * radius;
        
        const outsideCakeTexture = new THREE.TextureLoader().load('textures/outside_cake.jpg');
        outsideCakeTexture.wrapS = THREE.MirroredRepeatWrapping;
        outsideCakeTexture.wrapT = THREE.MirroredRepeatWrapping;
        const insideCakeTexture = new THREE.TextureLoader().load('textures/inside_cake.jpg');
        const outsideCakeMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", emissive: "#000000", shininess: 0, map: outsideCakeTexture})
        const insideCakeMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", emissive: "#000000", shininess: 0, map: insideCakeTexture})
        
        let startAngle = 0; // Start cake angle
        let endAngle = angleLength + startAngle; //End cake angle
        let gapTier = (radius - radiusLast)/tiers; //radius gap between tiers

        for(let i = 0; i < tiers; i++){
            if(i === tiers - 1){
                let segments = Math.floor(angleLength * 36) / (2* Math.PI); //Number of the cylinder's segments

                // Create a cylinder 
                let cake = new THREE.CylinderGeometry(radiusLast, radiusLast, height, segments, 1, false, startAngle, angleLength);
                let cakeMesh = new THREE.Mesh(cake, outsideCakeMaterial);
                cakeMesh.castShadow = true;
                cakeMesh.receiveShadow = true;
                cakeMesh.position.y = height * i;  
                this.add(cakeMesh);

                // Create the plans for the inside of the cake
                let insideCake = new THREE.PlaneGeometry( radiusLast, height);
                let insideMesh1 = new THREE.Mesh(insideCake, insideCakeMaterial);
                insideMesh1.castShadow = true;
                insideMesh1.receiveShadow = true;
                let rotateAngle1 = startAngle - Math.PI/2;
                insideMesh1.rotateY(rotateAngle1);
                insideMesh1.position.x= 0.5 * Math.cos(rotateAngle1) * radiusLast;
                insideMesh1.position.z= -0.5 * Math.sin(rotateAngle1) * radiusLast;
                insideMesh1.position.y = height * i; 

                let insideMesh2 = new THREE.Mesh( insideCake, insideCakeMaterial);
                insideMesh2.castShadow = true;
                insideMesh2.receiveShadow = true;
                let rotateAngle2 = endAngle + Math.PI/2;
                insideMesh2.rotateY(rotateAngle2);
                insideMesh2.position.x= -0.5 * Math.cos(rotateAngle2) * radiusLast;
                insideMesh2.position.z= 0.5 * Math.sin(rotateAngle2) * radiusLast;
                insideMesh2.position.y = height * i; 

                this.add( insideMesh1 );
                this.add( insideMesh2 );

                if(!slice){
                    let nCandles = Math.round((angleLength * 9) / (2* Math.PI));
                    let candleGap = angleLength/nCandles;
                    let startGap = candleGap/2 + startAngle;

                    for (let j = 0; j < nCandles; j++ ){
                        let angle = startGap + j * candleGap;
                        let x = Math.sin(angle) * radiusLast * 0.7;
                        let z = Math.cos(angle) * radiusLast * 0.7;
                        let candle = new MyCandle(app, radiusStick, radiusFlame, heightStick, heightFlame,x,height * (i + 0.5),z)
                        this.add(candle)
                    }
                }
            }
            else{
                let r = radius - i * gapTier;

                // create complete cake tier
                let cake = new THREE.CylinderGeometry(r, r, height, 36, 1);
                let cakeMesh = new THREE.Mesh(cake, outsideCakeMaterial);
                cakeMesh.castShadow = true;
                cakeMesh.receiveShadow = true;
                cakeMesh.position.y = height * i;  
                this.add(cakeMesh);
                
            }
        }

        // create plate
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