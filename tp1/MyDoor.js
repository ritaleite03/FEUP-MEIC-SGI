import * as THREE from 'three';

class MyDoor extends THREE.Object3D {

    constructor(app, width, height, depth) {
        super()
        this.app = app

        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})
        
        const whiteMaterial = new THREE.MeshPhongMaterial( {color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20} )
        const glassMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, transparent: true, opacity: 0.5})

        // variables

        const widthFrame = width * 0.2
        const widthGlass = width * 0.8
        const heightGlass = height - width * 0.4
        const depthHandle = 0.1
        const heightHandleDoor = 0.3
        const heightHandleHand = 0.5

        // geometries

        const doorVertical = new THREE.BoxGeometry( widthFrame, height, depth )
        const doorHorizontal = new THREE.BoxGeometry( widthFrame, widthGlass, depth )
        const doorGlass = new THREE.BoxGeometry( widthGlass, heightGlass, depth / 2 )
        const handleDoor = new THREE.BoxGeometry( depthHandle, heightHandleDoor, depthHandle )
        const handleHand = new THREE.BoxGeometry( depthHandle, heightHandleHand, depthHandle )
        const handleCircle = new THREE.CylinderGeometry( 0.2, 0.2, 0.05)

        // meshes

        // frame

        const doorVertical1Mesh = new THREE.Mesh( doorVertical, woodenMaterial )
        doorVertical1Mesh.position.set( widthFrame / 2, height / 2, 0 )
        this.add( doorVertical1Mesh )

        const doorVertical2Mesh = new THREE.Mesh( doorVertical, woodenMaterial )
        doorVertical2Mesh.position.set( widthGlass + widthFrame, height / 2, 0 )
        this.add( doorVertical2Mesh )

        const doorHorizontal1Mesh = new THREE.Mesh( doorHorizontal, woodenMaterial )
        doorHorizontal1Mesh.rotateZ( Math.PI / 2 )
        doorHorizontal1Mesh.position.set( widthGlass / 2 + widthFrame, height - widthFrame / 2, 0 )
        this.add( doorHorizontal1Mesh )

        const doorHorizontal2Mesh = new THREE.Mesh( doorHorizontal, woodenMaterial )
        doorHorizontal2Mesh.rotateZ( Math.PI / 2 )
        doorHorizontal2Mesh.position.set( widthGlass / 2 + widthFrame, widthFrame / 2, 0 )
        this.add( doorHorizontal2Mesh )

        // glass

        const doorGlassMesh = new THREE.Mesh( doorGlass, glassMaterial )
        doorGlassMesh.position.set( widthFrame + widthGlass / 2, height / 2, 0 )
        this.add( doorGlassMesh )

        // handle interior

        const handleCircle1Mesh = new THREE.Mesh( handleCircle, whiteMaterial )
        handleCircle1Mesh.rotateX( Math.PI / 2 )
        handleCircle1Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, -depth / 2)
        this.add( handleCircle1Mesh )

        const handleDoor1Mesh = new THREE.Mesh( handleDoor, whiteMaterial )
        handleDoor1Mesh.rotateX( Math.PI / 2 )
        handleDoor1Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, -depth / 2 - heightHandleDoor / 2 )
        this.add( handleDoor1Mesh )

        const handleHand1Mesh = new THREE.Mesh( handleHand, whiteMaterial )
        handleHand1Mesh.rotateX( Math.PI / 2 )
        handleHand1Mesh.rotateZ( Math.PI / 2 )
        handleHand1Mesh.position.set( widthFrame + widthGlass - heightHandleHand / 2 + depthHandle / 2, depthHandle / 2 + height / 2, -depth / 2 - depthHandle / 2 - heightHandleDoor )
        this.add( handleHand1Mesh )

        // handle exterior

        const handleCircle2Mesh = new THREE.Mesh( handleCircle, whiteMaterial )
        handleCircle2Mesh.rotateX( Math.PI / 2 )
        handleCircle2Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, depth / 2)
        this.add( handleCircle2Mesh )

        const handleDoor2Mesh = new THREE.Mesh( handleDoor, whiteMaterial )
        handleDoor2Mesh.rotateX( Math.PI / 2 )
        handleDoor2Mesh.position.set( widthFrame + widthGlass, depthHandle / 2 + height / 2, depth / 2 + heightHandleDoor / 2 )
        this.add( handleDoor2Mesh )

        const handleHand2Mesh = new THREE.Mesh( handleHand, whiteMaterial )
        handleHand2Mesh.rotateX( Math.PI / 2 )
        handleHand2Mesh.rotateZ( Math.PI / 2 )
        handleHand2Mesh.position.set( widthFrame + widthGlass - heightHandleHand / 2 + depthHandle / 2, depthHandle / 2 + height / 2, depth / 2 + depthHandle / 2 + heightHandleDoor )
        this.add( handleHand2Mesh )


    }

}

export { MyDoor };