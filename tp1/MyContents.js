import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyWalls } from './MyWalls.js';
import { MyCake } from './MyCake.js';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';
import { MyPainting } from './MyPainting.js';
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
        //this.diffusePlaneColor = "#00ffff";
        //this.specularPlaneColor = "#777777";
        //this.planeShininess = 30;
        //this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;
        // material
        this.diffusePlaneColor =  "rgb(128,128,128)"
        this.specularPlaneColor = "rgb(0,0,0)"
        this.planeShininess = 0
        // relating texture and material:
        // two alternatives with different results
        // alternative 1
        this.planeMaterial = new THREE.MeshStandardMaterial({color: this.diffusePlaneColor, specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.planeTexture })
        // end of alternative 1
        // alternative 2
        // this.planeMaterial = new THREE.MeshLambertMaterial({ map : this.planeTexture });
        // end of alternative 2
        let plane = new THREE.PlaneGeometry( 10, 10 );
        
        // spot light related attributes
        this.colorSpotLight = "#ffffff";
        this.intensitySpotLight = 15;
        this.limitDistanceSpotLight = 8
        this.angleSpotLight = 20
        this.penumbraSpotLight = 0
        this.decaySpotLight = 0
        this.xSpotLight = 1
        this.ySpotLight = 5
        this.xTargetSpotLight = 1
        this.yTargetSpotLight = 0

        const loader = new THREE.TextureLoader();
        this.picture1 = loader.load('textures/202105309.jpg');
        this.picture2 = loader.load('textures/202108699.jpg');

        this.walls = null;
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 });

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        //const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        //pointLight.position.set( 0, 20, 0 );
        //this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        //const sphereSize = 0.5;
        //const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        //this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 5);
        this.app.scene.add( ambientLight );

        // add directional light
        const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        light2.position.set(0,10,0);
        light2.target.position.set(0,0,0)
        this.app.scene.add( light2 );

        const light2Helper = new THREE.DirectionalLightHelper( light2, 5 ); 
        this.app.scene.add( light2Helper );

        // add spot light
        this.spotLight = new THREE.SpotLight( this.colorSpotLight, this.intensitySpotLight, this.limitDistanceSpotLight, this.angleSpotLight * Math.PI / 180, this.penumbra, this.decay );
        this.spotLight.position.set(this.xSpotLight,this.ySpotLight,1);
        this.spotLight.target.position.set(this.xTargetSpotLight,this.yTargetSpotLight,1)
        this.app.scene.add(this.spotLight);
        
        const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.app.scene.add( spotLightHelper );

        this.buildBox()
        
        // add table to the scene
        const height = 3;
        const radius = 0.2;
        const xLenght = 6;
        const zLenght = 4;
        this.table = new MyTable(this, height, radius, xLenght, zLenght);
        this.app.scene.add(this.table);

        // create and attach walls to the scene
        this.walls = new MyWalls(this.app, 20, 15, 10, 0.5)
        this.app.scene.add( this.walls );

        let tierHeight = 0.2;
        let baseRadius = 0.5;
        let topRadius = 0.3;

        let topTablePosition = height + tierHeight/2 + radius/2;

        // create and attach the cake to the scene
        let cake = new MyCake(this.app, baseRadius, tierHeight, 10*Math.PI/6, false, 3, topRadius);
        cake.position.y= topTablePosition + baseRadius * 0.4 + 0.005;
        this.app.scene.add(cake);

        // create and attach the cake slice to the scene
        let cakeSlice = new MyCake(this.app, topRadius, tierHeight, 2*Math.PI/6, true);
        cakeSlice.position.set(0.5, topTablePosition + 0.03, 0.5);
        this.app.scene.add(cakeSlice);

        let chair = new MyChair(5,4,5,2,0.2,3,0.2,2,0.4)
        chair.rotateY(-Math.PI / 6)
        chair.scale.set(0.5,0.5,0.5)
        chair.position.set(-1,0,3)
        this.app.scene.add(chair);

        const photos = new THREE.Group();
        const photo1 = new MyPainting(this.app, 2.1, 2.7, 0.2, this.picture1);
        photo1.position.x = - 2.0;
        photos.add(photo1);
        const photo2 = new MyPainting(this.app, 2.1, 2.7, 0.2, this.picture2);
        photo2.position.x = 2.0;
        photos.add(photo2);
        photos.rotateY(Math.PI/2);
        photos.position.set(-10, 5, 0);

        this.app.scene.add(photos);


        
        // Create a Plane Mesh with basic material
        //let plane = new THREE.PlaneGeometry( 20, 15 );
        //this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        //this.planeMesh.rotation.x = -Math.PI / 2;
        //this.planeMesh.position.y = -0;
        //this.app.scene.add( this.planeMesh );
        // Create a Plane Mesh with basic material
        let planeSizeU = 20;
        let planeSizeV = 15;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 3354 / 2385; // image dimensions
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.planeTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV );
        //this.planeTexture.rotation = 30 * Math.PI / 180;
        this.planeTexture.offset = new THREE.Vector2(0,0);
        var plane = new THREE.PlaneGeometry( planeSizeU, planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.app.scene.add( this.planeMesh );
    }

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

}

export { MyContents };