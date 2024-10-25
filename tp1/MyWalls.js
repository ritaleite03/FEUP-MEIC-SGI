import * as THREE from 'three';
import { MyWall } from './MyWall.js';
import { MyWindow } from './MyWindow.js';
import { MyBeetle } from './MyBeetle.js';

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
        this.wallRightA = new MyWall(app, widthRoom, lengthRoom, height * 0.2, widthWall);
        this.wallRightA.position.y = height * 0.8;
        this.add(this.wallRightA);

        this.wallRightB = new MyWall(app, widthRoom * 0.5, lengthRoom, height * 0.8, widthWall);
        this.wallRightB.position.z = -widthRoom * 0.5 * 0.5;
        this.add(this.wallRightB);

        this.wallRightC = new MyWall(app, widthRoom * 0.2, lengthRoom, height * 0.8, widthWall);
        this.wallRightC.position.z = widthRoom * 0.8 * 0.5;
        this.add(this.wallRightC);

        // Back wall
        this.wallBack = new MyWall(app, lengthRoom, widthRoom, height, widthWall);
        this.wallBack.rotateY(Math.PI/2)
        this.add(this.wallBack);
       
        this.beetlePainting = new MyBeetle(app, 0, height * 0.8, - widthRoom / 2)
        this.add(this.beetlePainting);

        // Left wall
        this.wallLeft = new MyWall(app, widthRoom, lengthRoom, height, widthWall);
        this.wallLeft.rotateY(Math.PI)
        this.add(this.wallLeft);

        // Front wall
        this.wallFrontA = new MyWall(app, lengthRoom, widthRoom, height * 0.2, widthWall);
        this.wallFrontA.rotateY(3*Math.PI/2);
        this.wallFrontA.position.y = height * 0.8;
        this.add(this.wallFrontA);

        this.wallFrontB = new MyWall(app, lengthRoom, widthRoom, height * 0.4, widthWall);
        this.wallFrontB.rotateY(3*Math.PI/2);
        this.add(this.wallFrontB);

        let gap = lengthRoom * 0.8 * 0.5;
        this.wallFrontC = new MyWall(app, lengthRoom * 0.2, widthRoom, height, widthWall);
        this.wallFrontC.rotateY(3*Math.PI/2);
        this.wallFrontC.position.x = -gap;
        this.add(this.wallFrontC);

        this.wallFrontD = new MyWall(app, lengthRoom * 0.2, widthRoom, height, widthWall);
        this.wallFrontD.rotateY(3*Math.PI/2);
        this.wallFrontD.position.x = gap;
        this.add(this.wallFrontD);

        this.window = new MyWindow(lengthRoom * 0.6, height * 0.4, widthWall, height * 0.4 + height * 0.2, widthRoom * 0.5 + widthWall)
        this.add(this.window)

        const sun = new THREE.DirectionalLight( 0xffffff, 1 );
        sun.rotateX(Math.PI / 2)
        sun.position.set( 0, 5, 15 );
        sun.target.position.set( 0, 0, 0 )
        sun.castShadow = true;
        sun.shadow.camera.left = -lengthRoom * 0.6 / 2
        sun.shadow.camera.right = lengthRoom * 0.6 / 2;
        sun.shadow.camera.top =  height * 0.4,
        sun.shadow.camera.bottom = 0
        this.add( sun );
        const sunHelper = new THREE.DirectionalLightHelper( sun, 5 ); 
        this.add( sunHelper );


        // skirting board
        const skirtingBoardFront = new THREE.BoxGeometry(widthWall / 2, lengthRoom, widthWall / 2)
        const skirtingBoardLateral1 = new THREE.BoxGeometry(widthWall / 2, widthRoom, widthWall / 2)
        const skirtingBoardLateral2 = new THREE.BoxGeometry(widthWall / 2, widthRoom * 0.5, widthWall / 2)
        const skirtingBoardLateral3 = new THREE.BoxGeometry(widthWall / 2, widthRoom * 0.2, widthWall / 2)

        this.skirtingBoardFront1Mesh = new THREE.Mesh (skirtingBoardFront, woodenMaterial);
        this.skirtingBoardFront1Mesh.castShadow = true;
        this.skirtingBoardFront1Mesh.receiveShadow = true;
        this.skirtingBoardFront1Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardFront1Mesh.position.set(0, widthWall / 4, widthRoom / 2 - widthWall / 4)
        this.add(this.skirtingBoardFront1Mesh);

        this.skirtingBoardFront2Mesh = new THREE.Mesh (skirtingBoardFront, woodenMaterial);
        this.skirtingBoardFront2Mesh.castShadow = true;
        this.skirtingBoardFront2Mesh.receiveShadow = true;
        this.skirtingBoardFront2Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardFront2Mesh.position.set(0, widthWall / 4, -widthRoom / 2 + widthWall / 4)
        this.add(this.skirtingBoardFront2Mesh);

        this.skirtingBoardLateral1Mesh = new THREE.Mesh (skirtingBoardLateral1, woodenMaterial);
        this.skirtingBoardLateral1Mesh.castShadow = true;
        this.skirtingBoardLateral1Mesh.receiveShadow = true;
        this.skirtingBoardLateral1Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral1Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral1Mesh.position.set(-lengthRoom / 2 + widthWall / 4, widthWall / 4, 0)
        this.add(this.skirtingBoardLateral1Mesh);

        this.skirtingBoardLateral2Mesh = new THREE.Mesh (skirtingBoardLateral2, woodenMaterial);
        this.skirtingBoardLateral2Mesh.castShadow = true;
        this.skirtingBoardLateral2Mesh.receiveShadow = true;
        this.skirtingBoardLateral2Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral2Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral2Mesh.position.set(lengthRoom / 2 - widthWall / 4, widthWall / 4, -widthRoom * 0.5 / 2)
        this.add(this.skirtingBoardLateral2Mesh);

        this.skirtingBoardLateral3Mesh = new THREE.Mesh (skirtingBoardLateral3, woodenMaterial);
        this.skirtingBoardLateral3Mesh.castShadow = true;
        this.skirtingBoardLateral3Mesh.receiveShadow = true;
        this.skirtingBoardLateral3Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral3Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral3Mesh.position.set(lengthRoom / 2 - widthWall / 4, widthWall / 4, widthRoom / 2 - widthRoom * 0.2 / 2)
        this.add(this.skirtingBoardLateral3Mesh);
    }

}

MyWalls.prototype.isGroup = true;

export { MyWalls };