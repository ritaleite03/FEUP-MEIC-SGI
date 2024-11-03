import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of the a tv
 */
class MyTV extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width tv's width
     * @param {number} height tv's height
     * @param {number} depth tv's depth
     * @param {number} heightSupport tv's support's height
     */
    constructor(app, width, height, depth, heightSupport) {
        super()
        this.app = app;
        
        // texture and materials 
        const screenTexture = new THREE.TextureLoader().load('textures/tv.jpg');
        const blackMaterial = new THREE.MeshPhongMaterial({color: "#000000", specular: "#ffffff", emissive: "#000000", shininess: 5})
        const screenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", emissive: "#0000ff", shininess: 20, map: screenTexture})
        
        // TV
        const tv = new THREE.BoxGeometry(width, height, depth)
        const tvMesh = new THREE.Mesh(tv, blackMaterial)
        tvMesh.position.set(0, heightSupport + height / 2, 0)
        this.add(tvMesh)

        // TV screen
        const screen = new THREE.PlaneGeometry(width - 0.4, height - 0.4)
        const screenMesh = new THREE.Mesh(screen, screenMaterial)
        screenMesh.position.set(0, heightSupport + height / 2, depth / 2 + 0.001)
        this.add(screenMesh)

        // TV support
        const support = new THREE.CylinderGeometry(depth / 2, depth * 6, heightSupport)
        const supportMesh = new THREE.Mesh(support, blackMaterial)
        supportMesh.position.set(0,heightSupport / 2)
        this.add(supportMesh)
    }
}

export { MyTV };