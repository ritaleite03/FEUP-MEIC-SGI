import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a candle
 */
class MyCandle extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radiusStick radius of the stick
     * @param {number} radiusFlame radius of the flame
     * @param {number} heightStick height of the stick
     * @param {number} heightFlame height of the flame
     * @param {number} x position of the candle on Ox
     * @param {number} y position of the candle on Oy
     * @param {number} z position of the candle on Oz
     * @param {number} segments number of segments for construction
     */
    constructor(app, radiusStick, radiusFlame, heightStick, heightFlame, x, y, z, segments) {
        super();
        this.type = 'Group';
        this.app = app;

        // variables
        const heightConeFlame = heightFlame - radiusFlame;
        const yFlame = y + heightStick;
        const ySphereFlame = yFlame + radiusFlame;
        const yConeFlame = ySphereFlame + heightConeFlame / 2;
        const yStick = y + heightStick / 2;

        // textures and materials
        const sphereBigFlameMaterial = new THREE.MeshBasicMaterial( { color: "#e6b449",transparent: true, opacity: 0.7 } );
        const sphereSmallFlameMaterial = new THREE.MeshBasicMaterial( { color: "#fcf177" } );
        const coneFlameMaterial = new THREE.MeshBasicMaterial( { color: "#e6b449", transparent: true, opacity: 0.7 } );
        const stickMaterial = new THREE.MeshBasicMaterial( { color: "#f9fae3" } );

        // geometries
        const sphereBigFlame = new THREE.SphereGeometry( radiusFlame, segments, segments, 0, Math.PI , 0, Math.PI )
        const sphereSmallFlame = new THREE.SphereGeometry( radiusFlame * 0.5, segments, segments )
        const coneFlame = new THREE.ConeGeometry( radiusFlame, heightConeFlame, segments, segments, false )
        const stick = new THREE.CylinderGeometry( radiusStick, radiusStick, heightStick, segments, segments )

        // add big sphere's mesh
        const sphereBigFlameMesh = new THREE.Mesh( sphereBigFlame, sphereBigFlameMaterial );
        sphereBigFlameMesh.position.set( x, ySphereFlame, z );
        sphereBigFlameMesh.rotation.x = Math.PI / 2
        this.add( sphereBigFlameMesh );

        // add small sphere's mesh
        const sphereSmallFlameMesh = new THREE.Mesh( sphereSmallFlame, sphereSmallFlameMaterial );
        sphereSmallFlameMesh.position.set( x, ySphereFlame, z );
        sphereSmallFlameMesh.rotation.x = Math.PI / 2
        this.add( sphereSmallFlameMesh );

        // add cone
        const coneMesh = new THREE.Mesh( coneFlame, coneFlameMaterial );
        coneMesh.position.set( x, yConeFlame, z );
        this.add( coneMesh ); 
        
        // add stick
        const stickMesh = new THREE.Mesh( stick, stickMaterial );
        stickMesh.position.set( x,yStick, z );
        this.add( stickMesh );
    }
}

MyCandle.prototype.isGroup = true;

export { MyCandle };