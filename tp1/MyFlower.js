import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a flower
 */
class MyFlower extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} scale scale of the flower
     * @param {number} numberPetals number of petals
     * @param {number} widthPetal width of the petal
     * @param {number} heightPetal height of the petal
     * @param {number} radiusStem radius of the flower's stem
     * @param {number} segmentsStem number of segments to do flower's stem
     */
    constructor(app, scale, numberPetals, widthPetal, heightPetal, radiusStem, segmentsStem) {
        super();
        this.app = app;
        this.type = 'Group';

        // variables
        const radiusCenter = radiusStem * 2;
        const xCenter = 0.1 * scale;
        const yCenter = 4 * scale + radiusCenter - radiusCenter / 2;
        const zCenter = 0;
        const intervalPetals = 2 * Math.PI / numberPetals;
        let anglePetals = 0;

        // textures
        const textureStem = new THREE.TextureLoader().load('textures/stem.png');
        textureStem.wrapS = THREE.RepeatWrapping;
        textureStem.wrapT = THREE.RepeatWrapping;
        const texturePetal = new THREE.TextureLoader().load('textures/petal.jpg');    

        // materials
        const materialStem = new THREE.MeshPhongMaterial( { color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: textureStem } );
        const materialcenter = new THREE.MeshPhongMaterial( { color: "#a4a832" } );
        const materialPetal = new THREE.MeshPhongMaterial( { color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texturePetal } );

        // definition of the stem's curve
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 0.0 * scale, 0 * scale, 0.0 * scale),
            new THREE.Vector3( 0.1 * scale, 1 * scale, 0.1 * scale ),
            new THREE.Vector3( 0.1 * scale, 2 * scale, 0.2 * scale ),
            new THREE.Vector3( 0.2 * scale, 3 * scale, 0.1 * scale ),
            new THREE.Vector3( 0.1 * scale, 4 * scale, 0.0 * scale ),
        ]);

        // geometry and mesh of the stem
        const stem = new THREE.TubeGeometry( curve, segmentsStem, radiusStem, segmentsStem, false );
        const meshStem = new THREE.Mesh( stem, materialStem );
        meshStem.castShadow = true;
        meshStem.receiveShadow = true;
        this.add( meshStem );

        // geometry and mesh of the center
        const center = new THREE.SphereGeometry( radiusCenter );
        const meshCenter = new THREE.Mesh( center, materialcenter );
        meshCenter.castShadow = true;
        meshCenter.receiveShadow = true;
        meshCenter.position.set( xCenter, yCenter, zCenter );
        this.add( meshCenter );

        // geometry and mesh of the petals
        const petal = new THREE.SphereGeometry();    
        for (let i = 0; i < numberPetals; i++) {

            // mesh and holder to the operations on the right order
            const mesh = new THREE.Mesh(petal, materialPetal);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const holder = new THREE.Object3D();
            
            // scale to right dimensions, rotate and position on center of flower
            mesh.scale.set(heightPetal, 0.001, widthPetal);
            mesh.rotateY(anglePetals);          
            mesh.position.set(xCenter, yCenter, zCenter);
            holder.add(mesh);
            
            // position on the circle of petals
            holder.position.set(-Math.cos(anglePetals) * heightPetal, 0, Math.sin(anglePetals) * heightPetal);
            this.add(holder);
            
            // increment angle of the petal
            anglePetals += intervalPetals;
        }
    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower };