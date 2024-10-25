import * as THREE from 'three';

/**
 * This class contains the representation of the a chair
 */
class MyChair extends THREE.Object3D {

    /**
       @param {MyApp} app The application object
       @param {number} widthPlaneDown width of the chair's plane down (bottom)
       @param {number} heightPlaneDown heigth of the chair's plane down (bottom)
       @param {number} widthPlaneUp width of the chair's plane up (back)
       @param {number} heightPlaneUp heigth of the cchair's plane down (back)
       @param {number} radiusLegDown radius of the chair's legs down (bottom)
       @param {number} heightLegDown height of the chair's legs down (bottom)
       @param {number} radiusLegBack radius of the chair's legs up (back)
       @param {number} heightLegBack height of the chair's legs up (back)
       @param {number} thickness thickness of the wood
    */ 
    constructor(app, widthPlaneDown, heightPlaneDown, widthPlaneUp, heightPlaneUp, radiusLegDown, heightLegDown, radiusLegBack, heightLegBack, thickness) {
        super()
        this.app = app;

        // variables
        const xLegDown = widthPlaneDown / 2 - radiusLegDown;
        const yLegDown = heightLegDown / 2;
        const zLegDown = heightPlaneDown / 2 - radiusLegDown;
        const yPlaneDown = yLegDown * 2 + thickness / 2;
        const xLegUp = widthPlaneDown / 2 - radiusLegDown;
        const yLegUp = yPlaneDown + thickness / 2 + heightLegBack / 2;
        const zLegUp = heightPlaneDown / 2 - radiusLegDown;

        // texture and materials
        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial( { color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture } );

        // geometries
        const planeDown = new THREE.BoxGeometry( widthPlaneDown, heightPlaneDown, thickness );
        const planeUp = new THREE.BoxGeometry( widthPlaneUp, heightPlaneUp, thickness );
        const legDown = new THREE.CylinderGeometry( radiusLegDown, radiusLegDown, heightLegDown );
        const legUp = new THREE.CylinderGeometry( radiusLegBack, radiusLegBack, heightLegBack );

        // mesh legs down (bottom)
        const legDownMesh1 =  new THREE.Mesh (legDown, woodenMaterial);
        const legDownMesh2 =  new THREE.Mesh (legDown, woodenMaterial);
        const legDownMesh3 =  new THREE.Mesh (legDown, woodenMaterial);
        const legDownMesh4 =  new THREE.Mesh (legDown, woodenMaterial);
        legDownMesh1.castShadow = true;
        legDownMesh1.receiveShadow = true;
        legDownMesh2.castShadow = true;
        legDownMesh2.receiveShadow = true;
        legDownMesh3.castShadow = true;
        legDownMesh3.receiveShadow = true;
        legDownMesh4.castShadow = true;
        legDownMesh4.receiveShadow = true;
        legDownMesh1.position.set( +xLegDown, yLegDown, +zLegDown );
        legDownMesh2.position.set( -xLegDown, yLegDown, +zLegDown );
        legDownMesh3.position.set( +xLegDown, yLegDown, -zLegDown );
        legDownMesh4.position.set( -xLegDown, yLegDown, -zLegDown );
        this.add( legDownMesh1 );
        this.add( legDownMesh2 );
        this.add( legDownMesh3 );
        this.add( legDownMesh4 );

        // mesh plane down (bottom)
        const planeDownMesh = new THREE.Mesh( planeDown, woodenMaterial );
        planeDownMesh.castShadow = true;
        planeDownMesh.receiveShadow = true;
        planeDownMesh.rotateX( Math.PI / 2 );
        planeDownMesh.position.y = yPlaneDown;
        this.add( planeDownMesh );

        // mesh legs up (back)
        const legUpMesh1 =  new THREE.Mesh( legUp, woodenMaterial );
        const legUpMesh2 =  new THREE.Mesh( legUp, woodenMaterial );
        legUpMesh1.castShadow = true;
        legUpMesh1.receiveShadow = true;
        legUpMesh2.castShadow = true;
        legUpMesh2.receiveShadow = true;
        legUpMesh1.position.set( +xLegUp, yLegUp, zLegUp);
        legUpMesh2.position.set( -xLegUp, yLegUp, zLegUp);
        this.add( legUpMesh1 );
        this.add( legUpMesh2 );

        // mesh plane up (back)
        const planeUpMesh = new THREE.Mesh( planeUp, woodenMaterial );
        planeUpMesh.castShadow = true;
        planeUpMesh.receiveShadow = true;
        planeUpMesh.position.set( 0, yLegUp + heightLegBack / 2 + heightPlaneUp / 2, heightPlaneDown / 2 - thickness / 2 );
        this.add( planeUpMesh );
    }
}

export { MyChair };