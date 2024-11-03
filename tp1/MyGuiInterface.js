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

        const ceillingFolder = this.datgui.addFolder('Ceilling Lights')
        ceillingFolder.add(this.contents, 'intensityCeilling', 0, 500).onChange( () => { this.contents.rebuildSpotLightCeilling(0); this.contents.rebuildSpotLightCeilling(1); this.contents.rebuildSpotLightCeilling(2) } );
        ceillingFolder.add(this.contents, 'angleCeilling', 0, 90).onChange( () => { this.contents.rebuildSpotLightCeilling(0); this.contents.rebuildSpotLightCeilling(1); this.contents.rebuildSpotLightCeilling(2) } );
        ceillingFolder.add(this.contents, 'helpersEnable').name("enabled").onChange(() => {this.contents.rebuildHelpersCeilling(!this.contents.helpersLastEnable)});

    }
}

export { MyGuiInterface };