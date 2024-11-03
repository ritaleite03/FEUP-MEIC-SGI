import * as THREE from 'three';

class MyCoffeeTable extends THREE.Object3D {

    /**
     * 
     * @param {number} radiusTable tables's top's radius
     * @param {number} heightTable height between table's tops
     * @param {number} radiusFoot tables's foot's radius
     * @param {number} heightFoot tables's foot's radius
     */
    constructor(radiusTable, heightTable, radiusFoot, heightFoot) {
        super()

        // textures
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;

        // materials
        const woodenMaterial = new THREE.MeshLambertMaterial( {color: "#ffffff", map: woodenTexture} )
        const glassMaterial = new THREE.MeshPhongMaterial( {color: "#ffffff", transparent: true, opacity: 0.5} )
        
        // variables
        const heightTotal = heightTable + 0.2 + heightFoot
        const heightLevel1 = heightFoot + 0.05
        const heightLevel2 = heightFoot + 0.1 + heightTable + 0.05

        // geomteries
        const top = new THREE.CylinderGeometry( radiusTable, radiusTable, 0.1 )
        const foot = new THREE.CylinderGeometry( radiusFoot, radiusFoot, heightTotal )
        const frame = new THREE.TorusGeometry( radiusTable, 0.1 )

        // top
        const top1Mesh = new THREE.Mesh( top, glassMaterial )
        const top2Mesh = new THREE.Mesh( top, glassMaterial )
        top1Mesh.position.set( 0, heightLevel1, 0 )
        top2Mesh.position.set( 0, heightLevel2, 0 )
        top1Mesh.castShadow = true
        top2Mesh.castShadow = true
        top1Mesh.receiveShadow = true
        top2Mesh.receiveShadow = true
        this.add( top1Mesh )
        this.add( top2Mesh )

        // frame
        const frame1Mesh = new THREE.Mesh( frame, woodenMaterial )
        const frame2Mesh = new THREE.Mesh( frame, woodenMaterial )
        frame1Mesh.rotateX( Math.PI / 2 )
        frame2Mesh.rotateX( Math.PI / 2 )
        frame1Mesh.position.set( 0, heightLevel1, 0 )
        frame2Mesh.position.set( 0, heightLevel2, 0 )
        frame1Mesh.castShadow = true
        frame2Mesh.castShadow = true
        frame1Mesh.receiveShadow = true
        frame2Mesh.receiveShadow = true
        this.add( frame1Mesh )
        this.add( frame2Mesh )

        // foot
        const foot1Mesh = new THREE.Mesh( foot, woodenMaterial )
        const foot2Mesh = new THREE.Mesh( foot, woodenMaterial )
        const foot3Mesh = new THREE.Mesh( foot, woodenMaterial )
        const foot4Mesh = new THREE.Mesh( foot, woodenMaterial )
        foot1Mesh.position.set(  radiusTable, heightTotal / 2, 0 )
        foot2Mesh.position.set( -radiusTable, heightTotal / 2, 0 )
        foot3Mesh.position.set( 0, heightTotal / 2,  radiusTable )
        foot4Mesh.position.set( 0, heightTotal / 2, -radiusTable )
        foot1Mesh.castShadow = true
        foot2Mesh.castShadow = true
        foot3Mesh.castShadow = true
        foot4Mesh.castShadow = true
        foot1Mesh.receiveShadow = true
        foot2Mesh.receiveShadow = true
        foot3Mesh.receiveShadow = true
        foot4Mesh.receiveShadow = true
        this.add( foot1Mesh )
        this.add( foot2Mesh )
        this.add( foot3Mesh )
        this.add( foot4Mesh )
    }
}

MyCoffeeTable.prototype.isGroup = true;

export { MyCoffeeTable };