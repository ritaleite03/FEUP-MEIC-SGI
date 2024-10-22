import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyWalls } from './MyWalls.js';
import { MyCake } from './MyCake.js';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyFlower } from './MyFlower.js';
import { MyNewspaper } from './MyNewsPaper.js';
import { MySpiralSpring } from './MySpiralSpring.js';

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

        // box related attributes
        this.boxMesh = null;
        this.boxMeshSize = 1.0;
        this.boxEnabled = true;
        this.lastBoxEnabled = null;
        this.boxDisplacement = new THREE.Vector3(0,2,0);

        // plane related attributes

        // this.diffusePlaneColor = "#00ffff";
        // this.specularPlaneColor = "#777777";
        // this.planeShininess = 30;
        // this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
        
        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;
        
        // material
        this.diffusePlaneColor =  "rgb(128,128,128)"
        this.specularPlaneColor = "rgb(0,0,0)"
        this.planeShininess = 0

        // this.planeMaterial = new THREE.MeshLambertMaterial({ map : this.planeTexture }); // alternative 2
        this.planeMaterial = new THREE.MeshStandardMaterial({color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.planeTexture }) // alternative 1
        let plane = new THREE.PlaneGeometry( 10, 10 );
        
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

        const map = new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 } );
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8 // maximum defined in MyGuiInterface
        this.samplesV = 8 // maximum defined in MyGuiInterface
        this.init()
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", specular: "#000000", emissive: "#000000", shininess: 90 });
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis( this )
            this.app.scene.add( this.axis )
        }

        // variables to hold the curves
        this.polyline = null
        this.quadraticBezierCurve = null
        this.cubicBezierCurve = null
        this.catmullRomCurve = null
        this.numberOfSamples = 8
        this.hullMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, opacity: 0.50, transparent: true});    
        this.recompute();

        // create light

        // add a point light on top of the model
        // const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        // pointLight.position.set( 0, 20, 0 );
        // this.app.scene.add( pointLight );
        // const sphereSize = 0.5;
        // const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        // this.app.scene.add( pointLightHelper );

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
        this.app.scene.add( this.spotLight );
        this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        this.app.scene.add( this.spotLightHelper );

        this.buildBox()

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
        const numberPetals = 12
        const widthPetal = 0.005
        const heightPetal = 0.04

        const radiusSpiral = 0.4
        const segmentsSpiral = 20
        const heightSpiral = 2
        const heightLevelSpiral = 4

        // create and attach the table to the scene
        const table = new MyTable( this, heightTable, radiusTable, xLenghtTable, zLenghtTable );
        this.app.scene.add( table );

        // create and attach walls to the scene
        const walls = new MyWalls( this, 20, 15, 10, 0.5 )
        this.app.scene.add( walls );
        
        // create and attach the cake to the scene
        const cake = new MyCake( this, baseRadiusCake, tierHeightCake, 10 * Math.PI / 6, false, 3, topRadiusCake );
        cake.position.y = topPositionTable + baseRadiusCake * 0.4 + 0.005;
        this.app.scene.add( cake );
        
        // create and attach the cake slice to the scene
        const cakeSlice = new MyCake( this, topRadiusCake, tierHeightCake, 2 * Math.PI / 6, true );
        cakeSlice.position.set( 0.5, topPositionTable + 0.03, 0.5 );
        this.app.scene.add( cakeSlice );

        // create and attach the chair to the scene
        const chair = new MyChair( widthBottomChair, heightBottomChair, widthTopChair, heightTopChair, radiusLegsChair, heightLegsChair, radiusBackChair, heightBackChair, thicknessChair )
        chair.rotateY( -Math.PI / 6 )
        chair.scale.set( 0.5, 0.5, 0.5 )
        chair.position.set( -1, 0, 3)
        this.app.scene.add( chair );

        // create and attach the flowers to the scene
        const flower1 = new MyFlower( this , scaleJar * 1.0,  numberPetals - 0, widthPetal * 1.0, heightPetal * 1.0 );
        const flower2 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 1, widthPetal * 0.9, heightPetal * 0.9 );
        const flower3 = new MyFlower( this , scaleJar * 0.9,  numberPetals - 2, widthPetal * 0.9, heightPetal * 0.9 );
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

        // create and attach the jar to the scene
        this.createsideJar( xLenghtTable / 4, heightTable + radiusTable / 2, -zLenghtTable / 4, scaleJar )       
        
        // create and attach newspaper to the scene
        const newspaper = new MyNewspaper(this, xLenghtTable / 4, heightTable + radiusTable / 2, zLenghtTable / 4, 1, 5)
        newspaper.rotateY(Math.PI)
        this.app.scene.add(newspaper)

        // create and attach the spiral spring to the scene
        const spiralSpring = new MySpiralSpring(this, radiusSpiral, segmentsSpiral, heightSpiral, heightLevelSpiral)
        this.app.scene.add(spiralSpring)
        
        //let plane = new THREE.PlaneGeometry( 20, 15 );
        //this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        //this.planeMesh.rotation.x = -Math.PI / 2;
        //this.planeMesh.position.y = -0;
        //this.app.scene.add( this.planeMesh );

        let planeSizeU = 20;
        let planeSizeV = 15;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 3354 / 2385; // image dimensions
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.planeTexture.repeat.set( planeTextureRepeatU, planeTextureRepeatV );
        //this.planeTexture.rotation = 30 * Math.PI / 180;
        this.planeTexture.offset = new THREE.Vector2(0,0);
        var plane = new THREE.PlaneGeometry( planeSizeU, planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.app.scene.add( this.planeMesh );
    }

    // Deletes the contents of the line if it exists and recreates them
    recompute() {
        // if (this.polyline !== null) this.app.scene.remove(this.polyline)
        // this.initPolyline([new THREE.Vector3(-0.6,-0.6,0), new THREE.Vector3(0.6,-0.6,0), new THREE.Vector3(0.6,0.6,0), new THREE.Vector3(-0.6,0.6,0)], new THREE.Vector3(0,0,0))
        // if (this.quadraticBezierCurve !== null) this.app.scene.remove(this.quadraticBezierCurve)
        // this.initQuadraticBezierCurve([ new THREE.Vector3(-0.6,-0.6,0), new THREE.Vector3(0,0.6,0), new THREE.Vector3(0.6,-0.6,0)], new THREE.Vector3(0,0,0))
        // if (this.cubicBezierCurve !== null) this.app.scene.remove(this.cubicBezierCurve)
        // this.initCubicBezierCurve([new THREE.Vector3(-0.6,-0.6,0), new THREE.Vector3(-0.6,0.6,0), new THREE.Vector3(0.6,-0.6,0), new THREE.Vector3(0.6,0.6,0)], new THREE.Vector3(0,0,0))
        // if (this.catmullRomCurve !== null) this.app.scene.remove(this.catmullRomCurve)
        // this.initCatmullRomCurve([new THREE.Vector3(-0.6,-0,0), new THREE.Vector3(-0.3,0.6,0.3), new THREE.Vector3(0,0,0), new THREE.Vector3(0.3,-0.6,0.3), new THREE.Vector3(0.6,0,0), new THREE.Vector3(0.9,0.6,0.3), new THREE.Vector3(1.2,0,0)], new THREE.Vector3(0,0,0))
    }

    
    drawHull(position, points) {     
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line( geometry, this.hullMaterial );
        line.position.set(position.x,position.y,position.z)
        this.app.scene.add(line);
    }
    
    initPolyline(points, position) {
        this.drawHull(position, points);
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        this.polyline = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
        this.polyline.position.set(position.x,position.y,position.z)
        this.app.scene.add(this.polyline);
    }

    initQuadraticBezierCurve(points, position) {
        this.drawHull(position, points);
        let curve = new THREE.QuadraticBezierCurve3( points[0], points[1], points[2])
        let sampledPoints = curve.getPoints(this.numberOfSamples);  
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints)
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add(this.lineObj);
    }

    initCubicBezierCurve(points, position) {
        this.drawHull(position, points);
        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
        let sampledPoints = curve.getPoints(this.numberOfSamples);  
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints)
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00} )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
    }

    
    initCatmullRomCurve(points, position) {
        this.drawHull(position, points);
        let curve = new THREE.CatmullRomCurve3(points)
        let sampledPoints = curve.getPoints(this.numberOfSamples);  
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints)
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
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
        if (propriety === 'color') this.spotLight[propriety].set(value)
        else if (propriety === 'x') this.spotLight.position.x = value;
        else if (propriety === 'y') this.spotLight.position.y = value;
        else if (propriety === 'xTarget') this.spotLight.target.position.x = value;
        else if (propriety === 'yTarget') this.spotLight.target.position.y = value;
        else if (propriety === 'angle') this.spotLight[propriety] = value * Math.PI / 180   
        else this.spotLight[propriety] = value
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
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()
        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
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
        frontMesh.scale.set( scale, scale, scale )
        frontMesh.position.set( x, y + 0.02 * scale, z )
        this.app.scene.add( frontMesh )
        this.meshes.push ( frontMesh )

        let backMesh = new THREE.Mesh( sideJar, material );
        backMesh.scale.set( scale, scale, scale )
        backMesh.position.set( x + scale * 5, y + 0.02 * scale, z )
        backMesh.rotateY( Math.PI )
        this.app.scene.add( backMesh )
        this.meshes.push( backMesh )

        let frontBottomMesh = new THREE.Mesh( bottomJar, material );
        frontBottomMesh.scale.set( scale, scale, scale )
        frontBottomMesh.position.set( x, y, z )
        this.app.scene.add( frontBottomMesh )
        this.meshes.push( frontBottomMesh )
        
        let backBottomMesh = new THREE.Mesh( bottomJar, material );
        backBottomMesh.scale.set( scale, scale, scale )
        backBottomMesh.position.set( x + scale * 5, y, z )
        backBottomMesh.rotateY( Math.PI )
        this.app.scene.add( backBottomMesh )
        this.meshes.push( backBottomMesh )
    }

}

export { MyContents };