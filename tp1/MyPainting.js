import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyFrame } from './MyFrame.js';

/**
 * This class contains the representation of a picture frame
 */
class MyPainting extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width painting width
     * @param {number} length painting length
     * @param {number} frameWidth frame width
     * @param {texture} picture picture texture
     */
    constructor(app, width, length, frameWidth, picture) {
        super();
        this.app = app;

        const fullWidth = width + 2 * frameWidth;
        const fullLength = length + 2 * frameWidth;

        const group = new THREE.Group();

        const pictureM = new THREE.MeshStandardMaterial({ map: picture })

        const photo = new THREE.PlaneGeometry(width, length);
        const photoMesh = new THREE.Mesh(photo, pictureM);
        photoMesh.position.z= 0.01;
        group.add(photoMesh);

        const material = new THREE.MeshStandardMaterial( { color: 0x7c3a00  } );
        const backStruc = new THREE.PlaneGeometry(fullWidth, fullLength);
        const backMesh = new THREE.Mesh(backStruc, material);
        backMesh.rotateX(Math.PI);
        group.add(backMesh);

        const bottomStruc = new MyFrame(frameWidth, width, fullWidth);
        bottomStruc.position.y = - fullLength / 2;
        group.add(bottomStruc);

        const topStruc = new MyFrame(frameWidth, width, fullWidth);
        topStruc.rotateZ(Math.PI);
        topStruc.position.y = fullLength / 2;
        group.add(topStruc);

        const leftStruc = new MyFrame(frameWidth, length, fullLength);
        leftStruc.rotateZ(-Math.PI/2);
        leftStruc.position.x = - fullWidth / 2;
        group.add(leftStruc);

        const rightStruc = new MyFrame(frameWidth, length, fullLength);
        rightStruc.rotateZ(Math.PI/2);
        rightStruc.position.x = fullWidth / 2;
        group.add(rightStruc);

        group.position.y = fullLength / 2;

        this.add(group);
    }
}


export { MyPainting };