import * as THREE from 'three';
import { MyFrame } from './MyFrame.js';
import { MyPictureLight } from './MyPictureLight.js';

/**
 * This class contains the representation of a picture frame
 */
class MyPicture extends THREE.Object3D {

    /**
     * 
     * @param {number} width picture width
     * @param {number} height picture height
     * @param {number} frameWidth frame width
     * @param {texture} picture picture texture
     * @param {number} frameDepth frame depth
     */
    constructor(width, height, frameWidth, picture, frameDepth = 0.05) {
        super();

        const fullWidth = width + 2 * frameWidth;
        const fullHeight = height + 2 * frameWidth;

        const light = new MyPictureLight(width, height);
        light.position.y = fullHeight + height * 0.1;
        light.update();
        this.add(light);

        const group = new THREE.Group();

        const pictureM = new THREE.MeshPhongMaterial({ map: picture })

        const photo = new THREE.PlaneGeometry(width, height);
        const photoMesh = new THREE.Mesh(photo, pictureM);
        photoMesh.castShadow = true;
        photoMesh.receiveShadow = true;
        photoMesh.position.z = frameDepth/2;
        group.add(photoMesh);

        const material = new THREE.MeshBasicMaterial( { color: "#7c3a00" } );

        const backStruc = new THREE.PlaneGeometry(fullWidth, fullHeight);
        const backMesh = new THREE.Mesh(backStruc, material);
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        backMesh.rotateX(Math.PI);
        backMesh.position.z = - 0.01;
        group.add(backMesh);

        const bottomStruc = new MyFrame(frameWidth, width, fullWidth, frameDepth);
        bottomStruc.position.y = - fullHeight / 2;
        group.add(bottomStruc);

        const topStruc = new MyFrame(frameWidth, width, fullWidth, frameDepth);
        topStruc.rotateZ(Math.PI);
        topStruc.position.y = fullHeight / 2;
        group.add(topStruc);

        const leftStruc = new MyFrame(frameWidth, height, fullHeight, frameDepth);
        leftStruc.rotateZ(-Math.PI/2);
        leftStruc.position.x = - fullWidth / 2;
        group.add(leftStruc);

        const rightStruc = new MyFrame(frameWidth, height, fullHeight, frameDepth);
        rightStruc.rotateZ(Math.PI/2);
        rightStruc.position.x = fullWidth / 2;
        group.add(rightStruc);

        group.position.y = fullHeight / 2;

        this.add(group);
    }
}


export { MyPicture };