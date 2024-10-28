import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a picture frame
 */
class MyDoor extends THREE.Object3D {

    /**
     * @param {MyApp} app the application object
     * @param {number} width picture width
     * @param {number} length picture length
     * @param {number} frameWidth frame width
     * @param {texture} picture picture texture
     */
    constructor(app, width, height, depth, texture) {
        super();
        this.app = app;
        this.type = "Group";

        const frameWidth = width * 0.05;
        const frameDepth = depth * 1.2;


        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texture});

        const molduraR = new THREE.BoxGeometry(frameDepth, height - frameWidth, frameWidth);
        const molduraRMesh = new THREE.Mesh(molduraR, material);
        molduraRMesh.position.z = width * 0.475;

        const molduraL = new THREE.BoxGeometry(frameDepth, height - frameWidth, frameWidth);
        const molduraLMesh = new THREE.Mesh(molduraL, material);
        molduraLMesh.position.z = - width * 0.475;

        const molduraTop = new THREE.BoxGeometry(frameDepth, frameWidth, width);
        const molduraTopMesh = new THREE.Mesh(molduraTop, material);
        molduraTopMesh.position.y = height * 0.50;

        const door = new THREE.BoxGeometry(depth * 0.5, height - frameWidth, width * 0.9);
        const doorMesh = new THREE.Mesh(door, material);
        doorMesh.position.x = - depth * 0.3;

        const plane = new THREE.PlaneGeometry(width, depth);
        const planeMesh = new THREE.Mesh(plane, material);
        planeMesh.rotateZ(Math.PI/2);
        planeMesh.rotateY(Math.PI/2);
        planeMesh.position.y = - (height - frameWidth) * 0.5;
        this.add(planeMesh);

        this.add(molduraRMesh);
        this.add(molduraLMesh);
        this.add(molduraTopMesh);
        this.add(doorMesh);  

        const handleMaterial= new THREE.MeshStandardMaterial({
            color: "#A0A0A0",
            metalness: 0.8,
            roughness: 0.2,
        });

        const handle = new THREE.Group()

        const handleRadio = height * 0.005; //0.04

        const geometry1 = new THREE.CylinderGeometry( handleRadio * 3, handleRadio * 3, handleRadio, 20);
        const cylinder1 = new THREE.Mesh( geometry1, handleMaterial );
        cylinder1.position.y = handleRadio * 0.5;
        handle.add(cylinder1);

        const geometry2 = new THREE.CylinderGeometry( handleRadio * 0.75, handleRadio * 0.75, handleRadio * 6, 20); 
        const cylinder2 = new THREE.Mesh( geometry2, handleMaterial );
        cylinder2.position.y = handleRadio * 3.5;
        handle.add(cylinder2);

        const geometry3 = new THREE.CylinderGeometry(handleRadio, handleRadio, handleRadio * 15, 20); 
        const cylinder3 = new THREE.Mesh( geometry3, handleMaterial );
        cylinder3.rotateX(Math.PI/2);
        cylinder3.position.y = handleRadio * 5.0;
        cylinder3.position.z = handleRadio * 6.0;
        handle.add(cylinder3);
        
        handle.rotateZ(Math.PI/2);
        handle.position.z = - width * 0.4;
        handle.position.x = - depth * 0.55;
        this.add(handle)

        this.position.y = (height - frameWidth) * 0.5;
    }
}

MyDoor.prototype.isGroup = true;

export { MyDoor };