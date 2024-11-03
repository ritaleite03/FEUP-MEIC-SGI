import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyFrame } from './MyFrame.js';
import { MyPictureLight } from './MyPictureLight.js';

/**
 * This class contains the representation of a picture frame
*/

class MyBeetle extends THREE.Object3D {

    /**
     * @param {MyApp} app the application object
     * @param {number} x position of the paiting on the axis Ox
     * @param {number} y position of the paiting on the axis Oy
     * @param {number} z position of the paiting on the axis Oz
     */
    constructor(app, x, y, z) {
        super();
        this.app = app
        let scale = 0.3

        const semi = 4 / 3;
        const quarter = 4 / 3 * (Math.sqrt(2) - 1);
        
        const width = 18 * scale;
        const height = 10 * scale;
        const frameWidth = scale; 
        const fullHeight = height + 2 * frameWidth;
        const fullWidth = width + 2 * frameWidth;

        const light = new MyPictureLight(app, width, height);
        light.position.set(x, y + scale, z);
        //this.app.app.scene.add(light.spotLightHelper);
        //this.app.app.scene.add(light.spotLightHelper2);
        light.update();
        this.add(light);

        y -= fullHeight / 2; 
        z += 0.01

        console.log(this.app.offsetX)
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 3 * scale, 0, 0), 
            new THREE.Vector3(- 3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, 0 , 0)], 
            new THREE.Vector3(this.app.offsetX + x - 5 * scale, y - 4 * scale, z))

        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 3 * scale, 0, 0), 
            new THREE.Vector3(- 3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, 0, 0)], 
            new THREE.Vector3(this.app.offsetX + x + 5 * scale, y - 4 * scale, z))
            
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 8 * scale, 0, 0), 
            new THREE.Vector3(- 8 * scale, quarter * 8 * scale, 0), 
            new THREE.Vector3(- quarter * 8 * scale, 8 * scale, 0), 
            new THREE.Vector3(0 , 8 * scale, 0)],
            new THREE.Vector3(this.app.offsetX + x, y - 4 * scale, z))
        
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(0, 4 * scale, 0), 
            new THREE.Vector3(quarter * 4 * scale, 4 * scale, 0), 
            new THREE.Vector3(4 * scale, quarter * 4 * scale, 0), 
            new THREE.Vector3(4 * scale, 0, 0)], 
            new THREE.Vector3(this.app.offsetX + x, y, z))
        
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(0, 4 * scale, 0), 
            new THREE.Vector3(quarter * 4 * scale, 4 * scale, 0), 
            new THREE.Vector3(4 * scale, quarter * 4 * scale, 0), 
            new THREE.Vector3(4 * scale, 0, 0)], 
            new THREE.Vector3(this.app.offsetX + x + 4 * scale, y - 4 * scale, z))

        const group = new THREE.Group();

        const texture = new THREE.TextureLoader().load('textures/dark_wood.jpg');
        
        const bottomStruc = new MyFrame(frameWidth, width, fullWidth, 0.05, texture);
        bottomStruc.position.y = - fullHeight/ 2;
        group.add(bottomStruc);

        const topStruc = new MyFrame(frameWidth, width, fullWidth, 0.05, texture);
        topStruc.rotateZ(Math.PI);
        topStruc.position.y = fullHeight/ 2;
        group.add(topStruc);

        const leftStruc = new MyFrame(frameWidth, height, fullHeight, 0.05, texture);
        leftStruc.rotateZ(-Math.PI/2);
        leftStruc.position.x = - fullWidth / 2;
        group.add(leftStruc);

        const rightStruc = new MyFrame(frameWidth, height, fullHeight, 0.05, texture);
        rightStruc.rotateZ(Math.PI/2);
        rightStruc.position.x = fullWidth / 2;
        group.add(rightStruc);

        const material = new THREE.MeshLambertMaterial({color: "#ffffff"})
        const background = new THREE.PlaneGeometry(width, height);
        const backgroundMesh = new THREE.Mesh(background, material);
        backgroundMesh.receiveShadow = true
        backgroundMesh.castShadow = true
        backgroundMesh.position.z = 0.01
        group.add(backgroundMesh);
        
        z -= 0.01
        group.position.set(x, y, z);
        this.add(group)
    }


}

export { MyBeetle };