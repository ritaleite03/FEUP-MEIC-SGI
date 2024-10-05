import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyFlame } from './MyFlame.js';

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
        const yFlame = y + heightStick;
        const yStick = y + heightStick / 2

        const flame = new MyFlame(app, radiusFlame, heightFlame, x, yFlame, z, segments);
        this.add(flame)

        const stick = new THREE.CylinderGeometry(radiusStick, radiusStick, heightStick, segments, segments)
        const stickMaterial = new THREE.MeshBasicMaterial( {color: "#f9fae3"} );
        const stickMesh = new THREE.Mesh(stick, stickMaterial);
        stickMesh.position.set(x,yStick, z);
        this.add(stickMesh);
    }
}

MyCandle.prototype.isGroup = true;

export { MyCandle };