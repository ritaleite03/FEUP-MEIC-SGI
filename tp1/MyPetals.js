import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a petals
 */
class MyPetals extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} scale scale of the petals
     * @param {number} numberPetals number of petals
     * @param {number} widthPetal width of the petal
     * @param {number} heightPetal height of the petal
     * @param {number} radiusCenter radius of the center of the flower
     */
    constructor(app, scale, numberPetals, widthPetal, heightPetal, radiusCenter) {
        super();
        this.type = 'Group';

        const petal = new THREE.SphereGeometry();
        const texturePetal = new THREE.TextureLoader().load('textures/petal.jpg');
        const materialPetal = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: texturePetal })
        let interval = 2 * Math.PI / numberPetals;
        let angle = 0;
        
        for (let i = 0; i < numberPetals; i++) {
            const mesh = new THREE.Mesh(petal, materialPetal);
            const holder = new THREE.Object3D();
            const radius = 0.5 * scale;
            const petalX = Math.cos(angle) * radius - radiusCenter * 2;
            const petalZ = Math.sin(angle) * radius;
            mesh.position.set(petalX, 4 * scale, petalZ);
            mesh.scale.set(widthPetal, heightPetal, widthPetal);        
            mesh.rotateZ(Math.PI / 2);        
            holder.add(mesh);        
            holder.rotateY(angle);        
            this.add(holder);        
            angle += interval;
        }
    }
}

export { MyPetals };