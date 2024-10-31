import * as THREE from 'three';
import { MyApp } from './MyApp.js';

class MyDoor extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width door's width
     * @param {number} height door's height
     * @param {number} depth door's depth
     */
    constructor(app, width, height, depth) {
        super()
        this.app = app

        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})
        
        const whiteMaterial = new THREE.MeshPhongMaterial( {color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20} )
        const glassMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, transparent: true, opacity: 0.5})

        // variables

        const widthFrame = width * 0.2
        const widthGlass = width * 0.8
        const heightGlass = height - width * 0.4
        const depthHandle = 0.1
        const heightHandleDoor = 0.3
        const heightHandleHand = 0.5

        // geometries

        const doorVertical = new THREE.BoxGeometry( widthFrame, height, depth )
        const doorHorizontal = new THREE.BoxGeometry( widthFrame, widthGlass, depth )
        const doorGlass = new THREE.BoxGeometry( widthGlass, heightGlass, depth / 2 )
        const handleDoor = new THREE.BoxGeometry( depthHandle, heightHandleDoor, depthHandle )
        const handleHand = new THREE.BoxGeometry( depthHandle, heightHandleHand, depthHandle )
        const handleCircle = new THREE.CylinderGeometry( 0.2, 0.2, 0.05)

        // meshes

        // frame

        const doorVertical1Mesh = new THREE.Mesh( doorVertical, woodenMaterial )
        doorVertical1Mesh.position.set( widthFrame / 2, height / 2, 0 )
        this.add( doorVertical1Mesh )

        const doorVertical2Mesh = new THREE.Mesh( doorVertical, woodenMaterial )
        doorVertical2Mesh.position.set( widthGlass + widthFrame, height / 2, 0 )
        this.add( doorVertical2Mesh )

        const doorHorizontal1Mesh = new THREE.Mesh( doorHorizontal, woodenMaterial )
        doorHorizontal1Mesh.rotateZ( Math.PI / 2 )
        doorHorizontal1Mesh.position.set( widthGlass / 2 + widthFrame, height - widthFrame / 2, 0 )
        this.add( doorHorizontal1Mesh )

        const doorHorizontal2Mesh = new THREE.Mesh( doorHorizontal, woodenMaterial )
        doorHorizontal2Mesh.rotateZ( Math.PI / 2 )
        doorHorizontal2Mesh.position.set( widthGlass / 2 + widthFrame, widthFrame / 2, 0 )
        this.add( doorHorizontal2Mesh )

        // glass

        const doorGlassMesh = new THREE.Mesh( doorGlass, glassMaterial )
        doorGlassMesh.position.set( widthFrame + widthGlass / 2, height / 2, 0 )
        this.add( doorGlassMesh )

        // handle interior

        const handleCircle1Mesh = new THREE.Mesh( handleCircle, whiteMaterial )
        handleCircle1Mesh.rotateX( Math.PI / 2 )
        handleCircle1Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, -depth / 2)
        this.add( handleCircle1Mesh )

        const handleDoor1Mesh = new THREE.Mesh( handleDoor, whiteMaterial )
        handleDoor1Mesh.rotateX( Math.PI / 2 )
        handleDoor1Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, -depth / 2 - heightHandleDoor / 2 )
        this.add( handleDoor1Mesh )

        const handleHand1Mesh = new THREE.Mesh( handleHand, whiteMaterial )
        handleHand1Mesh.rotateX( Math.PI / 2 )
        handleHand1Mesh.rotateZ( Math.PI / 2 )
        handleHand1Mesh.position.set( widthFrame + widthGlass - heightHandleHand / 2 + depthHandle / 2, depthHandle / 2 + height / 2, -depth / 2 - depthHandle / 2 - heightHandleDoor )
        this.add( handleHand1Mesh )

        // handle exterior

        const handleCircle2Mesh = new THREE.Mesh( handleCircle, whiteMaterial )
        handleCircle2Mesh.rotateX( Math.PI / 2 )
        handleCircle2Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, depth / 2)
        this.add( handleCircle2Mesh )

        const handleDoor2Mesh = new THREE.Mesh( handleDoor, whiteMaterial )
        handleDoor2Mesh.rotateX( Math.PI / 2 )
        handleDoor2Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, depth / 2 + heightHandleDoor / 2 )
        this.add( handleDoor2Mesh )

        const handleHand2Mesh = new THREE.Mesh( handleHand, whiteMaterial )
        handleHand2Mesh.rotateX( Math.PI / 2 )
        handleHand2Mesh.rotateZ( Math.PI / 2 )
        handleHand2Mesh.position.set( widthFrame + widthGlass - heightHandleHand / 2 + depthHandle / 2, depthHandle / 2 + height / 2, depth / 2 + depthHandle / 2 + heightHandleDoor )
        this.add( handleHand2Mesh )


    }

}


