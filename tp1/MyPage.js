import * as THREE from 'three';

/**
 * This class contains the representation of a page
 */
class MyPage extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} x position in Ox of the page
     * @param {number} y position in Oy of the page
     * @param {number} z position in Oz of the page
     * @param {number} arc page's arc
     */
    constructor(app, x, y, z, arc) {
        super();
        this.type = 'Group';

        let controlPoints = [
            [[ 0.00, 0.00, 0, 1 ],[ 0.00, 0.00, 0.5, 1 ]],
            [[ 0.25, 0.25 * arc, 0, 1 ],[ 0.25, 0.25 * arc, 0.5, 1 ]],
            [[ 0.50, 0.00, 0, 1 ],[ 0.50, 0.00, 0.5, 1 ]],
        ]

        const orderU= 2
        const orderV = 1
        
        const texture = new THREE.TextureLoader().load('textures/newspaper.jpg');
        const material = new THREE.MeshLambertMaterial( {map:texture, color: "#ffffff", side: THREE.DoubleSide} );
        let halfNewspaper = app.builder.build( controlPoints, orderU, orderV, this.samplesU, this.samplesV, material )  

        let leftNewspaperMesh = new THREE.Mesh( halfNewspaper, material );
        leftNewspaperMesh.position.set( x, y, z )
        this.add( leftNewspaperMesh )

        let rightNewspaperMesh = new THREE.Mesh( halfNewspaper, material );
        rightNewspaperMesh.position.set( x + 0.5, y, z )
        this.add( rightNewspaperMesh )
    }
}

MyPage.prototype.isGroup = true;

export { MyPage };