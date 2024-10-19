import * as THREE from 'three';

/**
 * This class contains the representation of a petals
 */
class MyPetals extends THREE.Object3D {

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
            const petalX = Math.cos(angle) * radius - radiusCenter * 2.5;
            const petalZ = Math.sin(angle) * radius;
            mesh.position.set(petalX, 4 * scale, petalZ);
            mesh.scale.set(widthPetal / 3, heightPetal / 2 + radiusCenter / 2, widthPetal / 3);        
            mesh.rotateZ(Math.PI / 2);        
            holder.add(mesh);        
            holder.rotateY(angle);        
            this.add(holder);        
            angle += interval;
        }
    }
}

export { MyPetals };