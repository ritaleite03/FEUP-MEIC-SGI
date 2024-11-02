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
     * @param {number} height frame height
     * @param {texture} texture frame texture. default = null (no texture)
     */
    constructor(width, insideLength, outsideLength, height, texture = null) {
        super();
        const geometry = new THREE.BufferGeometry();

        const halfIn = insideLength/2;
        const halfOut = outsideLength/2;

        const vertices = new Float32Array([
            -halfOut, 0, height,         //0
            -halfIn, width, height,     //1
            halfOut, 0, height,          //2
            halfIn, width, height,      //3
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
            6,4,5,      //back
            6,5,7,      //back
        ];

        geometry.setIndex( indicesOfFaces );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.computeVertexNormals()
        let material;
        if(texture == null){
            material = new THREE.MeshStandardMaterial({color: "#000000", metalness: 1.0,  roughness: 0.1});
        } else {
            material = new THREE.MeshPhysicalMaterial({color: "#888888", metalness: 0.7,  roughness: 0.1, map:texture});
        }

        const mesh = new THREE.Mesh( geometry, material )
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh)

    }
}

export { MyFrame };