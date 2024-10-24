import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MyNewspaper extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} arcPages top page's arc
     * @param {number} numberPages number of pages
     * @param {number} width newspaper's width
     * @param {number} length newspaper's length
     * @param {number} height newspaper's height
     */
    constructor(app, arcPages, numberPages, width, length, height) {
        super();
        this.type = 'Group';

        // variables
        const orderU= 3;
        const orderV = 2;
        const arcInterval = arcPages / numberPages;
        let arc = 0;

        // texture and material
        const texture = new THREE.TextureLoader().load('textures/newspaper.jpg');
        const material = new THREE.MeshLambertMaterial( { map:texture, color: "#ffffff", side: THREE.DoubleSide } );

        // geometry and mesh of the newspaper's pages
        for(let i = 0; i < numberPages; i++){
            
            const xList = [ 0, width / 3, width / 2, width / 1 ];
            const yList = [ 0, height * arc, height * arc / 3, i * 0.01 ];

            const controlPointsLeft = [
               [[ xList[0], yList[3], 0, 1 ], [ xList[0], yList[3] + 0.1 * arc, length / 2, 1 ], [ xList[0], yList[3], length, 1 ]],
               [[ xList[1], yList[2], 0, 1 ], [ xList[1], yList[2] + 0.0 * arc, length / 2, 1 ], [ xList[1], yList[2], length, 1 ]],
               [[ xList[2], yList[1], 0, 1 ], [ xList[2], yList[1] + 0.0 * arc, length / 2, 1 ], [ xList[2], yList[1], length, 1 ]],
               [[ xList[3], yList[0], 0, 1 ], [ xList[3], yList[0] + 0.1 * arc, length / 2, 1 ], [ xList[3], yList[0], length, 1 ]],
            ]

            const controlPointsRight = [
                [[ xList[0], yList[0], 0, 1 ], [ xList[0], yList[0] + 0.1 * arc, length / 2, 1 ], [ xList[0], yList[0], length, 1 ]],
                [[ xList[1], yList[1], 0, 1 ], [ xList[1], yList[1] + 0.0 * arc, length / 2, 1 ], [ xList[1], yList[1], length, 1 ]],
                [[ xList[2], yList[2], 0, 1 ], [ xList[2], yList[2] + 0.0 * arc, length / 2, 1 ], [ xList[2], yList[2], length, 1 ]],
                [[ xList[3], yList[3], 0, 1 ], [ xList[3], yList[3] + 0.1 * arc, length / 2, 1 ], [ xList[3], yList[3], length, 1 ]],
             ]

            const leftHalfNewspaper = app.builder.build( controlPointsLeft, orderU, orderV, this.samplesU, this.samplesV, material ) 
            const rightHalfNewspaper = app.builder.build( controlPointsRight, orderU, orderV, this.samplesU, this.samplesV, material ) 

            let leftNewspaperMesh = new THREE.Mesh( leftHalfNewspaper, material );
            this.add( leftNewspaperMesh )
    
            let rightNewspaperMesh = new THREE.Mesh( rightHalfNewspaper, material );
            rightNewspaperMesh.position.x = width
            this.add( rightNewspaperMesh )
            
            // increment arc of the page
            arc += arcInterval
        }
    }
}

MyNewspaper.prototype.isGroup = true;

export { MyNewspaper };