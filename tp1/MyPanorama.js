import * as THREE from 'three';

class MyPanorama extends THREE.Object3D {

    /**
    * @param {number} lengthRoom room length
    * @param {number} widthRoom  room width
    */ 
    constructor(lengthRoom, widthRoom) {
        super()
        
        const landescapeTexture = new THREE.TextureLoader().load('textures/window.jpg')
        landescapeTexture.magFilter = THREE.LinearFilter;
        const landescapeMaterial = new THREE.MeshStandardMaterial({color: "#ffffff", map: landescapeTexture,  side: THREE.BackSide});
        
        const l = lengthRoom / 2;
        const w = widthRoom / 2;
        const radius = Math.sqrt(l*l + w*w) + 3;

        const geometry = new THREE.SphereGeometry( radius, 16, 16, Math.PI/6, 2*Math.PI/3, Math.PI/3.5, Math.PI/3.5);
        const panorama = new THREE.Mesh( geometry, landescapeMaterial ); 
        this.add( panorama );
    }

}

export { MyPanorama };