import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a picture frame
 */
class MyFrame extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width Frame width
     * @param {number} insideLength  Painting inside length
     * @param {number} outsideLength Painting outside length
     */
    constructor(width, insideLength, outsideLength) {
        super();
        const geometry = new THREE.BufferGeometry();

        const halfIn = insideLength/2;
        const halfOut = outsideLength/2;

        const vertices = new Float32Array([
            -halfOut, 0, 0.05,         //0
            -halfIn, width, 0.05,     //1
            halfOut, 0, 0.05,          //2
            halfIn, width, 0.05,      //3
            -halfOut, 0, 0.0,          //4
            -halfIn, width, 0.0,      //5
            halfOut, 0, 0.0,           //6
            halfIn, width, 0.0,       //7
        ]);

        const indicesOfFaces = [
            0,2,3,      //front
            0,3,1,      //front
            1,3,7,      //top
            1,7,5,      //top
            0,6,2,      //bottom
            0,4,6,      //bottom
        ];

        geometry.setIndex( indicesOfFaces );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

        const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
        const mesh = new THREE.Mesh( geometry, material )

        this.add(mesh)

    }
}

export { MyFrame };