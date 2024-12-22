import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const camerasNames = [];
        for (let key in this.app.cameras) {
            camerasNames.push(key);
        }

        const cameraFolder = this.datgui.addFolder("Camera");
        cameraFolder
            .add(this.app, "activeCameraName", camerasNames)
            .name("active camera");
        cameraFolder.open();

        const ambientBackgroundFolder = this.datgui.addFolder(
            "Ambient and Background"
        );
        ambientBackgroundFolder
            .add(this.contents.ambientLight, "intensity", 0, 10)
            .name("Ambient's Intensity")
            .onChange((value) => {
                this.contents.ambientLight.intensity = value;
            });
        ambientBackgroundFolder
            .addColor(this.contents.ambientLight, "color")
            .name("Ambient's Color")
            .onChange((value) => {
                this.contents.ambientLight.color = value;
            });
        ambientBackgroundFolder
            .addColor(this.app.scene, "background")
            .name("Background's Color")
            .onChange((value) => {
                this.app.scene.background = value;
            });

        const objectFolder = this.datgui.addFolder("Wireframe");
        objectFolder
            .add(this.contents, "graphActive", [
                "Default",
                "With Wireframe",
                "Without Wireframe",
            ])
            .name("Wireframe")
            .onChange((value) => {
                this.contents.updateGraph(value);
            });
        objectFolder.open();

        const lightHelpersFolder = this.datgui.addFolder("Lights");
        lightHelpersFolder
            .add(this.contents, "lightHelpers")
            .name("Enabled Helpers")
            .onChange(() => {
                this.contents.updateHelpers(this.contents.lightHelpers);
            });
        lightHelpersFolder.open();

        const trackFolder = this.datgui.addFolder("Track");
        trackFolder
            .add(this.contents.track, "segments", 10, 500)
            .step(50)
            .onChange((value) => this.contents.track.updateCurve(value));
        trackFolder
            .add(this.contents.track, "closedCurve")
            .onChange((value) => this.contents.track.updateCurveClosing(value));
        trackFolder
            .add(this.contents.track, "textureRepeat", 1, 100)
            .step(1)
            .onChange((value) => {
                this.contents.track.updateTextureRepeat(value);
            });
        trackFolder
            .add(this.contents.track, "showLine")
            .name("Show line")
            .onChange(() => this.contents.track.updateLineVisibility());
        trackFolder
            .add(this.contents.track, "showWireframe")
            .name("Show wireframe")
            .onChange(() => this.contents.track.updateWireframeVisibility());
        trackFolder
            .add(this.contents.track, "showMesh")
            .name("Show mesh")
            .onChange(() => this.contents.track.updateMeshVisibility());
    }
}

export { MyGuiInterface };
