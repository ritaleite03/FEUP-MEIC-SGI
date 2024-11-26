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
        const camerasNames = []
        for(let key in this.app.cameras) {
            camerasNames.push(key)
        }

        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', camerasNames).name("active camera");
        cameraFolder.open()

        for(let name in camerasNames) {
            console.log(camerasNames[name])
        }
        
        const ambientBackgroundFolder = this.datgui.addFolder( 'Ambient and Background' )
        ambientBackgroundFolder.add(this.contents.ambientLight, 'intensity', 0, 10).name("Ambient\'s Intensity").onChange((value) => {this.contents.ambientLight.intensity = value});
        ambientBackgroundFolder.addColor( this.contents.ambientLight, 'color' ).name('Ambient\'s Color').onChange( (value) => { this.contents.ambientLight.color = value} );
        ambientBackgroundFolder.addColor( this.app.scene, 'background' ).name('Background\'s Color').onChange( (value) => { this.app.scene.background = value } );
        
        const objectFolder = this.datgui.addFolder('Camera')
        objectFolder.add(this.contents, 'graphActive', ['Default', 'With Wireframe', 'Without Wireframe']).name("Wireframe").onChange((value) => {this.contents.updateGraph(value)});;
        objectFolder.open()

        const lightHelpersFolder = this.datgui.addFolder('Lights')
        lightHelpersFolder.add(this.contents, 'lightHelpers').name("Enabled Helpers").onChange(() => {this.contents.updateHelpers(this.contents.lightHelpers)});
        lightHelpersFolder.open()       
    }
}

export { MyGuiInterface };