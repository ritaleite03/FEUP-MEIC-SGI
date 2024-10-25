import * as THREE from 'three';

class MyLamp extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radiusFoot, heighFoot,radiusPole, heightPole, radiusShadeBottomLamp, radiusShadeTopLamp, heighShadeLamp) {
        super()
        this.app = app
        const segments = 20;

        const material = new THREE.MeshPhongMaterial( {color: "#ffffff"} )
        const foot = new THREE.CylinderGeometry(radiusPole, radiusFoot, heighFoot, segments, segments)
        const footMesh = new THREE.Mesh(foot, material)
        footMesh.position.y = heighFoot / 2
        this.add(footMesh)

        const pole = new THREE.CylinderGeometry(radiusPole, radiusPole, heightPole, segments, segments)
        const poleMesh = new THREE.Mesh(pole, material)
        poleMesh.position.y = heighFoot + heightPole / 2;
        this.add(poleMesh)

        const shade = new THREE.CylinderGeometry(radiusShadeTopLamp, radiusShadeBottomLamp, heighShadeLamp, segments, segments, true)
        const shadeMesh = new THREE.Mesh(shade, material)
        shadeMesh.position.y = heighFoot + heightPole - heighShadeLamp / 2
        this.add(shadeMesh)
    }

}

MyLamp.prototype.isGroup = true;

export { MyLamp };