import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a picture frame
 */
class MyPictureLight extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width picture width
     * @param {number} height picture height
     */
    constructor(app, width, height) {
        super();
        this.app = app
        this.type = "Group";

        const dist = height * 0.20;
        const length = width * 0.60;
        const size = 0.05;

        const texture = new THREE.TextureLoader().load('textures/gold-texture.jpg');

        const material = new THREE.MeshPhysicalMaterial({color: "#ffffff", metalness: 0.6,  roughness: 0.1,  map:texture})

        const quarter = 4 / 3 * (Math.sqrt(2) - 1);

        const r = Math.sqrt(dist*dist/2);
        const h = quarter * r;
        const v = h * Math.sin(Math.PI/4);

        const points = [
            new THREE.Vector3(0, 0, 0), 
            new THREE.Vector3(0, v, v), 
            new THREE.Vector3(0, v, dist - v), 
            new THREE.Vector3(0, 0, dist)
        ]

        // Support rod
        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.01, 10, false);
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);
        tubeMesh.position.set(0, 0, size * 0.5)
        this.add(tubeMesh);

        // Wall bracket
        const bracket = new THREE.BoxGeometry(length * 0.3, size, size*0.5);
        const bracketMesh = new THREE.Mesh( bracket, material)
        bracketMesh.position.z = size * 0.25;
        this.add(bracketMesh);

        // Light holder
        const bar = new THREE.BoxGeometry(length, size, size)
        const barMesh = new THREE.Mesh( bar, material )
        barMesh.position.z = dist + size * 0.75;
        this.add(barMesh);

        // Left spot light
        const spotLight = new THREE.SpotLight( "#fff1cc", 3, 6, Math.PI/3, 0.5);
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;        
        spotLight.shadow.camera.near = 0.2;
        spotLight.shadow.camera.far = 6;
        spotLight.shadow.camera.fov = 60;
        spotLight.castShadow = true;
        spotLight.position.set(-length*0.40, -size*0.5, dist + size * 0.75)
        this.add(spotLight);

        const targetSpotLight = new THREE.Object3D();
        targetSpotLight.position.set(
            spotLight.position.x + length*0.20,     
            spotLight.position.y - (height * 0.5), 
            spotLight.position.z - dist / 2  
        );
        this.add(targetSpotLight);
        spotLight.target = targetSpotLight;

        this.spotLightHelper = new THREE.SpotLightHelper( spotLight );

        // Right spot light
        const spotLight2 = new THREE.SpotLight( "#fff1cc", 3, 6, Math.PI/3, 0.5);
        spotLight2.shadow.mapSize.width = 1024;
        spotLight2.shadow.mapSize.height = 1024;        
        spotLight2.shadow.camera.near = 0.2;
        spotLight2.shadow.camera.far = 6;
        spotLight2.shadow.camera.fov = 60;
        spotLight2.castShadow = true;
        spotLight2.position.set(length*0.40, -size*0.5, dist + size * 0.75)
        this.add(spotLight2);

        const targetSpotLight2 = new THREE.Object3D();
        targetSpotLight2.position.set(
            spotLight2.position.x - length*0.20,
            spotLight2.position.y - (height * 0.5), 
            spotLight2.position.z - dist / 2  
        );
        this.add(targetSpotLight2);
        spotLight2.target = targetSpotLight2;

        this.spotLightHelper2 = new THREE.SpotLightHelper( spotLight2 );

        this.spotLightHelper.update()
        this.spotLightHelper2.update()
    }

    update() {
        this.spotLightHelper.update()
        this.spotLightHelper2.update()
    }
}

MyPictureLight.prototype.isGroup = true;

export { MyPictureLight };