import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MySofaCushion extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width cushion width
     * @param {number} length cushion length
     * @param {number} height cushion height
     * @param {texture} texture cushion texture
     */
    constructor(app, width, length, height, texture) {
        super();
        this.type = 'Group';
        this.app = app;

        // variables
        const orderU = 3;
        const orderV = 3; 
        const orderU2= 1;
        const orderV2 = 3;
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

        const material = new THREE.MeshLambertMaterial( {map: this.texture, color: "#ffffff"} );
        const materialBack = new THREE.MeshLambertMaterial( {map: this.texture, color: "#ffffff", side: THREE.BackSide } );
        

        const arc = height * 0.4;


        // Cushion bottom surface
        const controlPointsBottom = [
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

        const bottom = app.builder.build( controlPointsBottom, orderU, orderV, this.samplesU, this.samplesV, material ) 
        let bottomMesh = new THREE.Mesh( bottom, materialBack );
        bottomMesh.castShadow = true;
        bottomMesh.receiveShadow = true;
        this.add( bottomMesh )

        //Cushion top surface
        const controlPointsTop = [
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

        const topSurf = app.builder.build( controlPointsTop, orderU, orderV, this.samplesU, this.samplesV, material ) 
        let topSurfMesh = new THREE.Mesh( topSurf, material );
        topSurfMesh.castShadow = true;
        topSurfMesh.receiveShadow = true;
        this.add( topSurfMesh )



        // Cushion front surface
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
        let frontMesh = new THREE.Mesh( front, materialBack );
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        this.add( frontMesh )


        // Cushion back surface
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


        // Cushion left surface
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
        let leftMesh = new THREE.Mesh( left, materialBack );
        leftMesh.castShadow = true;
        leftMesh.receiveShadow = true;
        this.add( leftMesh )


        // Cushion right surface
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

MySofaCushion.prototype.isGroup = true;

export { MySofaCushion };