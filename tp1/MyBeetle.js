import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyFrame } from './MyFrame.js';

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
        
        const length = 18 * scale;
        const width = 10 * scale;
        const frameWidth = 2 * scale; 
        const fullLength = length + 2 * frameWidth;
        const fullWidth = width + 2 * frameWidth;

        y -= fullWidth / 2; 

        z += 0.01


        // draw Beetle
        //back wheel 
        //this.app.drawCubicBezierCurve([
        //    new THREE.Vector3(x - 3 * scale, y, z), 
        //    new THREE.Vector3(x - 3 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 3 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 3 * scale, y , z)], 
        //    new THREE.Vector3(x + 3 * scale, y, z))
        //
        ////front wheel
        //this.app.drawCubicBezierCurve([
        //    new THREE.Vector3(x - 3 * scale, y, z), 
        //    new THREE.Vector3(x - 3 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 3 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 3 * scale, y , z)], 
        //    new THREE.Vector3(x + 13 * scale, y, z))  
        //
        //this.app.drawCubicBezierCurve([
        //    new THREE.Vector3(x, y, z), 
        //    new THREE.Vector3(x, y + 4 / 3 * (Math.sqrt(2) - 1) * 8 * scale, z), 
        //    new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 8 * scale, y + 8 * scale, z), 
        //    new THREE.Vector3(x + 8 * scale, y + 8 * scale, z)],
        //    new THREE.Vector3(x, y, z))
        //
        //this.app.drawCubicBezierCurve([
        //    new THREE.Vector3(x, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 4 * scale, y + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, z), 
        //    new THREE.Vector3(x + 4 * scale, y, z)], 
        //    new THREE.Vector3(x + 8 * scale, y + 4 * scale, z))
        //
        //this.app.drawCubicBezierCurve([
        //    new THREE.Vector3(x, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, y + 4 * scale, z), 
        //    new THREE.Vector3(x + 4 * scale, y + 4 / 3 * (Math.sqrt(2) - 1) * 4 * scale, z), 
        //    new THREE.Vector3(x + 4 * scale, y, z)], 
        //    new THREE.Vector3(x + 12 * scale, y, z))
        //

        //center = (x,y,z)
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 3 * scale, 0, 0), 
            new THREE.Vector3(- 3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, 0 , 0)], 
            new THREE.Vector3(x - 5 * scale, y - 4 * scale, z))

        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 3 * scale, 0, 0), 
            new THREE.Vector3(- 3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, semi * 3 * scale, 0), 
            new THREE.Vector3(3 * scale, 0, 0)], 
            new THREE.Vector3(x + 5 * scale, y - 4 * scale, z))
            
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(- 8 * scale, 0, 0), 
            new THREE.Vector3(- 8 * scale, quarter * 8 * scale, 0), 
            new THREE.Vector3(- quarter * 8 * scale, 8 * scale, 0), 
            new THREE.Vector3(0 , 8 * scale, 0)],
            new THREE.Vector3(x, y - 4 * scale, z))
        
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(0, 4 * scale, 0), 
            new THREE.Vector3(quarter * 4 * scale, 4 * scale, 0), 
            new THREE.Vector3(4 * scale, quarter * 4 * scale, 0), 
            new THREE.Vector3(4 * scale, 0, 0)], 
            new THREE.Vector3(x, y, z))
        
        this.app.drawCubicBezierCurve([
            new THREE.Vector3(0, 4 * scale, 0), 
            new THREE.Vector3(quarter * 4 * scale, 4 * scale, 0), 
            new THREE.Vector3(4 * scale, quarter * 4 * scale, 0), 
            new THREE.Vector3(4 * scale, 0, 0)], 
            new THREE.Vector3(x + 4 * scale, y - 4 * scale, z))

        const group = new THREE.Group();
        
        const bottomStruc = new MyFrame(frameWidth, length, fullLength);
        bottomStruc.position.y = - fullWidth / 2;
        group.add(bottomStruc);

        const topStruc = new MyFrame(frameWidth, length, fullLength);
        topStruc.rotateZ(Math.PI);
        topStruc.position.y = fullWidth / 2;
        group.add(topStruc);

        const leftStruc = new MyFrame(frameWidth, width, fullWidth);
        leftStruc.rotateZ(-Math.PI/2);
        leftStruc.position.x = - fullLength/ 2;
        group.add(leftStruc);

        const rightStruc = new MyFrame(frameWidth, width, fullWidth);
        rightStruc.rotateZ(Math.PI/2);
        rightStruc.position.x = fullLength / 2;
        group.add(rightStruc);

        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#ffffff", shininess: 0})
        const background = new THREE.PlaneGeometry(length, width);
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