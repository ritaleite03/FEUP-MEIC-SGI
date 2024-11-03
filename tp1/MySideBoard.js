import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of the a side board
 */
class MySideBoard extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width sideboard's width
     * @param {number} length sideboard's length
     * @param {number} height sideboard's height
     * @param {number} depth sideboard's depth
     * @param {number} heightLeg sideboard's leg's height
     * @param {number} radiusLeg sideboard's leg's radius
     */
    constructor(app, width, length, height, depth, heightLeg, radiusLeg) {
        super()
        this.app = app;
        
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshLambertMaterial( {  map: woodenTexture } );
                
        // geometries

        const horizontal = new THREE.BoxGeometry( width, length, depth )
        const vertical = new THREE.BoxGeometry( width, height, depth )
        const leg = new THREE.CylinderGeometry( radiusLeg, radiusLeg, heightLeg )
        const door = new THREE.BoxGeometry( length / 2, height, depth )

        // hortizontal meshes
        
        const topMesh = new THREE.Mesh( horizontal, woodenMaterial )
        const middleMesh = new THREE.Mesh( horizontal, woodenMaterial )
        const bottomMesh = new THREE.Mesh( horizontal, woodenMaterial )

        topMesh.rotateY( Math.PI / 2 )
        topMesh.rotateX( Math.PI / 2 )
        middleMesh.rotateY( Math.PI / 2 )
        middleMesh.rotateX( Math.PI / 2 )
        bottomMesh.rotateY( Math.PI / 2 )
        bottomMesh.rotateX( Math.PI / 2 )

        topMesh.position.set( 0, heightLeg + height, width / 2 )
        middleMesh.position.set( 0, heightLeg + height / 2, width / 2 )
        bottomMesh.position.set( 0, heightLeg, width / 2)

        this.add( topMesh )
        this.add( middleMesh )
        this.add( bottomMesh )

        // vertical meshes

        const leftMesh = new THREE.Mesh( vertical, woodenMaterial )
        const rightMesh = new THREE.Mesh( vertical, woodenMaterial )

        leftMesh.rotateY( Math.PI / 2 )
        rightMesh.rotateY( Math.PI / 2 )

        leftMesh.position.set( -length / 2 + depth / 2, heightLeg + height / 2, width / 2 )
        rightMesh.position.set( length / 2 - depth / 2, heightLeg + height / 2, width / 2 )

        this.add( leftMesh )
        this.add( rightMesh )

        // door meshes

        const leftDoorMesh =  new THREE.Mesh( door, woodenMaterial )
        leftDoorMesh.position.set(length / 4, height / 2, 0)
        const holderLeft = new THREE.Object3D()
        holderLeft.add(leftDoorMesh)
        holderLeft.rotateY(-Math.PI/12)
        holderLeft.position.set( -length / 2 + depth / 2, heightLeg, width)
        this.add(holderLeft)

        const rightDoorMesh =  new THREE.Mesh( door, woodenMaterial )
        rightDoorMesh.position.set(-length / 4, height / 2, 0)
        const holderRight = new THREE.Object3D()
        holderRight.add(rightDoorMesh)
        holderRight.rotateY(Math.PI/20)
        holderRight.position.set( -length / 2 + depth / 2 + length, heightLeg, width)
        this.add(holderRight)

        // legs meshes

        const leg1Mesh = new THREE.Mesh( leg, woodenMaterial )
        const leg2Mesh = new THREE.Mesh( leg, woodenMaterial )
        const leg3Mesh = new THREE.Mesh( leg, woodenMaterial )
        const leg4Mesh = new THREE.Mesh( leg, woodenMaterial )

        leg1Mesh.position.set( +length / 2 - depth / 2 - radiusLeg, heightLeg / 2, width / 2 + width / 4 )
        leg2Mesh.position.set( +length / 2 + depth / 2 + radiusLeg, heightLeg / 2, width / 2 - width / 4 )
        leg3Mesh.position.set( -length / 2 + depth / 2 + radiusLeg, heightLeg / 2, width / 2 - width / 4 )
        leg4Mesh.position.set( -length / 2 + depth / 2 + radiusLeg, heightLeg / 2, width / 2 + width / 4 )

        this.add(leg1Mesh)
        this.add(leg2Mesh)
        this.add(leg3Mesh)
        this.add(leg4Mesh)
    }
}

export { MySideBoard };