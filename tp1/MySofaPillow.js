import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MySofaPillow extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width pillow width
     * @param {number} length pillow length
     * @param {number} height pillow height
     * @param {texture} texture pillow texture
     */
    constructor(app, width, length, height, texture) {
        super();
        this.type = 'Group';

        // variables
        const orderU = 3;
        const orderV = 3;
        this.samplesU = 8;
        this.samplesV = 8;

        // texture and material
        this.texture = texture.clone();
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        let planeUVRate = this.samplesV / this.samplesU;
        let planeTextureUVRate = 1000 / 750; // image dimensions
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.texture.repeat.set( planeTextureRepeatU, planeTextureRepeatV );

        const material = new THREE.MeshStandardMaterial( {map: this.texture, color: "#ffffff", side: THREE.DoubleSide } );

        const arc = height * 0.4; 

        const controlPointsTop = [
            [
                [ 0, 0, 0, 1 ],
                [ length * 0.2, 0, -arc, 1 ],
                [ length * 0.8, 0, -arc, 1 ],
                [ length, 0, 0, 1 ]
            ],
            [
                [ -arc, 0, width * 0.2, 1 ],
                [ length * 0.2, 0, width * 0.2, 1 ],
                [ length * 0.8, 0, width * 0.2, 1 ],
                [ length + arc, 0, width * 0.2, 1 ]
            ],
            [
                [ -arc, 0, width * 0.8, 1 ],
                [ length * 0.2, 0, width * 0.8, 1 ],
                [ length * 0.8, 0, width * 0.8, 1 ],
                [ length + arc, 0, width * 0.8, 1 ]
            ],
            [
                [ 0, 0, width, 1 ],
                [ length * 0.2, 0, width + arc, 1 ],
                [ length * 0.8, 0, width + arc, 1 ],
                [ length, 0, width, 1 ]
            ],
        ]

        const topSofa = app.builder.build( controlPointsTop, orderU, orderV, this.samplesU, this.samplesV, material ) 
        let topSofaMesh = new THREE.Mesh( topSofa, material );
        topSofaMesh.castShadow = true;
        topSofaMesh.receiveShadow = true;
        this.add( topSofaMesh )

        const controlPointsBotton = [
            [
                [ 0, height, 0, 1 ],
                [ length * 0.2, height, - arc, 1 ],
                [ length * 0.8, height, - arc, 1 ],
                [ length, height, 0, 1 ]
            ],
            [
                [ -arc, height, width * 0.2, 1 ],
                [ length * 0.2, height + arc * 2, width * 0.2, 1 ],
                [ length * 0.8, height + arc * 2, width * 0.2, 1 ],
                [ length + arc, height, width * 0.2, 1 ]
            ],
            [
                [ -arc, height, width * 0.8, 1 ],
                [ length * 0.2, height + arc * 2, width * 0.8, 1 ],
                [ length * 0.8, height + arc * 2, width * 0.8, 1 ],
                [ length + arc, height, width * 0.8, 1 ]
            ],
            [
                [ 0, height, width, 1 ],
                [ length * 0.2, height, width + arc, 1 ],
                [ length * 0.8, height, width + arc, 1 ],
                [ length, height, width, 1 ]
            ],
        ]

        const botton = app.builder.build( controlPointsBotton, orderU, orderV, this.samplesU, this.samplesV, material ) 
        let bottonMesh = new THREE.Mesh( botton, material );
        bottonMesh.castShadow = true;
        bottonMesh.receiveShadow = true;
        this.add( bottonMesh )


        const orderU2= 1;
        const orderV2 = 3;

        const controlPointsFront = [
            [
                [ 0, 0, width, 1 ],
                [ length * 0.2, 0, width + arc, 1 ],
                [ length * 0.8, 0, width + arc, 1 ],
                [ length, 0, width, 1 ]
            ],
            [
                [ 0, height, width, 1 ],
                [ length * 0.2, height, width + arc, 1 ],
                [ length * 0.8, height, width + arc, 1 ],
                [ length, height, width, 1 ]
            ]
        ]

        const front = app.builder.build( controlPointsFront, orderU2, orderV2, this.samplesU, this.samplesV, material ) 
        let frontMesh = new THREE.Mesh( front, material );
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        this.add( frontMesh )

        const controlPointsBack = [
            [
                [ 0, 0, 0, 1 ],
                [ length * 0.2, 0, -arc, 1 ],
                [ length * 0.8, 0, -arc, 1 ],
                [ length, 0, 0, 1 ]
            ],
            [
                [ 0, height, 0, 1 ],
                [ length * 0.2, height, -arc, 1 ],
                [ length * 0.8, height, -arc, 1 ],
                [ length, height, 0, 1 ]
            ]
        ]

        const back = app.builder.build( controlPointsBack, orderU2, orderV2, this.samplesU, this.samplesV, material ) 
        let backMesh = new THREE.Mesh( back, material );
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        this.add( backMesh )

        const controlPointsLeft = [
            [
                [ 0, 0, 0, 1 ],
                [ -arc, 0, width * 0.2, 1 ],
                [ -arc, 0, width * 0.8, 1 ],
                [ 0, 0, width, 1 ]
            ],
            [
                [ 0, height, 0, 1 ],
                [ -arc, height, width * 0.2, 1 ],
                [ -arc, height, width * 0.8, 1 ],
                [ 0, height, width, 1 ]
            ]
        ]

        const left = app.builder.build( controlPointsLeft, orderU2, orderV2, this.samplesU, this.samplesV, material ) 
        let leftMesh = new THREE.Mesh( left, material );
        leftMesh.castShadow = true;
        leftMesh.receiveShadow = true;
        this.add( leftMesh )

        const controlPointsRight = [
            [
                [ length, 0, 0, 1 ],
                [ length + arc, 0, width * 0.2, 1 ],
                [ length + arc, 0, width * 0.8, 1 ],
                [ length, 0, width, 1 ]
            ],
            [
                [ length, height, 0, 1 ],
                [ length + arc, height, width * 0.2, 1 ],
                [ length + arc, height, width * 0.8, 1 ],
                [ length, height, width, 1 ]
            ]
        ]

        const right = app.builder.build( controlPointsRight, orderU2, orderV2, this.samplesU, this.samplesV, material ) 
        let rightMesh = new THREE.Mesh( right, material );
        rightMesh.castShadow = true;
        rightMesh.receiveShadow = true;
        this.add( rightMesh )


    }
}

MySofaPillow.prototype.isGroup = true;

export { MySofaPillow };