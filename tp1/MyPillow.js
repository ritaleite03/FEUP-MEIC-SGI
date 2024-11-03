import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MyPillow extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width cushion width
     * @param {number} length cushion length
     * @param {number} height cushion height
     */
    constructor(app, width, length, height) {
        super();
        this.type = 'Group';
        this.app = app;

        // variables
        const orderU = 3;
        const orderV = 3; 
        this.samplesU = 10;
        this.samplesV = 10;

        // texture and material
        this.texture = new THREE.TextureLoader().load('textures/pillow.jpg');
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        let planeUVRate = this.samplesV / this.samplesU;
        let planeTextureUVRate = 840 / 480; // image dimensions
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.texture.repeat.set( planeTextureRepeatU, planeTextureRepeatV );

        const material = new THREE.MeshStandardMaterial( {map: this.texture, color: "#ffffff",  roughness: 0.8, metalness: 0.1} );

        const arc = height * 0.25;


        //Cushion top surface
        const controlPointsTop = [
            [
                [ 0, 0, 0, 5 ],
                [ length * 0.2, 0, arc, 1 ],
                [ length * 0.8, 0, arc, 1 ],
                [ length, 0, 0, 5 ]
            ],
            [
                [ arc, 0, width * 0.2, 1 ],
                [ length * 0.2, height, width * 0.2, 1 ],
                [ length * 0.8, height, width * 0.2, 1 ],
                [ length - arc, 0, width * 0.2, 1 ]
            ],
            [
                [ arc, 0, width * 0.8, 1 ],
                [ length * 0.2, height, width * 0.8, 1 ],
                [ length * 0.8, height, width * 0.8, 1 ],
                [ length - arc, 0, width * 0.8, 1 ]
            ],
            [
                [ 0, 0, width, 5 ],
                [ length * 0.2, 0, width - arc, 1 ],
                [ length * 0.8, 0, width - arc, 1 ],
                [ length, 0, width, 5 ]
            ],
        ]

        const topSurf = app.builder.build( controlPointsTop, orderU, orderV, this.samplesU, this.samplesV, material) 

        const holder = new THREE.Object3D();

        const topSurfMesh = new THREE.Mesh( topSurf, material );
        topSurfMesh.castShadow = true;
        topSurfMesh.receiveShadow = true;
        holder.add( topSurfMesh )

        const bottomSurfMesh = new THREE.Mesh( topSurf, material );
        bottomSurfMesh.rotateZ(Math.PI);
        bottomSurfMesh.position.x = length;
        bottomSurfMesh.castShadow = true;
        bottomSurfMesh.receiveShadow = true;
        holder.add( bottomSurfMesh )

        holder.position.set(-length/2, 0, - width/2);

        this.add(holder)
    }
}

MyPillow.prototype.isGroup = true;

export {  MyPillow  };