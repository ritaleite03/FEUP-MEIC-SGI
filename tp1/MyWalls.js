import * as THREE from 'three';
import { MyWall } from './MyWall.js';
import { MyWindow } from './MyWindow.js';
import { MyBeetle } from './MyBeetle.js';
import { MyDoor } from './MyDoor.js';

class MyWalls extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} lengthRoom Room length
       @param {number} widthRoom Room width
       @param {number} height Walls height
       @param {number} widthWall Walls width
    */ 
    constructor(app, lengthRoom, widthRoom, height, widthWall) {
        super();
        this.app = app
        this.type = 'Group';
        
        // texture and material of the wall's skirting board
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})
                
        // Right wall

        const wallRightA = new MyWall( app, widthRoom, lengthRoom, height * 0.2, widthWall );
        wallRightA.position.y = height * 0.8;
        this.add( wallRightA );

        const wallRightB = new MyWall( app, widthRoom * 0.5, lengthRoom, height * 0.8, widthWall );
        wallRightB.position.z = -widthRoom * 0.5 * 0.5;
        this.add( wallRightB );

        const wallRightC = new MyWall( app, widthRoom * 0.3, lengthRoom, height * 0.8, widthWall );
        wallRightC.position.z = widthRoom * 0.7 * 0.5;
        this.add( wallRightC );

        // Back wall

        const wallBack = new MyWall(app, lengthRoom, widthRoom, height, widthWall);
        wallBack.rotateY(Math.PI/2)
        this.add(wallBack);
       
        const beetlePainting = new MyBeetle( app, 0, height * 0.8, - widthRoom / 2 )
        this.add( beetlePainting );

        // Left wall

        const wallLeft = new MyWall( app, widthRoom, lengthRoom, height, widthWall );
        wallLeft.rotateY( Math.PI )
        this.add( wallLeft );

        // Front wall

        const wallFrontA = new MyWall( app, lengthRoom, widthRoom, height * 0.2, widthWall );
        wallFrontA.rotateY( 3 * Math.PI / 2 );
        wallFrontA.position.y = height * 0.8;
        this.add( wallFrontA );

        const wallFrontB = new MyWall( app, lengthRoom, widthRoom, height * 0.4, widthWall );
        wallFrontB.rotateY( 3 * Math.PI / 2 );
        this.add( wallFrontB );

        let gap = lengthRoom * 0.8 * 0.5;
        const wallFrontC = new MyWall( app, lengthRoom * 0.2, widthRoom, height, widthWall );
        wallFrontC.rotateY( 3 * Math.PI / 2 );
        wallFrontC.position.x = -gap;
        this.add( wallFrontC );

        const wallFrontD = new MyWall( app, lengthRoom * 0.2, widthRoom, height, widthWall );
        wallFrontD.rotateY( 3 * Math.PI / 2 );
        wallFrontD.position.x = gap;
        this.add( wallFrontD );

        const window = new MyWindow( lengthRoom * 0.6, height * 0.4, widthWall, height * 0.4 + height * 0.2, widthRoom * 0.5 + widthWall )
        this.add( window )

        // skirting board

        const skirtingBoardFront = new THREE.BoxGeometry( widthWall / 2, lengthRoom, widthWall / 2 )
        const skirtingBoardLateral1 = new THREE.BoxGeometry( widthWall / 2, widthRoom, widthWall / 2 )
        const skirtingBoardLateral2 = new THREE.BoxGeometry( widthWall / 2, widthRoom * 0.5, widthWall / 2 )
        const skirtingBoardLateral3 = new THREE.BoxGeometry( widthWall / 2, widthRoom * 0.3, widthWall / 2 )
        const skirtingBoardDoorLateral = new THREE.BoxGeometry( widthWall / 2, height * 0.8, widthWall / 2)
        const skirtingBoardDoorTop = new THREE.BoxGeometry( widthWall / 2, widthRoom * 0.2, widthWall / 2)

        const skirtingBoardFront1Mesh = new THREE.Mesh( skirtingBoardFront, woodenMaterial );
        skirtingBoardFront1Mesh.castShadow = true;
        skirtingBoardFront1Mesh.receiveShadow = true;
        skirtingBoardFront1Mesh.rotateZ( Math.PI / 2 )
        skirtingBoardFront1Mesh.position.set( 0, widthWall / 4, widthRoom / 2 - widthWall / 4 )
        this.add( skirtingBoardFront1Mesh );

        const skirtingBoardFront2Mesh = new THREE.Mesh( skirtingBoardFront, woodenMaterial );
        skirtingBoardFront2Mesh.castShadow = true;
        skirtingBoardFront2Mesh.receiveShadow = true;
        skirtingBoardFront2Mesh.rotateZ( Math.PI/2 )
        skirtingBoardFront2Mesh.position.set( 0, widthWall / 4, -widthRoom / 2 + widthWall / 4 )
        this.add( skirtingBoardFront2Mesh );

        const skirtingBoardLateral1Mesh = new THREE.Mesh ( skirtingBoardLateral1, woodenMaterial );
        skirtingBoardLateral1Mesh.castShadow = true;
        skirtingBoardLateral1Mesh.receiveShadow = true;
        skirtingBoardLateral1Mesh.rotateY( Math.PI / 2 )
        skirtingBoardLateral1Mesh.rotateZ( Math.PI / 2 )
        skirtingBoardLateral1Mesh.position.set( -lengthRoom / 2 + widthWall / 4, widthWall / 4, 0 )
        this.add( skirtingBoardLateral1Mesh );

        const skirtingBoardLateral2Mesh = new THREE.Mesh( skirtingBoardLateral2, woodenMaterial );
        skirtingBoardLateral2Mesh.castShadow = true;
        skirtingBoardLateral2Mesh.receiveShadow = true;
        skirtingBoardLateral2Mesh.rotateY( Math.PI / 2 )
        skirtingBoardLateral2Mesh.rotateZ( Math.PI / 2 )
        skirtingBoardLateral2Mesh.position.set( lengthRoom / 2 - widthWall / 4, widthWall / 4, -widthRoom * 0.5 / 2 )
        this.add( skirtingBoardLateral2Mesh );

        const skirtingBoardLateral3Mesh = new THREE.Mesh( skirtingBoardLateral3, woodenMaterial );
        skirtingBoardLateral3Mesh.castShadow = true;
        skirtingBoardLateral3Mesh.receiveShadow = true;
        skirtingBoardLateral3Mesh.rotateY( Math.PI / 2 )
        skirtingBoardLateral3Mesh.rotateZ( Math.PI / 2 )
        skirtingBoardLateral3Mesh.position.set( lengthRoom / 2 - widthWall / 4, widthWall / 4, widthRoom * 0.2 + widthRoom * 0.3 / 2)
        this.add( skirtingBoardLateral3Mesh );

        const skirtingBoardDoorLateral1Mesh = new THREE.Mesh( skirtingBoardDoorLateral, woodenMaterial )
        skirtingBoardDoorLateral1Mesh.position.set( lengthRoom / 2 - widthWall / 4, height * 0.8 / 2 + widthWall / 2, - widthWall / 4 )
        this.add( skirtingBoardDoorLateral1Mesh )

        const skirtingBoardDoorLateral2Mesh = new THREE.Mesh( skirtingBoardDoorLateral, woodenMaterial )
        skirtingBoardDoorLateral2Mesh.position.set( lengthRoom / 2 - widthWall / 4, height * 0.8 / 2 + widthWall / 2, widthRoom * 0.2 + widthWall / 4 )
        this.add( skirtingBoardDoorLateral2Mesh )

        const skirtingBoardDoorTopMesh = new THREE.Mesh( skirtingBoardDoorTop, woodenMaterial )
        skirtingBoardDoorTopMesh.rotateY( Math.PI / 2 )
        skirtingBoardDoorTopMesh.rotateZ( Math.PI / 2 )
        skirtingBoardDoorTopMesh.position.set( lengthRoom / 2 - widthWall / 4, widthWall / 4 + height * 0.8, widthRoom * 0.2 - widthRoom * 0.2 / 2 )
        this.add( skirtingBoardDoorTopMesh )

        // door

        const door = new MyDoor(app, widthRoom * 0.2, height * 0.8, widthWall / 2 )
        door.rotateY( Math.PI / 2 + Math.PI / 12 )
        door.position.set( lengthRoom / 2 - widthWall / 4 + widthWall / 4, 0, widthRoom * 0.2)
        this.add( door )
    }

}

MyWalls.prototype.isGroup = true;

export { MyWalls };