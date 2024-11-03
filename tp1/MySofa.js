import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MySofaCushion } from './MySofaCushion.js';
import { MyPillow } from './MyPillow.js';

/**
 * This class contains the representation of a newspaper
 */
class MySofa extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width sofa width
     * @param {number} length sofa length
     * @param {number} height sofa height
     * @param {texture} texture sofa texture
     */
    constructor(app, width, length, height, texture) {
        super();
        this.app = app;
        this.type = 'Group';
        this.texture = texture.clone();

        // texture and material
        
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;
        const material = new THREE.MeshLambertMaterial({ color: "#ffffff", map: this.texture });

        // Base shape
        const baseShape = new THREE.Shape();
        baseShape.moveTo(0, 0);
        baseShape.lineTo( 0, height );
        baseShape.lineTo( length, height);
        baseShape.lineTo( length, 0 );
        baseShape.lineTo( 0, 0 );

        const extrudeSettings = {
            steps: 10,
            depth: width,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
        const sofaBase = new THREE.Mesh(geometry, material);
        sofaBase.position.x= 0.1;
        sofaBase.castShadow = true;
        sofaBase.receiveShadow = true;
        this.add(sofaBase);

        // Sides shape
        const sideShape = new THREE.Shape();
        sideShape.moveTo(0, 0);
        sideShape.lineTo( 0, width );
        sideShape.lineTo( height * 0.6, width);
        sideShape.lineTo( height * 0.6, 0 );
        sideShape.lineTo( 0, 0 );

        const extrudeSettings2 = {
            steps: 10,
            depth: (width + height * 0.6),
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry2 = new THREE.ExtrudeGeometry(sideShape, extrudeSettings2);
        
        // Left side
        const sofaLeft = new THREE.Mesh(geometry2, material);
        sofaLeft.position.set(- height * 0.6 - 0.1, 0, -height * 0.6);
        sofaLeft.castShadow = true;
        sofaLeft.receiveShadow = true;
        this.add(sofaLeft);

        // Right side
        const sofaRight = new THREE.Mesh(geometry2, material);
        sofaRight.position.set(length + 0.3, 0, -height * 0.6);
        sofaRight.castShadow = true;
        sofaRight.receiveShadow = true;
        this.add(sofaRight);

        // Back shape
        const backShape = new THREE.Shape();
        backShape.moveTo(0, 0);
        backShape.lineTo( 0, width + height);
        backShape.lineTo( length, width + height);
        backShape.lineTo( length, 0 );
        backShape.lineTo( 0, 0 );

        const extrudeSettings3 = {
            steps: 10,
            depth: height * 0.6,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry3 = new THREE.ExtrudeGeometry(backShape, extrudeSettings3);
        
        // Sofa back
        const sofaBack = new THREE.Mesh(geometry3, material);
        sofaBack.position.set(0.1, 0, -height * 0.6);
        sofaBack.castShadow = true;
        sofaBack.receiveShadow = true;
        this.add(sofaBack);

        // Seat Cushions
        const seatCushions = new MySofaCushion(app, width, length, height, texture);
        seatCushions.position.set(0.1, height + 0.1, 0.2);
        this.add(seatCushions);

        // Back Cushions
        const backCushions = new MySofaCushion(app, width,  length - 0.2, height * 0.8, texture);
        backCushions.rotateX(-Math.PI/2);
        backCushions.rotateZ(Math.PI);
        backCushions.position.set(length, 2 * height + 0.1, 0.1);
        this.add(backCushions);

        // Left pillow 
        const leftPillow = new MyPillow(this.app, width * 0.7, width * 0.7, width * 0.3);
        leftPillow.rotateY(- Math.PI/8)
        leftPillow.rotateZ(- Math.PI/3)
        leftPillow.position.set(height * 0.75, 3.4 * height, height * 2.5);
        this.add( leftPillow )

        // Right pillow 
        const rightPillow = new MyPillow(this.app, width * 0.7, width * 0.7, width * 0.3);
        rightPillow.rotateY(Math.PI/8)
        rightPillow.rotateZ(Math.PI/3)
        rightPillow.position.set(length - height * 0.4, 3.4 * height, height * 2.5);
        this.add( rightPillow )

        const material2 = new THREE.MeshLambertMaterial({ color: "#000000"});

        // Block Legs
        const down = - height* 0.1 - 0.1; 
        const desl = height * 0.3;
        const leg = new THREE.BoxGeometry(height * 0.6, height * 0.2, height * 0.6);
        
        // Left back leg
        const legBL = new THREE.Mesh(leg, material2);
        legBL.position.set(-desl - 0.1, down, -desl);
        this.add(legBL)

        // Right back leg
        const legBR = new THREE.Mesh(leg, material2);
        legBR.position.set(length + 0.3 + desl, down, -desl);
        this.add(legBR)

        // Left front leg
        const legFL = new THREE.Mesh(leg, material2);
        legFL.position.set(-desl - 0.1, down, width - desl);
        this.add(legFL)

        // Right front leg
        const legFR = new THREE.Mesh(leg, material2);
        legFR.position.set(length + 0.3 + desl, down, width -desl);
        this.add(legFR)
    }
}

MySofa.prototype.isGroup = true;

export { MySofa };