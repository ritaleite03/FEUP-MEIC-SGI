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
     * @param {number} length picture length
     * @param {number} frameWidth frame width
     * @param {texture} picture picture texture
     */
    constructor(app, width, length, dist) {
        super();
        this.app = app
        this.type = "Group";

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

        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.01, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);

        tubeMesh.position.set(0, 0, width*0.5)
        this.add(tubeMesh);

        const spotLight = new THREE.SpotLight( "#fefe7c", 10, 10, Math.PI/6, 0);
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;        
        spotLight.shadow.camera.near = 0.2;
        spotLight.shadow.camera.far = 4;
        spotLight.shadow.camera.fov = 30;
        spotLight.target.position.set(-length*0.10, -length, width + dist)
        spotLight.position.set(-length*0.25, -width*0.5, width + dist)
        this.add(spotLight);

        const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        this.add( spotLightHelper );

        const spotLight2 = new THREE.SpotLight( "#fefe7c", 10, 10, Math.PI/6, 0);
        spotLight2.shadow.mapSize.width = 1024;
        spotLight2.shadow.mapSize.height = 1024;        
        spotLight2.shadow.camera.near = 0.2;
        spotLight2.shadow.camera.far = 4;
        spotLight2.shadow.camera.fov = 30;
        spotLight2.target.position.set(length*0.10, -length, width + dist)
        spotLight2.position.set(length*0.25, -width*0.5, width + dist)
        this.add(spotLight2);

        const spotLightHelper2 = new THREE.SpotLightHelper( spotLight2 );
        this.add( spotLightHelper2 );


        const suport = new THREE.BoxGeometry(length*0.2, width, width*0.5);
        const suportMesh = new THREE.Mesh( suport, material)
        suportMesh.position.z = width * 0.25;
        this.add(suportMesh);

        const bar = new THREE.BoxGeometry(length, width, width)
        const barMesh = new THREE.Mesh( bar, material )
        barMesh.position.z = width + dist;
        this.add(barMesh);

        spotLightHelper.update()
        spotLightHelper2.update()
    }
}

MyPictureLight.prototype.isGroup = true;


export { MyPictureLight };