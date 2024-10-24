import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
            'color': this.contents.colorSpotLight,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        const spotLightFolder = this.datgui.addFolder('Spot Light')
        spotLightFolder.addColor( data, 'color' ).onChange( (value) => { this.contents.updateSpotLight('color', value) } );
        spotLightFolder.add(this.contents, 'intensitySpotLight', 0, 50).name("intensity").onChange( (value) => { this.contents.updateSpotLight('intensity', value) } );
        spotLightFolder.add(this.contents, 'limitDistanceSpotLight', 0, 50).name("limit distance").onChange( (value) => { this.contents.updateSpotLight('distance', value) } );
        spotLightFolder.add(this.contents, 'angleSpotLight', 0, 90).name("angle (in degrees)").onChange( (value) => { this.contents.updateSpotLight('angle', value) } );
        spotLightFolder.add(this.contents, 'penumbraSpotLight', 0, 1).name("penumbra").onChange( (value) => { this.contents.updateSpotLight('penumbra', value) } );
        spotLightFolder.add(this.contents, 'decaySpotLight', 0, 5).name("decay").onChange( (value) => { this.contents.updateSpotLight('decay', value) } );
        spotLightFolder.add(this.contents, 'xSpotLight', 0, 50).name("position in Ox").onChange( (value) => { this.contents.updateSpotLight('x', value) } );
        spotLightFolder.add(this.contents, 'ySpotLight', 0, 50).name("position in Oy").onChange( (value) => { this.contents.updateSpotLight('y', value) } );
        spotLightFolder.add(this.contents, 'xTargetSpotLight', 0, 50).name("target in Ox").onChange( (value) => { this.contents.updateSpotLight('xTarget', value) } );
        spotLightFolder.add(this.contents, 'yTargetSpotLight', 0, 50).name("target in Oy").onChange( (value) => { this.contents.updateSpotLight('yTarget', value) } );
        spotLightFolder.open()

    }
}

export { MyGuiInterface };