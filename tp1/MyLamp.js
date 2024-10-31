import * as THREE from 'three';
import { MyApp } from './MyApp.js';

class MyLamp extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} radiusFoot lamp's foot's radius
     * @param {number} heighFoot lamp's foot's height
     * @param {number} radiusPole lamp's pole's radius
     * @param {number} heightPole lamp's pole's height
     * @param {number} radiusShadeBottomLamp lamp's shade's bottom radius
     * @param {number} radiusShadeTopLamp lamp's shade's top radius
     * @param {number} heighShadeLamp lamp's shade's height
     */
    constructor(app, radiusFoot, heighFoot, radiusPole, heightPole, radiusShadeBottomLamp, radiusShadeTopLamp, heighShadeLamp) {
        super()
        this.app = app

        const segments = 50;
        const radiusLink = radiusPole / 2

        let textureLamp = new THREE.TextureLoader().load('textures/lamp.jpg');
        textureLamp.wrapS = THREE.MirroredRepeatWrapping;
        textureLamp.wrapT = THREE.MirroredRepeatWrapping;
        textureLamp.repeat.set(2,1)
        const materialLamp = new THREE.MeshPhongMaterial( {color: "#ffffff", map:textureLamp} )
       
        let textureShade = new THREE.TextureLoader().load('textures/gray-sofa4.jpg');
        textureShade.wrapS = THREE.MirroredRepeatWrapping;
        textureShade.wrapT = THREE.MirroredRepeatWrapping;
        textureShade.repeat.set(2,1)
        const materialShade = new THREE.MeshLambertMaterial( {color: "#ffffff", side: THREE.DoubleSide, map: textureShade} )

        // geometry

        const foot = new THREE.CylinderGeometry(radiusPole, radiusFoot, heighFoot, segments, segments)
        const pole = new THREE.CylinderGeometry(radiusPole, radiusPole, heightPole, segments, segments)
        const shade = new THREE.CylinderGeometry(radiusShadeTopLamp, radiusShadeBottomLamp, heighShadeLamp, segments, segments, true)
        const link = new THREE.CylinderGeometry(radiusLink, radiusLink, radiusShadeTopLamp * 2, segments, segments)        
        
        // mesh

        const footMesh = new THREE.Mesh( foot, materialLamp )
        footMesh.castShadow = true;
        footMesh.receiveShadow = true;
        footMesh.position.y = heighFoot / 2
        this.add( footMesh )

        const poleMesh = new THREE.Mesh( pole, materialLamp )
        poleMesh.castShadow = true;
        poleMesh.receiveShadow = true;
        poleMesh.position.y = heighFoot + heightPole / 2;
        this.add( poleMesh )

        const shadeMesh = new THREE.Mesh( shade, materialShade )
        shadeMesh.castShadow = true;
        shadeMesh.receiveShadow = true;
        shadeMesh.position.y = heighFoot + heightPole - heighShadeLamp / 2
        this.add( shadeMesh )

        const link1Mesh = new THREE.Mesh( link, materialLamp )
        link1Mesh.castShadow = true;
        link1Mesh.receiveShadow = true;
        link1Mesh.rotateZ(Math.PI / 2)
        link1Mesh.position.y = heighFoot + heightPole - radiusLink
        this.add(link1Mesh)

        const link2Mesh = new THREE.Mesh(link, materialLamp)
        link2Mesh.castShadow = true;
        link2Mesh.receiveShadow = true;
        link2Mesh.rotateY(Math.PI / 2);
        link2Mesh.rotateZ(Math.PI / 2);
        link2Mesh.position.y = heighFoot + heightPole - radiusLink
        this.add(link2Mesh)
    }

}

MyLamp.prototype.isGroup = true;

export { MyLamp };