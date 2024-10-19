import * as THREE from 'three';
import { MyPetals } from './MyPetals.js';

/**
 * This class contains the representation of a flower
 */
class MyFlower extends THREE.Object3D {

    constructor(app, scale, numberPetals, widthPetal, heightPetal) {
        super();
        this.type = 'Group';
        const radiusStem = 0.02

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 0.1 * scale, 1 * scale, 0.1 * scale ),
            new THREE.Vector3( 0.1 * scale, 2 * scale, 0.2 * scale),
            new THREE.Vector3( 0.2 * scale, 3 * scale, 0.1 * scale ),
            new THREE.Vector3( 0.1 * scale, 4 * scale, 0 )
        ]);

        const textureStem = new THREE.TextureLoader().load('textures/stem.png');
        textureStem.wrapS = THREE.RepeatWrapping;
        textureStem.wrapT = THREE.RepeatWrapping;
        const materialStem = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: textureStem })
        const stem = new THREE.TubeGeometry( curve, 20, radiusStem / 2, 8, false );
        const meshStem = new THREE.Mesh( stem, materialStem );
        this.add(meshStem);

        const circle = new THREE.SphereGeometry( radiusStem )
        const materialCircle = new THREE.MeshPhongMaterial( { color: "#a4a832" } );
        const meshCircle = new THREE.Mesh( circle, materialCircle )
        meshCircle.rotateX( -Math.PI / 2 )
        meshCircle.position.set( 0.1 * scale, 4 * scale + radiusStem / 2, 0 )
        this.add(meshCircle);

        const petals = new MyPetals( app, scale, numberPetals, widthPetal, heightPetal, radiusStem )
        petals.position.x = - radiusStem * 4
        this.add(petals)
    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower };