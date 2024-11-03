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
import { MySideBoard } from './MySideBoard.js';
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
        this.planeTexture = new THREE.TextureLoader().load('textures/wood_floor.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.MirroredRepeatWrapping;
        //this.loadTextures()
        const loader = new THREE.TextureLoader();
        this.picture1 = loader.load('textures/202105309.jpg');
        this.picture2 = loader.load('textures/202108699.jpg');
        this.sofaTexture = loader.load('textures/gray-sofa.jpg');
        this.carpetPattern = loader.load('textures/carpet-hexagonal.jpg');
        this.carpetPattern2 = loader.load('textures/carpet.jpg');
        
        // material
        this.diffusePlaneColor = "#f0e6cc"
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

        this.offsetX = this.lengthRoom / 4

        // ceilling lights
        this.spotLightCeilling0 = null
        this.spotLightCeilling1 = null
        this.spotLightCeilling2 = null
        this.spotLightCeillingHelper0 = null
        this.spotLightCeillingHelper1 = null
        this.spotLightCeillingHelper2 = null

        this.intensityCeilling = 150
        this.angleCeilling = 45
        this.colorCeilling = '#ffffff'
        this.penumbraCeilling = 0.3
        this.decayCeilling = 2
        this.xCeilling = [-this.lengthRoom/4,0,this.lengthRoom/4]
        this.helpersEnable = false
        this.helpersLastEnable = false
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
        const angleSun = Math.PI / 4;
       
        const ambientLight = new THREE.AmbientLight( "#ffffff", 0.3);
        this.app.scene.add( ambientLight );

        this.representatingSpotLightCeilling( 0 );
        this.representatingSpotLightCeilling( 1 );
        this.representatingSpotLightCeilling( 2 );
        this.representationLampLight(-this.lengthRoom / 2 + 0.01, -this.widthRoom / 2 + 0.01)

        const sun = new THREE.SpotLight( "#ffffff", 1000, this.lengthRoom * 2, angleSun)
        sun.position.set(this.offsetX,10,20)
        sun.castShadow = true
        sun.target.position.set(this.offsetX, 0, 0)
        this.app.scene.add(sun)
        const sunHelper = new THREE.SpotLightHelper(sun)
        this.app.scene.add(sunHelper)

        const panoramaLight = new THREE.RectAreaLight( "#ffffff", 1,  this.lengthRoom * 2, this.heightWall * 2 );
        panoramaLight.rotateX(-Math.PI / 2)
        panoramaLight.position.set( this.offsetX, this.heightWall / 2, this.widthRoom/2 + this.depthWall );
        panoramaLight.lookAt(  this.offsetX, this.heightWall / 2, this.widthRoom);
        this.app.scene.add( panoramaLight )
    }

    /**
     * adds to the scene the representation of the objects related to the room structure
     */
    representationRoom() {

        const walls = new MyWalls( this, this.lengthRoom, this.widthRoom, this.heightWall, this.depthWall )
        walls.position.set(this.offsetX,0,0)
        this.app.scene.add( walls );

        const panorama = new MyPanorama(this.lengthRoom, this.widthRoom);
        panorama.position.set(this.offsetX,0,0)
        this.app.scene.add( panorama );

        const curtain = new MyCurtain( this, this.widthRoom, this.lengthRoom, this.heightWall )
        curtain.position.set(this.offsetX,0,0)
        this.app.scene.add( curtain )

        const photos = new THREE.Group();
        const photo1 = new MyPicture( 2.1, 2.7, 0.1, this.picture1 );
        photo1.position.x = - 2.0;
        photos.add( photo1 );
        const photo2 = new MyPicture( 2.1, 2.7, 0.1, this.picture2 );
        photo2.position.x = 2.0;
        photos.add( photo2 );
        photos.rotateY( Math.PI/2 );
        photos.position.set( -this.lengthRoom / 2 + this.offsetX, 5, 0 );
        this.app.scene.add( photos );

        this.planeTexture.repeat.set( 4, 4 * this.widthRoom / this.lengthRoom * 626 / 418 );
        const plane = new THREE.PlaneGeometry( this.lengthRoom, this.widthRoom );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.receiveShadow = true;
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.set(this.offsetX, 0, 0)
        this.app.scene.add( this.planeMesh );

        const materialCeilling = new THREE.MeshPhongMaterial( {color: "#ffffff"} )
        const ceilling = new THREE.PlaneGeometry( this.lengthRoom, this.widthRoom );
        const ceillingMesh = new THREE.Mesh( ceilling, materialCeilling );
        ceillingMesh.rotation.x = Math.PI / 2;
        ceillingMesh.position.set(this.offsetX, this.heightWall, 0)
        ceillingMesh.castShadow = true;
        ceillingMesh.receiveShadow = true;
        this.app.scene.add( ceillingMesh )
    }

    /**
     * adds to the scene the representation of the objects related to the dinning area
     */
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

        const table = new MyTable( heightTable, radiusTable, xLenghtTable, zLenghtTable );
        table.position.set( -this.lengthRoom / 4 + this.offsetX, 0, 0 )
        this.app.scene.add( table );
        
        const cake = new MyCake( baseRadiusCake, tierHeightCake, 10 * Math.PI / 6, false, 3, topRadiusCake );
        cake.position.set(-this.lengthRoom / 4 + this.offsetX, topPositionTable + baseRadiusCake * 0.4 + 0.005, 0)
        this.app.scene.add( cake );
        
        const cakeSlice = new MyCake( topRadiusCake, tierHeightCake, 2 * Math.PI / 6, true );
        cakeSlice.position.set( 0.5 -this.lengthRoom / 4 + this.offsetX, topPositionTable + 0.03, 0.5 );
        this.app.scene.add( cakeSlice );

        const chair1 = new MyChair( 2.5, 2, 2.5, 1, 0.1, 1.5, 0.1, 1, 0.2 )
        const chair2 = chair1.clone()
        chair1.rotateY( -1 * Math.PI / 6 )
        chair2.rotateY(  7 * Math.PI / 6 )
        chair1.position.set( -1 - this.lengthRoom / 4 + this.offsetX, 0,  3)
        chair2.position.set(  1 - this.lengthRoom / 4 + this.offsetX, 0, -3)
        this.app.scene.add( chair1 );
        this.app.scene.add( chair2 );

        const carpet = new MyCarpet(0, 0, 6, this.carpetPattern, this.carpetPattern, true);
        carpet.position.set(-this.lengthRoom / 4 + this.offsetX, 0, 0)
        this.app.scene.add(carpet);

        const flower1 = new MyFlower( scaleJar * 1.0,  5, widthPetal * 1.0, heightPetal * 1.0, radiusStem, segmentsStem );
        const flower2 = new MyFlower( scaleJar * 0.9,  4, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        const flower3 = new MyFlower( scaleJar * 0.9,  3, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        flower1.position.set( this.offsetX + xLenghtTable / 4 + 2.5 * scaleJar -this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower2.position.set( this.offsetX + xLenghtTable / 4 + 2.5 * scaleJar-this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower3.position.set( this.offsetX + xLenghtTable / 4 + 2.5 * scaleJar-this.lengthRoom / 4, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower1.rotateX( +Math.PI / 40 );
        flower2.rotateZ( +Math.PI / 20 );
        flower3.rotateX( -Math.PI / 40 );
        flower3.rotateZ( -Math.PI / 50 );
        this.app.scene.add( flower1 );
        this.app.scene.add( flower2 );
        this.app.scene.add( flower3 );

        this.drawJar( xLenghtTable / 4 -this.lengthRoom / 4 + this.offsetX, heightTable + radiusTable / 2, -zLenghtTable / 4, scaleJar )       

        const newspaper = new MyNewspaper( this, 0.6, 5, widthNewspaper, lengthNewspaper, 0.25 );
        newspaper.rotateY( Math.PI );
        newspaper.scale.set( scaleNewspaper, scaleNewspaper, scaleNewspaper )
        newspaper.position.set( positionNewspaper[0] -this.lengthRoom / 4 + this.offsetX, positionNewspaper[1],  positionNewspaper[2] );
        this.app.scene.add( newspaper );
        
        const spiralSpring = new MySpiralSpring( 0.4, 20, 2, 4 )
        spiralSpring.scale.set( 0.25, 0.25, 0.25 )
        spiralSpring.position.set( xLenghtTable / 4 -this.lengthRoom / 4 + this.offsetX, heightTable + radiusTable / 2, -zLenghtTable / 4 )
        this.app.scene.add( spiralSpring )
    }

    /**
     * adds to the scene the representation of the objects related to the living area
     */
    representationLivingRoom() {

        // sideboard's variables
        const heightSB = 2
        const widthSB = 3
        const heightLegSB = 0.5

        // sofa's variables
        const widthS = 2.5
        const heightS = 0.7

        const sideboard = new MySideBoard( widthSB, this.widthRoom / 3 + 1, heightSB, 0.1, heightLegSB, 0.1 )
        sideboard.position.set( this.lengthRoom / 3 + this.offsetX, 0, - this.widthRoom / 2 )
        this.app.scene.add( sideboard )

        const coffeetable = new MyCoffeeTable( 2, 1, 0.1, 1 )
        coffeetable.position.set( this.lengthRoom / 4 + this.offsetX, 0, 0 )
        this.app.scene.add( coffeetable )

        const tv = new MyTV( 7, 4, 0.2, 0.3 )
        tv.position.set( this.lengthRoom / 3 + this.offsetX, heightLegSB + heightSB, - this.widthRoom / 2 + widthSB / 2 )
        this.app.scene.add( tv )

        const carpet = new MyCarpet(0, 0, 6, this.carpetPattern2, this.carpetPattern2, true );
        carpet.position.set( this.lengthRoom / 4 + this.offsetX, 0, 0 )
        this.app.scene.add( carpet );

        const sofa1 = new MySofa( this, widthS, widthS, heightS, this.sofaTexture );
        sofa1.rotateY( -Math.PI / 4 - Math.PI );
        sofa1.position.set( widthS + this.offsetX, heightS * 0.4, this.widthRoom / 4 );
        this.app.scene.add( sofa1 );

        const sofa2 = new MySofa( this, widthS, widthS * 2, heightS, this.sofaTexture );
        sofa2.rotateY( Math.PI );
        sofa2.position.set( this.lengthRoom / 4 + widthS * 1.5 + this.offsetX, heightS * 0.4, this.widthRoom / 4 + widthS );
        this.app.scene.add( sofa2 );
    }

    /**
     * adds to the scene the representation of the lamp
     * @param {number} x position of the lamp in Ox
     * @param {number} z position of the lamp in Oy
     */
    representationLampLight( x, z){

        // variables
        const heighFootLamp = 0.6
        const heightPole = 7.5
        const radiusShadeBottomLamp = 1

        // object
        const lamp = new MyLamp( 0.8, heighFootLamp, 0.1, heightPole, radiusShadeBottomLamp, 0.5, 1.5 )
        lamp.position.set( x + radiusShadeBottomLamp + this.offsetX, 0, z + radiusShadeBottomLamp )
        this.app.scene.add( lamp )

        // light
        const spotLightLamp = new THREE.PointLight( "#ffffff", 10, heightPole + 5);
        spotLightLamp.position.set( x + radiusShadeBottomLamp + this.offsetX, heighFootLamp + heightPole * 0.9, z + radiusShadeBottomLamp );
        spotLightLamp.castShadow = true;
        this.app.scene.add( spotLightLamp );

        // helper
        const spotLightLampHelper = new THREE.PointLightHelper( spotLightLamp );
        //this.app.scene.add( spotLightLampHelper );

    }

    /**
     * adds to the scene the representation of the focus light
     * @param {number} number number of the focus light (there are 3 focus lights)
     */
    representatingSpotLightCeilling(number) {

        // variables
        const radiusfocusExterior = 0.5
        const heightfocusExterior = 0.1
        const heightfocusInterior = 0.01

        // light
        const light = new THREE.SpotLight( this.colorCeilling, this.intensityCeilling, this.heightWall + 5, this.angleCeilling * Math.PI / 180, this.penumbraCeilling, this.decayCeilling);
        light.position.set(  this.xCeilling[number] + this.offsetX, this.heightWall - heightfocusExterior - heightfocusInterior - 0.01, 0 );
        light.target.position.set(this.xCeilling[number] + this.offsetX, 0, 0);
        light.castShadow = true;
        this.app.scene.add( light );
        const helper = new THREE.SpotLightHelper( light );
        //this.app.scene.add( helper );

        // focus exterior
        const focusExterior = new THREE.CylinderGeometry(radiusfocusExterior, radiusfocusExterior, heightfocusExterior)
        const focusExteriorMesh = new THREE.Mesh(focusExterior, this.planeMaterial)
        focusExteriorMesh.position.set( this.xCeilling[number] + this.offsetX, this.heightWall - heightfocusExterior / 2, 0 );
        this.app.scene.add(focusExteriorMesh)

        // focus interior
        const focusInterior = new THREE.CylinderGeometry(radiusfocusExterior / 2, radiusfocusExterior / 2, heightfocusInterior)
        const focusInteriorMaterial = new THREE.MeshPhongMaterial( {color: "#e3dd78", transparent: true, opacity: 0.6,  emissive: "#ffffff"} )
        const focusInteriorMesh = new THREE.Mesh(focusInterior, focusInteriorMaterial)
        focusInteriorMesh.position.set( this.xCeilling[number] + this.offsetX, this.heightWall - heightfocusExterior - heightfocusInterior / 2, 0 );
        this.app.scene.add(focusInteriorMesh)

        if(number == 0){
            this.spotLightCeilling0 = light
            this.spotLightCeillingHelper0 = helper
        }
        if(number == 1){
            this.spotLightCeilling1 = light
            this.spotLightCeillingHelper1 = helper
        }
        if(number == 2){
            this.spotLightCeilling2 = light
            this.spotLightCeillingHelper2 = helper
        }

    }

    /**
     * enables or disables the visibility of the focus lights' helpers
     * @param {number} value indicates if helper is shown or not
     */
    rebuildHelpersCeilling(value){
        this.helpersLastEnable = value

        if( value ) {
            this.spotLightCeillingHelper0 = new THREE.SpotLightHelper( this.spotLightCeilling0 );
            this.app.scene.add( this.spotLightCeillingHelper0 );
            this.spotLightCeillingHelper1 = new THREE.SpotLightHelper( this.spotLightCeilling1 );
            this.app.scene.add( this.spotLightCeillingHelper1 );
            this.spotLightCeillingHelper2 = new THREE.SpotLightHelper( this.spotLightCeilling2 );
            this.app.scene.add( this.spotLightCeillingHelper2 );
        }
        else {
            this.app.scene.remove( this.spotLightCeillingHelper0 )
            this.app.scene.remove( this.spotLightCeillingHelper1 )
            this.app.scene.remove( this.spotLightCeillingHelper2 )
        }
    }

    /**
     * rebuilds the focus lights with the new specifications of intensity or angle
     * @param {number} value indicates if helper is shown or not
     */
    rebuildSpotLightCeilling(number) {

        if( number == 0 ) {
            if( this.spotLightCeilling0 != null && this.spotLightCeilling0 != undefined )
                this.app.scene.remove( this.spotLightCeilling0 )
            if( this.spotLightCeillingHelper0 != null && this.spotLightCeillingHelper0 != undefined )
                this.app.scene.remove( this.spotLightCeillingHelper0 )
        }
        if( number == 1 ) {
            if( this.spotLightCeilling1 != null && this.spotLightCeilling1 != undefined )
                this.app.scene.remove( this.spotLightCeilling1 )
            if( this.spotLightCeillingHelper1 != null && this.spotLightCeillingHelper1 != undefined )
                this.app.scene.remove( this.spotLightCeillingHelper1 )
        }
        if( number == 2 ){
            if( this.spotLightCeilling2 != null && this.spotLightCeilling2 != undefined )
                this.app.scene.remove( this.spotLightCeilling2 )
            if( this.spotLightCeillingHelper2 != null && this.spotLightCeillingHelper2 != undefined )
                this.app.scene.remove( this.spotLightCeillingHelper2 )
        }

        // variables
        const heightfocusExterior = 0.1
        const heightfocusInterior = 0.01

        // light
        const light = new THREE.SpotLight( this.colorCeilling, this.intensityCeilling, this.heightWall + 5, this.angleCeilling * Math.PI / 180, this.penumbraCeilling, this.decayCeilling);
        light.position.set( this.xCeilling[number] + this.offsetX, this.heightWall - heightfocusExterior - heightfocusInterior - 0.01, 0 );
        light.target.position.set( this.xCeilling[number] + this.offsetX, 0, 0 );
        light.castShadow = true;
        this.app.scene.add( light );

        // helper
        let helper = null
        if(this.helpersLastEnable) {
            helper = new THREE.SpotLightHelper( light );
            this.app.scene.add( helper );
        }

        if( number == 0 ) {
            this.spotLightCeilling0 = light
            this.spotLightCeillingHelper0 = helper
        }
        if( number == 1 ) {
            this.spotLightCeilling1 = light
            this.spotLightCeillingHelper1 = helper
        }
        if( number == 2 ) {
            this.spotLightCeilling2 = light
            this.spotLightCeillingHelper2 = helper
        }
    }

    /**
     * draws a cubic bezier curve
     * @param {Array<number>} points curve's points of control
     * @param {number} position position of the curve
     */
    drawCubicBezierCurve(points, position) {

        // define the curve
        const numberSamples = 20;
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
     * adds to the scene to jar object
     * @param {number} x position in Ox
     * @param {number} y position in Oy
     * @param {number} z position in Oz
     * @param {number} scale scale of the jar
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

    /**
     * adds to the scene to curtains object
     * @param {number} height height of the curtain
     * @param {number} x position in Ox
     * @param {number} y position in Oy
     * @param {number} z position in Oz
     */
    drawCurtains(height, x, y, z) {
        
        x += this.offsetX
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