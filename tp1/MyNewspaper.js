import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MyNewspaper extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} x position in Ox of the newspaper
     * @param {number} y position in Oy of the newspaper
     * @param {number} z position in Oz of the newspaper
     * @param {number} maxArcPage top page's arc
     * @param {number} numberPages number of pages
     */
    constructor(app, x, y, z, maxArcPage, numberPages) {
        super();
        this.type = 'Group';

        // variables
        const orderU= 2;
        // const orderV = 1;
        const orderV = 2;
        const arcInterval = maxArcPage / numberPages;
        let arc = 0;

        // texture and material
        const texture = new THREE.TextureLoader().load('textures/newspaper.jpg');
        const material = new THREE.MeshLambertMaterial( { map:texture, color: "#ffffff", side: THREE.DoubleSide } );

        // geometry and mesh of the newspaper's pages
        for(let i = 0; i < numberPages; i++){
            
            // control points to define the curve
            //const controlPoints = [
            //    [[ 0.00, 0.00 * arc, 0, 1 ],[ 0.00, 0.00 * arc, 0.5, 1 ]],
            //    [[ 0.25, 0.25 * arc, 0, 1 ],[ 0.25, 0.25 * arc, 0.5, 1 ]],
            //    [[ 0.50, 0.00 * arc, 0, 1 ],[ 0.50, 0.00 * arc, 0.5, 1 ]],
            //]

            const y1 = 0.00 * arc
            const y2 = 0.25 * arc
            const y3 = 0.00 * arc +  i * 0.01

            const controlPointsLeft = [
               [[ 0.00, y3, 0, 1 ], [ 0.00, y3 + 0.1 * arc, 0.25, 1 ], [ 0.00, y3, 0.5, 1 ]],
               [[ 0.25, y2, 0, 1 ], [ 0.25, y2 + 0.0 * arc, 0.25, 1 ], [ 0.25, y2, 0.5, 1 ]],
               [[ 0.50, y1, 0, 1 ], [ 0.50, y1 + 0.1 * arc, 0.25, 1 ], [ 0.50, y1, 0.5, 1 ]],
            ]

            const controlPointsRight = [
                [[ 0.00, y1, 0, 1 ], [ 0.00, y1 + 0.1 * arc, 0.25, 1 ], [ 0.00, y1, 0.5, 1 ]],
                [[ 0.25, y2, 0, 1 ], [ 0.25, y2 + 0.0 * arc, 0.25, 1 ], [ 0.25, y2, 0.5, 1 ]],
                [[ 0.50, y3, 0, 1 ], [ 0.50, y3 + 0.1 * arc, 0.25, 1 ], [ 0.50, y3, 0.5, 1 ]],
             ]

            // const controlPoints = [
            //     [ [ 0.00, 0.00 * arc, 0, 1 ], [ 0.00, 0.00 * arc + 0.2 * arc, 0, 0.5 ],[ 0.00, 0.00 * arc, 0.5, 1 ] ],
            //     [ [ 0.25, 0.25 * arc, 0, 1 ], [ 0.25, 0.25 * arc + 0.0 * arc, 0, 0.5 ],[ 0.25, 0.25 * arc, 0.5, 1 ] ],
            //     [ [ 0.50, 0.00 * arc + i * 0.1, 0, 1 ], [ 0.50, 0.00 * arc + i * 0.1 + 0.2 * arc, 0, 0.5 ],[ 0.50, 0.00 * arc + i * 0.1, 0.5, 1 ] ],
            // ]


            const leftHalfNewspaper = app.builder.build( controlPointsLeft, orderU, orderV, this.samplesU, this.samplesV, material ) 
            const rightHalfNewspaper = app.builder.build( controlPointsRight, orderU, orderV, this.samplesU, this.samplesV, material ) 

            let leftNewspaperMesh = new THREE.Mesh( leftHalfNewspaper, material );
            leftNewspaperMesh.position.set( x, y, z )
            this.add( leftNewspaperMesh )
    
            let rightNewspaperMesh = new THREE.Mesh( rightHalfNewspaper, material );
            rightNewspaperMesh.position.set( x + 0.5, y, z )
            this.add( rightNewspaperMesh )
            
            // increment arc of the page
            arc += arcInterval
        }
    }
}

MyNewspaper.prototype.isGroup = true;

export { MyNewspaper };