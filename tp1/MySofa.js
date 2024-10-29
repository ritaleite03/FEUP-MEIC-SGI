import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MySofaPillow } from './MySofaPillow.js';

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
        this.type = 'Group';
        this.texture = texture.clone();

        // texture and material
        
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;


        const material = new THREE.MeshStandardMaterial({ color: "#ffffff", map: this.texture });
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo( 0, height );
        shape.lineTo( length, height);
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );

        const extrudeSettings = {
            steps: 10,
            depth: width,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const sofaBotton = new THREE.Mesh(geometry, material);
        sofaBotton.position.x= 0.1;
        sofaBotton.castShadow = true;
        sofaBotton.receiveShadow = true;
        this.add(sofaBotton);

        const shape2 = new THREE.Shape();
        shape2.moveTo(0, 0);
        shape2.lineTo( 0, width );
        shape2.lineTo( height * 0.6, width);
        shape2.lineTo( height * 0.6, 0 );
        shape2.lineTo( 0, 0 );

        const extrudeSettings2 = {
            steps: 10,
            depth: (width + height * 0.6),
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
        
        const sofaLeft = new THREE.Mesh(geometry2, material);
        sofaLeft.position.set(- height * 0.6 - 0.1, 0, -height * 0.6);
        sofaLeft.castShadow = true;
        sofaLeft.receiveShadow = true;
        this.add(sofaLeft);

        const sofaRight = new THREE.Mesh(geometry2, material);
        sofaRight.position.set(length + 0.3, 0, -height * 0.6);
        sofaRight.castShadow = true;
        sofaRight.receiveShadow = true;
        this.add(sofaRight);

        const shape3 = new THREE.Shape();
        shape3.moveTo(0, 0);
        shape3.lineTo( 0, width + height);
        shape3.lineTo( length, width + height);
        shape3.lineTo( length, 0 );
        shape3.lineTo( 0, 0 );

        const extrudeSettings3 = {
            steps: 10,
            depth: height * 0.6,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const geometry3 = new THREE.ExtrudeGeometry(shape3, extrudeSettings3);
        
        const sofaBack = new THREE.Mesh(geometry3, material);
        sofaBack.position.set(0.1, 0, -height * 0.6);
        sofaBack.castShadow = true;
        sofaBack.receiveShadow = true;
        this.add(sofaBack);

        const pillowTop = new MySofaPillow(app, width, length, height, texture);
        pillowTop.position.set(0.1, height + 0.1, 0.2);
        this.add(pillowTop)

        const pillow = new MySofaPillow(app, width,  length - 0.2, height * 0.8, texture);
        pillow.rotateX(-Math.PI/2);
        pillow.rotateZ(Math.PI);
        pillow.position.set(length, 2 * height + 0.1, 0.1);
        this.add(pillow)

        const material2 = new THREE.MeshStandardMaterial({ color: "#000000"});

        const down = - height* 0.1 - 0.1; 
        const desl = height * 0.3;
        const suport = new THREE.BoxGeometry(height * 0.6, height * 0.2, height * 0.6);
        const suportBL = new THREE.Mesh(suport, material2);

        suportBL.position.set(-desl - 0.1, down, -desl);
        this.add(suportBL)

        const suportBR = new THREE.Mesh(suport, material2);
        suportBR.position.set(length + 0.3 + desl, down, -desl);
        this.add(suportBR)

        const suportFL = new THREE.Mesh(suport, material2);
        suportFL.position.set(-desl - 0.1, down, width - desl);
        this.add(suportFL)

        const suportFR = new THREE.Mesh(suport, material2);
        suportFR.position.set(length + 0.3 + desl, down, width -desl);
        this.add(suportFR)

        this.position.y = height* 0.1 + 0.1;
        this.position.x = - length * 0.5 - 0.1;
    }
}

MySofa.prototype.isGroup = true;

export { MySofa };