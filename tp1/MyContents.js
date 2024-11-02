import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyWalls } from './MyWalls.js';
import { MyCake } from './MyCake.js';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyPicture } from './MyPicture.js';
import { MyFlower } from './MyFlower.js';
import { MyNewspaper } from './MyNewsPaper.js';
import { MySpiralSpring } from './MySpiralSpring.js';
import { MyLamp } from './MyLamp.js';
import { MyCurtain } from './MyCurtain.js';
import { MyTV } from './MyTV.js';
import { MySideBoard } from './SideBoard.js';
import { MySofa } from './MySofa.js';
import { MyCarpet } from './MyCarpet.js';
import { MyPanorama } from './MyPanorama.js';
import { MyCoffeeTable } from './MyCoffeeTable.js';


/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app;
        this.axis = null;

        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;
        //this.loadTextures()
        const loader = new THREE.TextureLoader();
        this.picture1 = loader.load('textures/202105309.jpg');
        this.picture2 = loader.load('textures/202108699.jpg');
        this.sofaTexture = loader.load('textures/gray-sofa4.jpg');
        this.carpetPattern = loader.load('textures/carpet-hexagonal.jpg');
        this.carpetReleve = loader.load('textures/gray-carpet.jpg');
        
        // material
        this.diffusePlaneColor =  "#ffffff"
        this.specularPlaneColor = "#000000"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.planeTexture }) // alternative 1

        // curves
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8
        this.samplesV = 8 

        // variables
        this.lengthRoom = 30
        this.widthRoom = 20
        this.heightWall = 10
        this.depthWall = 0.5
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis( this )
            this.app.scene.add( this.axis )
        }
        
        this.representationRoom()
        this.representationDiningRoom()
        this.representationLivingRoom()

        // light
        const intensityLight = 50;
        const angleLight = Math.PI / 6;
        const angleSun = Math.PI / 4;
       
        const ambientLight = new THREE.AmbientLight( "#ffffff", 1);
        this.app.scene.add( ambientLight );

        this.representatingSpotLightCeilling( intensityLight, angleLight, -this.lengthRoom / 4, this.heightWall );
        this.representatingSpotLightCeilling( intensityLight, angleLight, 0, this.heightWall );
        this.representatingSpotLightCeilling( intensityLight, angleLight, this.lengthRoom / 4, this.heightWall );
        this.representationLampLight(-this.lengthRoom / 2 + 0.01, -this.widthRoom / 2 + 0.01, intensityLight, angleLight)

        const sun = new THREE.SpotLight( "#ffffff", 1000, this.lengthRoom * 2, angleSun)
        sun.position.set(0,10,20)
        sun.castShadow = true
        this.app.scene.add(sun)
        const sunHelper = new THREE.SpotLightHelper(sun)
        this.app.scene.add(sunHelper)
    }

    representationRoom() {

        const walls = new MyWalls( this, this.lengthRoom, this.widthRoom, this.heightWall, this.depthWall )
        this.app.scene.add( walls );

        const panorama = new MyPanorama(this.app, this.lengthRoom, this.widthRoom);
        this.app.scene.add( panorama );

        const curtain = new MyCurtain( this, this.widthRoom, this.lengthRoom, this.heightWall )
        this.app.scene.add( curtain )

        const photos = new THREE.Group();
        const photo1 = new MyPicture( this.app, 2.1, 2.7, 0.1, this.picture1 );
        photo1.position.x = - 2.0;
        photos.add( photo1 );
        const photo2 = new MyPicture( this.app, 2.1, 2.7, 0.1, this.picture2 );
        photo2.position.x = 2.0;
        photos.add( photo2 );
        photos.rotateY( Math.PI/2 );
        photos.position.set( -this.lengthRoom / 2, 5, 0 );
        this.app.scene.add( photos );

        this.planeTexture.repeat.set( 4, 4 * this.widthRoom / this.lengthRoom * 626 / 418 );
        const plane = new THREE.PlaneGeometry( this.lengthRoom, this.widthRoom );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.receiveShadow = true;
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.app.scene.add( this.planeMesh );

        const materialCeilling = new THREE.MeshPhongMaterial( {color: "#ffffff"} )
        const ceilling = new THREE.PlaneGeometry( this.lengthRoom, this.widthRoom );
        const ceillingMesh = new THREE.Mesh( ceilling, materialCeilling );
        ceillingMesh.rotation.x = Math.PI / 2;
        ceillingMesh.position.y = this.heightWall;
        ceillingMesh.castShadow = true;
        ceillingMesh.receiveShadow = true;
        this.app.scene.add( ceillingMesh )
    }

    representationDiningRoom() {

        const tierHeightCake = 0.2;
        const baseRadiusCake = 0.5;
        const topRadiusCake = 0.3;
        
        const heightTable = 3;
        const radiusTable = 0.15;
        const xLenghtTable = 6;
        const zLenghtTable = 4;
        const topPositionTable = heightTable + tierHeightCake / 2 + radiusTable / 2;

        const scaleJar = 0.3
        const widthPetal = 0.04
        const heightPetal = 0.1
        const radiusStem = 0.01
        const segmentsStem = 20

        const widthNewspaper = 0.3;
        const lengthNewspaper = 0.5;
        const scaleNewspaper = 2;
        const positionNewspaper = [ xLenghtTable / 4 + 2 * scaleNewspaper * widthNewspaper, heightTable + radiusTable / 2 + 0.001, zLenghtTable / 4 + lengthNewspaper  ];

        const table = new MyTable( this, heightTable, radiusTable, xLenghtTable, zLenghtTable );
        table.position.set( -this.lengthRoom / 4, 0, 0 )
        this.app.scene.add( table );
        
        const cake = new MyCake( this, baseRadiusCake, tierHeightCake, 10 * Math.PI / 6, false, 3, topRadiusCake );
        cake.position.set(-this.lengthRoom / 4, topPositionTable + baseRadiusCake * 0.4 + 0.005, 0)
        this.app.scene.add( cake );
        
        const cakeSlice = new MyCake( this, topRadiusCake, tierHeightCake, 2 * Math.PI / 6, true );
        cakeSlice.position.set( 0.5 -this.lengthRoom / 4, topPositionTable + 0.03, 0.5 );
        this.app.scene.add( cakeSlice );

        const chair1 = new MyChair( this, 2.5, 2, 2.5, 1, 0.1, 1.5, 0.1, 1, 0.2 )
        const chair2 = chair1.clone()
        chair1.rotateY( -1 * Math.PI / 6 )
        chair2.rotateY(  7 * Math.PI / 6 )
        chair1.position.set( -1 - this.lengthRoom / 4, 0,  3)
        chair2.position.set(  1 - this.lengthRoom / 4, 0, -3)
        this.app.scene.add( chair1 );
        this.app.scene.add( chair2 );

        const carpet = new MyCarpet(this.app, 0, 0, 6, this.carpetPattern, this.carpetReleve, true);
        carpet.position.set(-this.lengthRoom / 4, 0, 0)
        this.app.scene.add(carpet);

        const flower1 = new MyFlower( this , scaleJar * 1.0,  5, widthPetal * 1.0, heightPetal * 1.0, radiusStem, segmentsStem );
        const flower2 = new MyFlower( this , scaleJar * 0.9,  4, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        const flower3 = new MyFlower( this , scaleJar * 0.9,  3, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        flower1.position.set( xLenghtTable / 4 + 2.5 * scaleJar -this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower2.position.set( xLenghtTable / 4 + 2.5 * scaleJar-this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower3.position.set( xLenghtTable / 4 + 2.5 * scaleJar-this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower1.rotateX( +Math.PI / 40 );
        flower2.rotateZ( +Math.PI / 20 );
        flower3.rotateX( -Math.PI / 40 );
        flower3.rotateZ( -Math.PI / 50 );
        this.app.scene.add( flower1 );
        this.app.scene.add( flower2 );
        this.app.scene.add( flower3 );

        this.drawJar( xLenghtTable / 4 -this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4, scaleJar )       

        const newspaper = new MyNewspaper( this, 0.6, 5, widthNewspaper, lengthNewspaper, 0.25 );
        newspaper.rotateY( Math.PI );
        newspaper.scale.set( scaleNewspaper, scaleNewspaper, scaleNewspaper )
        newspaper.position.set( positionNewspaper[0] -this.lengthRoom / 4, positionNewspaper[1],  positionNewspaper[2] );
        this.app.scene.add( newspaper );
        
        const spiralSpring = new MySpiralSpring( this, 0.4, 20, 2, 4 )
        spiralSpring.scale.set( 0.25, 0.25, 0.25 )
        spiralSpring.position.set( xLenghtTable / 4 -this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 )
        this.app.scene.add( spiralSpring )
    }

    representationLivingRoom() {

        // sideboard's variables
        const heightSB = 2
        const widthSB = 3
        const heightLegSB = 0.5

        // sofa's variables
        const widthS = 2.5
        const heightS = 0.7

        const sideboard = new MySideBoard( this, widthSB, this.widthRoom / 3 + 1, heightSB, 0.1, heightLegSB, 0.1 )
        sideboard.position.set( this.lengthRoom / 3, 0, - this.widthRoom / 2 )
        this.app.scene.add( sideboard )

        const coffeetable = new MyCoffeeTable( this, 2, 1, 0.1, 1 )
        coffeetable.position.set( this.lengthRoom / 4, 0, 0 )
        this.app.scene.add( coffeetable )

        const tv = new MyTV( this, 7, 4, 0.2, 0.3 )
        tv.position.set( this.lengthRoom / 3, heightLegSB + heightSB, - this.widthRoom / 2 + widthSB / 2 )
        this.app.scene.add( tv )

        const carpet = new MyCarpet( this.app, 0, 0, 6, this.carpetPattern, this.carpetReleve, true );
        carpet.position.set( this.lengthRoom / 4, 0, 0 )
        this.app.scene.add( carpet );

        const sofa1 = new MySofa( this, widthS, widthS, heightS, this.sofaTexture );
        sofa1.rotateY( -Math.PI / 4 - Math.PI );
        sofa1.position.set( widthS, heightS * 0.4, this.widthRoom / 4 );
        this.app.scene.add( sofa1 );

        const sofa2 = new MySofa( this, widthS, widthS, heightS, this.sofaTexture );
        sofa2.rotateY( Math.PI );
        sofa2.position.set( this.lengthRoom / 4 + widthS, heightS * 0.4, this.widthRoom / 4 + widthS );
        this.app.scene.add( sofa2 );
    }

    representationLampLight( x, z, intensityLight, angleLight ){

        const radiusFootLamp = 0.8;
        const heighFootLamp = 0.6
        const radiusPole = 0.1
        const heightPole = 7.5

        const radiusShadeBottomLamp = 1
        const radiusShadeTopLamp = 0.5
        const heighShadeLamp = 1.5 

        const lamp = new MyLamp( this, radiusFootLamp, heighFootLamp, radiusPole, heightPole, radiusShadeBottomLamp, radiusShadeTopLamp, heighShadeLamp )
        lamp.position.set( x + radiusShadeBottomLamp, 0, z + radiusShadeBottomLamp )
        this.app.scene.add( lamp )

        const spotLightLamp = new THREE.SpotLight( "#ffffff", intensityLight, heightPole + 5, angleLight );
        spotLightLamp.position.set( x + radiusShadeBottomLamp, heighFootLamp + heightPole, z + radiusShadeBottomLamp );
        spotLightLamp.target.position.set( x + radiusShadeBottomLamp, 0, z + radiusShadeBottomLamp );
        spotLightLamp.castShadow = true;
        this.app.scene.add( spotLightLamp );
        const spotLightLampHelper = new THREE.SpotLightHelper( spotLightLamp );
        //this.app.scene.add( spotLightLampHelper );

    }

    representatingSpotLightCeilling(intensity, angle, x, y) {
        // variables
        const radiusfocusExterior = 0.5
        const heightfocusExterior = 0.1
        const heightfocusInterior = 0.01

        // light
        const light = new THREE.SpotLight( "#ffffff", intensity, y + 5, angle);
        light.position.set( x, y - heightfocusExterior - heightfocusInterior - 0.01, 0 );
        light.target.position.set(x, 0, 0);
        light.castShadow = true;
        this.app.scene.add( light );
        const helper = new THREE.SpotLightHelper( light );
        //this.app.scene.add( helper );

        // focus exterior
        const focusExterior = new THREE.CylinderGeometry(radiusfocusExterior, radiusfocusExterior, heightfocusExterior)
        const focusExteriorMesh = new THREE.Mesh(focusExterior, this.planeMaterial)
        focusExteriorMesh.position.set( x, y - heightfocusExterior / 2, 0 );
        this.app.scene.add(focusExteriorMesh)

        // focus interior
        const focusInterior = new THREE.CylinderGeometry(radiusfocusExterior / 2, radiusfocusExterior / 2, heightfocusInterior)
        const focusInteriorMaterial = new THREE.MeshPhongMaterial( {color: "#e3dd78", transparent: true, opacity: 0.6} )
        const focusInteriorMesh = new THREE.Mesh(focusInterior, focusInteriorMaterial)
        focusInteriorMesh.position.set( x, y - heightfocusExterior - heightfocusInterior / 2, 0 );
        this.app.scene.add(focusInteriorMesh)
    }

    drawCubicBezierCurve(points, position) {
        // define the curve
        const numberSamples = 8;
        const curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
        const sampledPoints = curve.getPoints( numberSamples );  
        // draw the curve
        const curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        const lineObj = new THREE.Line( curveGeometry, lineMaterial )
        lineObj.position.set( position.x, position.y, position.z )
        this.app.scene.add( lineObj );
    }

    /**
     * this method is called from init and loads the textures used
    */
    //loadTextures(){
    //    const loader = new THREE.TextureLoader();
    //    loader.load('textures/202105309.jpg', (loadedTexture) => {
    //        this.picture1 = loadedTexture;
    //    });
    //    loader.load('textures/202108699.jpg', (loadedTexture) => {
    //        this.picture2 = loadedTexture;
    //    });
    //    loader.load('textures/gray-sofa4.jpg', (loadedTexture) => {
    //        this.sofaTexture = loadedTexture;
    //    });
    //    loader.load('textures/carpet-hexagonal.jpg', (loadedTexture) => {
    //        this.carpetPattern = loadedTexture;
    //    });
    //    loader.load('textures/gray-carpet.jpg', (loadedTexture) => {
    //        this.carpetReleve = loadedTexture;
    //    });
    //}

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {}

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * removes (if existing) and recreates the nurbs surfaces
     */
    drawJar(x,y,z,scale) {
        const curveSide = [
            [[ 2.0, 0, 0, 1 ],[ 1.0, 2, 0, 1 ],[ 2.0, 3, 0, 1 ]],
            [[ 2.5, 0, 1, 1 ],[ 2.5, 2, 2, 1 ],[ 2.5, 3, 1, 1 ]],
            [[ 3.0, 0, 0, 1 ],[ 4.0, 2, 0, 1 ],[ 3.0, 3, 0, 1 ]],
        ]
        const curveBottom = [
            [[ 2.0, 0.02, 0, 1 ],[ 2.0, 0.01, 0.0, 1 ],[ 2.0, 0, 0, 1 ]],
            [[ 2.5, 0.02, 1, 1 ],[ 2.5, 0.01, 0.5, 1 ],[ 2.5, 0, 0, 1 ]],
            [[ 3.0, 0.02, 0, 1 ],[ 3.0, 0.01, 0.0, 1 ],[ 3.0, 0, 0, 1 ]]
        ]

        const orderSideU= 2
        const orderSideV = 2
        const orderBottomU= 2
        const orderBottomV = 2

        const material = new THREE.MeshLambertMaterial( { color: "#ffffff", side: THREE.DoubleSide, transparent: true, opacity: 0.6 } );             
        let sideJar = this.builder.build( curveSide, orderSideU, orderSideV, this.samplesU, this.samplesV, material )  
        let bottomJar = this.builder.build( curveBottom, orderBottomU, orderBottomV, this.samplesU, this.samplesV, material )  
        
        let frontMesh = new THREE.Mesh( sideJar, material );
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        frontMesh.scale.set( scale, scale, scale )
        frontMesh.position.set( x, y + 0.02 * scale, z )
        this.app.scene.add( frontMesh )

        let backMesh = new THREE.Mesh( sideJar, material );
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        backMesh.scale.set( scale, scale, scale )
        backMesh.position.set( x + scale * 5, y + 0.02 * scale, z )
        backMesh.rotateY( Math.PI )
        this.app.scene.add( backMesh )

        let frontBottomMesh = new THREE.Mesh( bottomJar, material );
        frontBottomMesh.castShadow = true;
        frontBottomMesh.receiveShadow = true;
        frontBottomMesh.scale.set( scale, scale, scale )
        frontBottomMesh.position.set( x, y, z )
        this.app.scene.add( frontBottomMesh )
        
        let backBottomMesh = new THREE.Mesh( bottomJar, material );
        backBottomMesh.castShadow = true;
        backBottomMesh.receiveShadow = true;
        backBottomMesh.scale.set( scale, scale, scale )
        backBottomMesh.position.set( x + scale * 5, y, z )
        backBottomMesh.rotateY( Math.PI )
        this.app.scene.add( backBottomMesh )
    }

    drawCurtains(height, x, y, z) {

        let curve = [
            [[ 0.0, 0, 0.5, 1 ], [ 0.0, height, 0.5, 1 ]],
            [[ 0.5, 0, 1.0, 1 ], [ 0.5, height, 1.0, 1 ]],
            [[ 1.0, 0, 0.5, 1 ], [ 1.0, height, 0.5, 1 ]],
            [[ 1.5, 0, 0.0, 1 ], [ 1.5, height, 0.0, 1 ]],
            [[ 2.0, 0, 0.5, 1 ], [ 2.0, height, 0.5, 1 ]],
        ]

        const orderSideU= 4
        const orderSideV = 1

        let texture = new THREE.TextureLoader().load('textures/fabric.jpg');
        const material = new THREE.MeshPhongMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.8 } );

        let curtain = this.builder.build( curve, orderSideU, orderSideV, this.samplesU, this.samplesV, material )  
        let curtainMesh = new THREE.Mesh( curtain, material );
        curtainMesh.position.set(x, y, z)
        this.app.scene.add( curtainMesh )

    }

}

export { MyContents };