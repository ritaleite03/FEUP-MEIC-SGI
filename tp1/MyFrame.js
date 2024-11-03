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
     * @param {number} depht frame depht
     * @param {texture} texture frame texture. default = null (no texture)
     */
    constructor(width, insideLength, outsideLength, depht, texture = null) {
        super();
        const geometry = new THREE.BufferGeometry();

        const halfIn = insideLength/2;
        const halfOut = outsideLength/2;

        const vertices = new Float32Array([
            -halfOut, 0, depht,         //0
            -halfIn, width, depht,     //1
            halfOut, 0, depht,          //2
            halfIn, width, depht,      //3

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

        const u1 = outsideLength;
        const v1 = 2 * depht + width;

        const uvs = new Float32Array([
            0.0, depht/v1,                       // 0
            width/u1, (depht + width) / v1,      // 1
            1.0 , depht/v1,                      // 2
            (width + insideLength)/u1, (depht + width) / v1,      // 3

            0.0, 0.0,                           // 4
            width/u1, 1.0,                      // 5
            1.0, 0.0,                           // 6
            (width + insideLength)/u1, 1.0,     // 7
        ]);

        geometry.setIndex( indicesOfFaces );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geometry.computeVertexNormals()
        
        let material;
        if(texture == null){
            material = new THREE.MeshStandardMaterial({color: "#000000", metalness: 1.0,  roughness: 0.1});
        } else {
            //material = new THREE.MeshPhysicalMaterial({color: "#ffffff", metalness: 0.7,  roughness: 0.1, map:texture});
            material = new THREE.MeshPhongMaterial({color: "#ffffff", map:texture});
        }

        const mesh = new THREE.Mesh( geometry, material )
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh)

    }
}

export { MyFrame };