import * as THREE from 'three';
import { MyWall } from './MyWall.js';
import { MyWindow } from './MyWindow.js';

class MyWalls extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} length Room length
       @param {number} widthRoom Room width
       @param {number} height Walls height
       @param {number} widthWall Walls width
    */ 
    constructor(app, widthRoom, length, height, widthWall) {
        super();
        this.app = app
        this.type = 'Group';
        
        // texture and material of the wall's skirting board
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})
                
        // Right wall
        this.wallRightA = new MyWall(app, length, widthRoom, height * 0.2, widthWall);
        this.wallRightA.position.y = height * 0.8;
        this.add(this.wallRightA);

        this.wallRightB = new MyWall(app, length * 0.5, widthRoom, height * 0.8, widthWall);
        this.wallRightB.position.z = -length * 0.5 * 0.5;
        this.add(this.wallRightB);

        this.wallRightC = new MyWall(app, length * 0.2, widthRoom, height * 0.8, widthWall);
        this.wallRightC.position.z = length * 0.8 * 0.5;
        this.add(this.wallRightC);

        // Back wall
        this.wallBack = new MyWall(app, widthRoom, length, height, widthWall);
        this.wallBack.rotateY(Math.PI/2)
        this.add(this.wallBack);

        // Left wall
        this.wallLeft = new MyWall(app, length, widthRoom, height, widthWall);
        this.wallLeft.rotateY(Math.PI)
        this.add(this.wallLeft);

        // Front wall
        this.wallFrontA = new MyWall(app, widthRoom, length, height * 0.2, widthWall);
        this.wallFrontA.rotateY(3*Math.PI/2);
        this.wallFrontA.position.y = height * 0.8;
        this.add(this.wallFrontA);

        this.wallFrontB = new MyWall(app, widthRoom, length, height * 0.4, widthWall);
        this.wallFrontB.rotateY(3*Math.PI/2);
        this.add(this.wallFrontB);

        let gap = widthRoom * 0.8 * 0.5;
        this.wallFrontC = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallFrontC.rotateY(3*Math.PI/2);
        this.wallFrontC.position.x = -gap;
        this.add(this.wallFrontC);

        this.wallFrontD = new MyWall(app, widthRoom * 0.2, length, height, widthWall);
        this.wallFrontD.rotateY(3*Math.PI/2);
        this.wallFrontD.position.x = gap;
        this.add(this.wallFrontD);

        this.window = new MyWindow(widthRoom * 0.6, height * 0.4, widthWall, height * 0.4 + height * 0.2, length * 0.5 + widthWall)
        this.add(this.window)

        // skirting board
        const skirtingBoardFront = new THREE.BoxGeometry(widthWall / 2, widthRoom, widthWall / 2)
        const skirtingBoardLateral1 = new THREE.BoxGeometry(widthWall / 2, length, widthWall / 2)
        const skirtingBoardLateral2 = new THREE.BoxGeometry(widthWall / 2, length * 0.5, widthWall / 2)
        const skirtingBoardLateral3 = new THREE.BoxGeometry(widthWall / 2, length * 0.2, widthWall / 2)


        this.skirtingBoardFront1Mesh = new THREE.Mesh (skirtingBoardFront, woodenMaterial);
        this.skirtingBoardFront1Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardFront1Mesh.position.set(0, widthWall / 4, length / 2 - widthWall / 4)
        this.add(this.skirtingBoardFront1Mesh);

        this.skirtingBoardFront2Mesh = new THREE.Mesh (skirtingBoardFront, woodenMaterial);
        this.skirtingBoardFront2Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardFront2Mesh.position.set(0, widthWall / 4, -length / 2 + widthWall / 4)
        this.add(this.skirtingBoardFront2Mesh);

        this.skirtingBoardLateral1Mesh = new THREE.Mesh (skirtingBoardLateral1, woodenMaterial);
        this.skirtingBoardLateral1Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral1Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral1Mesh.position.set(-widthRoom / 2 + widthWall / 4, widthWall / 4, 0)
        this.add(this.skirtingBoardLateral1Mesh);

        this.skirtingBoardLateral2Mesh = new THREE.Mesh (skirtingBoardLateral2, woodenMaterial);
        this.skirtingBoardLateral2Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral2Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral2Mesh.position.set(widthRoom / 2 - widthWall / 4, widthWall / 4, -length * 0.5 / 2)
        this.add(this.skirtingBoardLateral2Mesh);

        this.skirtingBoardLateral3Mesh = new THREE.Mesh (skirtingBoardLateral3, woodenMaterial);
        this.skirtingBoardLateral3Mesh.rotateY(Math.PI/2)
        this.skirtingBoardLateral3Mesh.rotateZ(Math.PI/2)
        this.skirtingBoardLateral3Mesh.position.set(widthRoom / 2 - widthWall / 4, widthWall / 4, length / 2 - length * 0.2 / 2)
        this.add(this.skirtingBoardLateral3Mesh);
    }

}

MyWalls.prototype.isGroup = true;

export { MyWalls };