/**
 * This class contains the representation of a picture frame
 */
//class MyDoor extends THREE.Object3D {
//
//    /**
//     * @param {MyApp} app the application object
//     * @param {number} width picture width
//     * @param {number} length picture length
//     * @param {number} frameWidth frame width
//     * @param {texture} picture picture texture
//     */
//    constructor(app, width, height, depth, texture) {
//        super();
//        this.app = app;
//        this.type = "Group";
//
//        const frameWidth = width * 0.05;
//        const frameDepth = depth * 1.4;
//
//        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texture});
//
//        const molduraR = new THREE.BoxGeometry(frameDepth, height - frameWidth, frameWidth);
//        const molduraRMesh = new THREE.Mesh(molduraR, material);
//        molduraRMesh.position.z = width * 0.475;
//
//        const molduraL = new THREE.BoxGeometry(frameDepth, height - frameWidth, frameWidth);
//        const molduraLMesh = new THREE.Mesh(molduraL, material);
//        molduraLMesh.position.z = - width * 0.475;
//
//        const molduraTop = new THREE.BoxGeometry(frameDepth, frameWidth, width);
//        const molduraTopMesh = new THREE.Mesh(molduraTop, material);
//        molduraTopMesh.position.y = height * 0.50;
//
//        const door = new THREE.BoxGeometry(depth * 0.5, height - frameWidth, width * 0.9);
//        const doorMesh = new THREE.Mesh(door, material);
//        doorMesh.position.x = - depth * 0.3;
//
//        const plane = new THREE.PlaneGeometry(width, depth);
//        const planeMesh = new THREE.Mesh(plane, material);
//        planeMesh.rotateZ(Math.PI/2);
//        planeMesh.rotateY(Math.PI/2);
//        planeMesh.position.y = - (height - frameWidth) * 0.5;
//        this.add(planeMesh);
//
//        this.add(molduraRMesh);
//        this.add(molduraLMesh);
//        this.add(molduraTopMesh);
//        this.add(doorMesh);  
//
//        const handleMaterial= new THREE.MeshStandardMaterial({
//            color: "#A0A0A0",
//            metalness: 0.8,
//            roughness: 0.2,
//        });
//
//        const handle = new THREE.Group()
//
//        const handleRadio = height * 0.005; //0.04
//
//        const geometry1 = new THREE.CylinderGeometry( handleRadio * 3, handleRadio * 3, handleRadio, 20);
//        const cylinder1 = new THREE.Mesh( geometry1, handleMaterial );
//        cylinder1.position.y = handleRadio * 0.5;
//        handle.add(cylinder1);
//
//        const geometry2 = new THREE.CylinderGeometry( handleRadio * 0.75, handleRadio * 0.75, handleRadio * 6, 20); 
//        const cylinder2 = new THREE.Mesh( geometry2, handleMaterial );
//        cylinder2.position.y = handleRadio * 3.5;
//        handle.add(cylinder2);
//
//        const geometry3 = new THREE.CylinderGeometry(handleRadio, handleRadio, handleRadio * 15, 20); 
//        const cylinder3 = new THREE.Mesh( geometry3, handleMaterial );
//        cylinder3.rotateX(Math.PI/2);
//        cylinder3.position.y = handleRadio * 5.0;
//        cylinder3.position.z = handleRadio * 6.0;
//        handle.add(cylinder3);
//        
//        handle.rotateZ(Math.PI/2);
//        handle.position.z = - width * 0.4;
//        handle.position.x = - depth * 0.55;
//        this.add(handle)
//
//        const hinge1 = new THREE.Mesh( geometry3, handleMaterial);
//        hinge1.position.set(- depth * 0.60, -0.35*height, width * 0.45);
//        this.add(hinge1)
//
//        const hinge2 = new THREE.Mesh( geometry3, handleMaterial);
//        hinge2.position.set(- depth * 0.60, 0, width * 0.45);
//        this.add(hinge2)
//
//        const hinge3 = new THREE.Mesh( geometry3, handleMaterial);
//        hinge3.position.set(- depth * 0.60, 0.35*height, width * 0.45);
//        this.add(hinge3)
//
//        this.position.y = (height - frameWidth) * 0.5;
//    }
//}
//
MyDoor.prototype.isGroup = true;
//
export { MyDoor };