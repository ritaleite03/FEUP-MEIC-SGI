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
import { MyFrame } from './MyFrame.js';
import { MyLamp } from './MyLamp.js';

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
        
        // material
        this.diffusePlaneColor =  "#ffffff"
        this.specularPlaneColor = "#000000"
        this.planeShininess = 0

        //this.planeMaterial = new THREE.MeshLambertMaterial({ map : this.planeTexture }); // alternative 2
        this.planeMaterial = new THREE.MeshPhongMaterial({color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.planeTexture }) // alternative 1
        
        // spotlight related attributes
        this.colorSpotLight = "#ffffff";
        this.intensitySpotLight = 15;
        this.limitDistanceSpotLight = 8
        this.angleSpotLight = 20
        this.penumbraSpotLight = 0
        this.decaySpotLight = 0
        this.xSpotLight = 0
        this.ySpotLight = 8
        this.xTargetSpotLight = 1
        this.yTargetSpotLight = 0

        const loader = new THREE.TextureLoader();
        this.picture1 = loader.load('textures/202105309.jpg');
        this.picture2 = loader.load('textures/202108699.jpg');

        const map = new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 } );
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8 // maximum defined in MyGuiInterface
        this.samplesV = 8 // maximum defined in MyGuiInterface
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis( this )
            this.app.scene.add( this.axis )
        }

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 5 );
        this.app.scene.add( ambientLight );

        // add directional light
        const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.position.set( 0, 10, 0 );
        light2.target.position.set( 0, 0, 0 )
        this.app.scene.add( light2 );
        const light2Helper = new THREE.DirectionalLightHelper( light2, 5 ); 
        this.app.scene.add( light2Helper );

        // add spot light
        this.spotLight = new THREE.SpotLight( this.colorSpotLight, this.intensitySpotLight, this.limitDistanceSpotLight, this.angleSpotLight * Math.PI / 180, this.penumbra, this.decay );
        this.spotLight.position.set( this.xSpotLight, this.ySpotLight, 0 );
        this.spotLight.target.position.set( this.xTargetSpotLight, this.yTargetSpotLight, 0 )
        this.spotLight.castShadow = true;
        this.app.scene.add( this.spotLight );
        this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        this.app.scene.add( this.spotLightHelper );

        const tierHeightCake = 0.2;
        const baseRadiusCake = 0.5;
        const topRadiusCake = 0.3;
        
        const heightTable = 3;
        const radiusTable = 0.2;
        const xLenghtTable = 6;
        const zLenghtTable = 4;
        const topPositionTable = heightTable + tierHeightCake / 2 + radiusTable / 2;

        const widthBottomChair = 5
        const heightBottomChair = 4
        const widthTopChair = 5
        const heightTopChair = 2
        const radiusLegsChair = 0.2
        const heightLegsChair = 3
        const radiusBackChair = 0.2
        const heightBackChair = 2
        const thicknessChair = 0.4

        const scaleJar = 0.2
        const numberPetals = 10
        const widthPetal = 0.01
        const heightPetal = 0.04
        const radiusStem = 0.008
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

        const table = new MyTable( this, heightTable, radiusTable, xLenghtTable, zLenghtTable );
        this.app.scene.add( table );

        const lengthRoomWall = 20
        const widthRoomWall = 15
        const heightWall = 10
        const widthWall = 0.5
        const walls = new MyWalls( this, lengthRoomWall, widthRoomWall, heightWall, widthWall )
        this.app.scene.add( walls );
        
        const cake = new MyCake( this, baseRadiusCake, tierHeightCake, 10 * Math.PI / 6, false, 3, topRadiusCake );
        cake.position.y = topPositionTable + baseRadiusCake * 0.4 + 0.005;
        this.app.scene.add( cake );
        
        const cakeSlice = new MyCake( this, topRadiusCake, tierHeightCake, 2 * Math.PI / 6, true );
        cakeSlice.position.set( 0.5, topPositionTable + 0.03, 0.5 );
        this.app.scene.add( cakeSlice );

        const chair1 = new MyChair( this, widthBottomChair, heightBottomChair, widthTopChair, heightTopChair, radiusLegsChair, heightLegsChair, radiusBackChair, heightBackChair, thicknessChair )
        chair1.rotateY( -Math.PI / 6 )
        chair1.scale.set( 0.5, 0.5, 0.5 )
        chair1.position.set( -1, 0, 3)
        this.app.scene.add( chair1 );

        const chair2 = new MyChair( this, widthBottomChair, heightBottomChair, widthTopChair, heightTopChair, radiusLegsChair, heightLegsChair, radiusBackChair, heightBackChair, thicknessChair )
        chair2.rotateY( Math.PI / 6 + Math.PI)
        chair2.scale.set( 0.5, 0.5, 0.5 )
        chair2.position.set( 1, 0, -3)
        this.app.scene.add( chair2 );
        
        const photos = new THREE.Group();
        
        const photo1 = new MyPicture(this.app, 2.1, 2.7, 0.2, this.picture1);
        photo1.position.x = - 2.0;
        photos.add(photo1);

        const photo2 = new MyPicture(this.app, 2.1, 2.7, 0.2, this.picture2);
        photo2.position.x = 2.0;
        photos.add(photo2);
        
        photos.rotateY(Math.PI/2);
        photos.position.set(-10, 5, 0);
        this.app.scene.add(photos);

        const flower1 = new MyFlower( this , scaleJar * 1.0,  numberPetals - 0, widthPetal * 1.0, heightPetal * 1.0, radiusStem, segmentsStem );
        const flower2 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 1, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        const flower3 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 2, widthPetal * 0.9, heightPetal * 0.9, radiusStem, segmentsStem );
        flower1.position.set( xLenghtTable / 4 + 2.5 * scaleJar, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower2.position.set( xLenghtTable / 4 + 2.5 * scaleJar, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower3.position.set( xLenghtTable / 4 + 2.5 * scaleJar, heightTable + radiusTable / 2, -zLenghtTable / 4 );
        flower1.rotateX( +Math.PI / 40 );
        flower2.rotateZ( +Math.PI / 20 );
        flower3.rotateX( -Math.PI / 40 );
        flower3.rotateZ( -Math.PI / 50 );
        this.app.scene.add( flower1 );
        this.app.scene.add( flower2 );
        this.app.scene.add( flower3 );

        this.createsideJar( xLenghtTable / 4, heightTable + radiusTable / 2, -zLenghtTable / 4, scaleJar )       
        
        const newspaper = new MyNewspaper( this, arcPages, numberPages, widthNewspaper, lengthNewspaper, heightNewspaper );
        newspaper.rotateY( Math.PI );
        newspaper.scale.set( scaleNewspaper, scaleNewspaper, scaleNewspaper )
        newspaper.position.set( positionNewspaper[0], positionNewspaper[1],  positionNewspaper[2] );
        this.app.scene.add( newspaper );

        const spiralSpring = new MySpiralSpring(this, radiusSpiral, segmentsSpiral, heightSpiral, heightLevelSpiral)
        this.app.scene.add(spiralSpring)

        let planeSizeU = 20;
        let planeSizeV = 15;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 3354 / 2385;
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.planeTexture.repeat.set( planeTextureRepeatU, planeTextureRepeatV );
        this.planeTexture.offset = new THREE.Vector2(0,0);
        var plane = new THREE.PlaneGeometry( planeSizeU, planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.castShadow = true;
        this.planeMesh.receiveShadow = true;
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.planeMesh.receiveShadow = true;
        this.app.scene.add( this.planeMesh );

        const materialCeilling = new THREE.MeshPhongMaterial( {color: "#ffffff"} )
        const ceilling = new THREE.PlaneGeometry( planeSizeU, planeSizeV );
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

        const lightLamp = new THREE.SpotLight( "#ffffff", 100, 8, Math.PI / 7);
        lightLamp.position.set(- lengthRoomWall / 2 + radiusShadeBottomLamp + 0.01, heighFootLamp + heightPole, - widthRoomWall/2 + radiusShadeBottomLamp + 0.01)
        lightLamp.target.position.set(- lengthRoomWall / 2 + radiusShadeBottomLamp + 0.01, 0, - widthRoomWall/2 + radiusShadeBottomLamp + 0.01)
        lightLamp.castShadow = true;
        this.app.scene.add( lightLamp );
        const lightHelper = new THREE.SpotLightHelper( lightLamp );
        this.app.scene.add( lightHelper );
        
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
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {}

    /**
     * updates the spot light attributes
     * @param {string} propriety
     * @param {number} value 
     */
    updateSpotLight(propriety, value){
        this.app.scene.remove(this.spotLight)
        this.app.scene.remove(this.spotLightHelper)

        if (propriety === 'color') this.spotLight[propriety].set(value)
        else if (propriety === 'x') this.spotLight.position.x = value;
        else if (propriety === 'y') this.spotLight.position.y = value;
        else if (propriety === 'xTarget') this.spotLight.target.position.x = value;
        else if (propriety === 'yTarget') this.spotLight.target.position.y = value;
        else if (propriety === 'angle') this.spotLight[propriety] = value * Math.PI / 180   
        else this.spotLight[propriety] = value

        this.app.scene.add(this.spotLight)
        this.app.scene.add(this.spotLightHelper)
    }

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
    
    updateSpotLightY(value){
        this.ySpotLight = value
        this.spotLight.position.y = value
    }
    
    /**
     * removes (if existing) and recreates the nurbs surfaces
     */
    createsideJar(x,y,z,scale) {
        if (this.meshes !== null) {
            for (let i=0; i<this.meshes.length; i++) this.app.scene.remove( this.meshes[i] )
            this.meshes = [] 
        }

        let controlPointsSide = [
            [[ 2.0, 0, 0, 1 ],[ 1.0, 2, 0, 1 ],[ 2.0, 3, 0, 1 ]],
            [[ 2.5, 0, 1, 1 ],[ 2.5, 2, 2, 1 ],[ 2.5, 3, 1, 1 ]],
            [[ 3.0, 0, 0, 1 ],[ 4.0, 2, 0, 1 ],[ 3.0, 3, 0, 1 ]],
        ]

        let controlPointsBottom = [
            [[ 2.0, 0.02, 0, 1 ],[ 2.0, 0.01, 0.0, 1 ],[ 2.0, 0, 0, 1 ]],
            [[ 2.5, 0.02, 1, 1 ],[ 2.5, 0.01, 0.5, 1 ],[ 2.5, 0, 0, 1 ]],
            [[ 3.0, 0.02, 0, 1 ],[ 3.0, 0.01, 0.0, 1 ],[ 3.0, 0, 0, 1 ]]
        ]

        const orderSideU= 2
        const orderSideV = 2
        const orderBottomU= 2
        const orderBottomV = 2

        const material = new THREE.MeshLambertMaterial( { color: "#ffffff", side: THREE.DoubleSide} );             
        let sideJar = this.builder.build( controlPointsSide, orderSideU, orderSideV, this.samplesU, this.samplesV, material )  
        let bottomJar = this.builder.build( controlPointsBottom, orderBottomU, orderBottomV, this.samplesU, this.samplesV, material )  
        
        let frontMesh = new THREE.Mesh( sideJar, material );
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        frontMesh.scale.set( scale, scale, scale )
        frontMesh.position.set( x, y + 0.02 * scale, z )
        this.app.scene.add( frontMesh )
        this.meshes.push ( frontMesh )

        let backMesh = new THREE.Mesh( sideJar, material );
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        backMesh.scale.set( scale, scale, scale )
        backMesh.position.set( x + scale * 5, y + 0.02 * scale, z )
        backMesh.rotateY( Math.PI )
        this.app.scene.add( backMesh )
        this.meshes.push( backMesh )

        let frontBottomMesh = new THREE.Mesh( bottomJar, material );
        frontBottomMesh.castShadow = true;
        frontBottomMesh.receiveShadow = true;
        frontBottomMesh.scale.set( scale, scale, scale )
        frontBottomMesh.position.set( x, y, z )
        this.app.scene.add( frontBottomMesh )
        this.meshes.push( frontBottomMesh )
        
        let backBottomMesh = new THREE.Mesh( bottomJar, material );
        backBottomMesh.castShadow = true;
        backBottomMesh.receiveShadow = true;
        backBottomMesh.scale.set( scale, scale, scale )
        backBottomMesh.position.set( x + scale * 5, y, z )
        backBottomMesh.rotateY( Math.PI )
        this.app.scene.add( backBottomMesh )
        this.meshes.push( backBottomMesh )
    }

}

export { MyContents };