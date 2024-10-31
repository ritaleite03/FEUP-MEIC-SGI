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
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis( this )
            this.app.scene.add( this.axis )
        }

        const tierHeightCake = 0.2;
        const baseRadiusCake = 0.5;
        const topRadiusCake = 0.3;
        
        const heightTable = 3;
        const radiusTable = 0.2;
        const xLenghtTable = 6;
        const zLenghtTable = 4;
        const topPositionTable = heightTable + tierHeightCake / 2 + radiusTable / 2;

        const widthBottomChair = 2.5
        const heightBottomChair = 2.0
        const widthTopChair = 2.5
        const heightTopChair = 1.0
        const radiusLegsChair = 0.1
        const heightLegsChair = 1.5
        const radiusBackChair = 0.1
        const heightBackChair = 1.0
        const thicknessChair = 0.2

        const scaleJar = 0.3
        const numberPetals = 5
        const widthPetal = 0.04
        const heightPetal = 0.1
        const radiusStem = 0.01
        const segmentsStem = 20

        const arcPages = 0.6;
        const numberPages = 5;
        const widthNewspaper = 0.3;
        const lengthNewspaper = 0.5;
        const heightNewspaper = 0.25;
        const scaleNewspaper = 2;
        const positionNewspaper = [ xLenghtTable / 4 + 2 * scaleNewspaper * widthNewspaper, heightTable + radiusTable / 2 + 0.001, zLenghtTable / 4 + lengthNewspaper  ];

        const radiusSpiral = 0.4
        const segmentsSpiral = 20
        const heightSpiral = 2
        const heightLevelSpiral = 4

        const lengthRoomWall = 30
        const widthRoomWall = 20
        const heightWall = 10
        const widthWall = 0.5

        const table = new MyTable( this, heightTable, radiusTable, xLenghtTable, zLenghtTable );
        table.position.set(-lengthRoomWall / 4, 0, 0)
        this.app.scene.add( table );

        const walls = new MyWalls( this, lengthRoomWall, widthRoomWall, heightWall, widthWall )
        this.app.scene.add( walls );

        const panorama = new MyPanorama(this.app, lengthRoomWall, widthRoomWall);
        this.app.scene.add( panorama );
        
        const heightSideBoard = 2
        const widthSideBoard = 3
        const depthSideBoard = 0.1
        const heightSideBoardLeg = 0.5
        const radiusSideBoardLeg = 0.1

        const sideboard = new MySideBoard( this, widthSideBoard, widthRoomWall / 3 + 1, heightSideBoard, depthSideBoard, heightSideBoardLeg, radiusSideBoardLeg )
        sideboard.position.set(lengthRoomWall / 3 ,0, - widthRoomWall / 2)
        this.app.scene.add(sideboard)
        
        const widthTV = 7
        const heightTV = 4
        const depthTV = 0.2
        const heightSupportTV = 0.3

        const tv = new MyTV(this, widthTV, heightTV, depthTV, heightSupportTV)
        tv.position.set(lengthRoomWall / 3, heightSideBoardLeg + heightSideBoard, - widthRoomWall / 2 + widthSideBoard / 2)
        this.app.scene.add(tv)

        const cake = new MyCake( this, baseRadiusCake, tierHeightCake, 10 * Math.PI / 6, false, 3, topRadiusCake );
        cake.position.set(-lengthRoomWall / 4, topPositionTable + baseRadiusCake * 0.4 + 0.005, 0)
        this.app.scene.add( cake );
        
        const cakeSlice = new MyCake( this, topRadiusCake, tierHeightCake, 2 * Math.PI / 6, true );
        cakeSlice.position.set( 0.5 -lengthRoomWall / 4, topPositionTable + 0.03, 0.5 );
        this.app.scene.add( cakeSlice );

        const chair1 = new MyChair( this, widthBottomChair, heightBottomChair, widthTopChair, heightTopChair, radiusLegsChair, heightLegsChair, radiusBackChair, heightBackChair, thicknessChair )
        chair1.rotateY( -Math.PI / 6 )
        chair1.position.set( -1 - lengthRoomWall / 4, 0, 3)
        this.app.scene.add( chair1 );

        const chair2 = new MyChair( this, widthBottomChair, heightBottomChair, widthTopChair, heightTopChair, radiusLegsChair, heightLegsChair, radiusBackChair, heightBackChair, thicknessChair )
        chair2.rotateY( Math.PI / 6 + Math.PI)
        chair2.position.set( 1 -lengthRoomWall / 4, 0, -3)
        this.app.scene.add( chair2 );

        const carpet = new MyCarpet(this.app, xLenghtTable*2, zLenghtTable*2, this.carpetPattern, this.carpetReleve);
        carpet.position.set(lengthRoomWall / 4, 0, 0)
        this.app.scene.add(carpet);

        const sofa = new MySofa(this, widthBottomChair, widthBottomChair, heightTopChair * 0.7, this.sofaTexture);
        sofa.rotateY( -Math.PI / 4 - Math.PI);
        sofa.position.set(widthBottomChair, 0, widthRoomWall / 4);
        this.app.scene.add( sofa );

        const sofa2 = new MySofa(this, widthBottomChair, widthBottomChair, heightTopChair * 0.7, this.sofaTexture);
        sofa2.rotateY( Math.PI);
        sofa2.position.set(lengthRoomWall / 4 + widthBottomChair, 0, widthRoomWall / 4 + widthBottomChair);
        this.app.scene.add( sofa2 );
        
        const photos = new THREE.Group();
        
        const photo1 = new MyPicture(this.app, 2.1, 2.7, 0.1, this.picture1);
        photo1.position.x = - 2.0;
        photos.add(photo1);

        const photo2 = new MyPicture(this.app, 2.1, 2.7, 0.1, this.picture2);
        photo2.position.x = 2.0;
        photos.add(photo2);
        
        photos.rotateY(Math.PI/2);
        photos.position.set(-lengthRoomWall / 2, 5, 0);
        this.app.scene.add(photos);

        const flower1 = new MyFlower( this , scaleJar * 1.0,  numberPetals - 0, widthPetal * 1.0, heightPetal * 1.0, radiusStem, segmentsStem );
        const flower2 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 1, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        const flower3 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 2, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        flower1.position.set( xLenghtTable / 4 + 2.5 * scaleJar -lengthRoomWall / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower2.position.set( xLenghtTable / 4 + 2.5 * scaleJar-lengthRoomWall / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower3.position.set( xLenghtTable / 4 + 2.5 * scaleJar-lengthRoomWall / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower1.rotateX( +Math.PI / 40 );
        flower2.rotateZ( +Math.PI / 20 );
        flower3.rotateX( -Math.PI / 40 );
        flower3.rotateZ( -Math.PI / 50 );
        this.app.scene.add( flower1 );
        this.app.scene.add( flower2 );
        this.app.scene.add( flower3 );

        const curtain = new MyCurtain(this, widthRoomWall, lengthRoomWall, heightWall)
        this.app.scene.add(curtain)

        this.drawJar( xLenghtTable / 4 -lengthRoomWall / 4, heightTable + radiusTable / 2, -zLenghtTable / 4, scaleJar )       

        const newspaper = new MyNewspaper( this, arcPages, numberPages, widthNewspaper, lengthNewspaper, heightNewspaper );
        newspaper.rotateY( Math.PI );
        newspaper.scale.set( scaleNewspaper, scaleNewspaper, scaleNewspaper )
        newspaper.position.set( positionNewspaper[0] -lengthRoomWall / 4, positionNewspaper[1],  positionNewspaper[2] );
        this.app.scene.add( newspaper );

        const spiralSpring = new MySpiralSpring(this, radiusSpiral, segmentsSpiral, heightSpiral, heightLevelSpiral)
        //this.app.scene.add(spiralSpring)

        this.planeTexture.repeat.set( 4, 4 * widthRoomWall / lengthRoomWall * 626 / 418 );
        var plane = new THREE.PlaneGeometry( lengthRoomWall, widthRoomWall );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.receiveShadow = true;
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.app.scene.add( this.planeMesh );

        const materialCeilling = new THREE.MeshPhongMaterial( {color: "#ffffff"} )
        const ceilling = new THREE.PlaneGeometry( lengthRoomWall, widthRoomWall );
        const ceillingMesh = new THREE.Mesh( ceilling, materialCeilling );
        ceillingMesh.rotation.x = Math.PI / 2;
        ceillingMesh.position.y = heightWall;
        ceillingMesh.castShadow = true;
        ceillingMesh.receiveShadow = true;
        this.app.scene.add(ceillingMesh)

        const radiusFootLamp = 0.8;
        const heighFootLamp = 0.6
        const radiusPole = 0.1
        const heightPole = 7.5

        const radiusShadeBottomLamp = 1
        const radiusShadeTopLamp = 0.5
        const heighShadeLamp = 1.5 

        const lamp = new MyLamp(this, radiusFootLamp, heighFootLamp, radiusPole, heightPole, radiusShadeBottomLamp, radiusShadeTopLamp, heighShadeLamp)
        lamp.position.set(- lengthRoomWall / 2 + radiusShadeBottomLamp + 0.01, 0, - widthRoomWall/2 + radiusShadeBottomLamp + 0.01)
        this.app.scene.add(lamp)

        // light
        const intensityLight = 50;
        const angleLight = Math.PI / 6;
        const angleSun = Math.PI / 4;
       
        const ambientLight = new THREE.AmbientLight( "#ffffff", 1);
        this.app.scene.add( ambientLight );

        this.representatingSpotLightCeilling( intensityLight, angleLight, -lengthRoomWall / 4, heightWall );
        this.representatingSpotLightCeilling( intensityLight, angleLight, 0, heightWall );
        this.representatingSpotLightCeilling( intensityLight, angleLight, lengthRoomWall / 4, heightWall );

        const spotLightLamp = new THREE.SpotLight( "#ffffff", intensityLight, heightPole + 5, angleLight);
        spotLightLamp.position.set(- lengthRoomWall / 2 + radiusShadeBottomLamp + 0.01, heighFootLamp + heightPole, - widthRoomWall/2 + radiusShadeBottomLamp + 0.01);
        spotLightLamp.target.position.set(- lengthRoomWall / 2 + radiusShadeBottomLamp + 0.01, 0, - widthRoomWall/2 + radiusShadeBottomLamp + 0.01);
        spotLightLamp.castShadow = true;
        this.app.scene.add( spotLightLamp );
        const spotLightLampHelper = new THREE.SpotLightHelper( spotLightLamp );
        //this.app.scene.add( spotLightLampHelper );

        const sun = new THREE.SpotLight( "#ffffff", 1000, lengthRoomWall * 2, angleSun)
        sun.position.set(0,10,20)
        sun.castShadow = true
        this.app.scene.add(sun)
        const sunHelper = new THREE.SpotLightHelper(sun)
        this.app.scene.add(sunHelper)
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