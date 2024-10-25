import * as THREE from 'three';

class MyCurtain extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, widthRoom, lenghtRoom, height) {
        super()
        this.app = app
        
        let texture = new THREE.TextureLoader().load('textures/lamp.jpg');
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(2,1)
        const material = new THREE.MeshPhongMaterial( {color: "#ffffff", map:texture} )

        const yt = height - 1;
        const zt = widthRoom / 2  - 1.5;
        const xr = lenghtRoom / 4;
        const xl = -lenghtRoom / 4 - 2;

        const lenghtPoleH = lenghtRoom / 2 + 4
        const lenghtPoleV = widthRoom / 2 - zt - 0.5

        const poleH = new THREE.CylinderGeometry( 0.05, 0.05, lenghtPoleH )
        const poleV = new THREE.CylinderGeometry( 0.05, 0.05, lenghtPoleV)

        const poleHMesh = new THREE.Mesh( poleH, material )
        poleHMesh.rotateZ( Math.PI / 2 )
        poleHMesh.position.set( 0, yt, zt + 0.5 )
        this.add( poleHMesh )

        const poleVMesh1 = new THREE.Mesh( poleV, material )
        poleVMesh1.rotateX( Math.PI / 2 )
        poleVMesh1.position.set( lenghtRoom / 4, yt, widthRoom / 2 - lenghtPoleV / 2 )
        this.add( poleVMesh1 )

        const poleVMesh2 = new THREE.Mesh( poleV, material )
        poleVMesh2.rotateX( Math.PI / 2 )
        poleVMesh2.position.set( -lenghtRoom / 4, yt, widthRoom / 2 - lenghtPoleV / 2 )
        this.add( poleVMesh2 )

        app.drawCurtains( yt, xr - 0, 0, zt )
        app.drawCurtains( yt, xr - 2, 0, zt )
        app.drawCurtains( yt, xl + 0, 0, zt )
        app.drawCurtains( yt, xl + 2, 0, zt )
    }

}

MyCurtain.prototype.isGroup = true;

export { MyCurtain };