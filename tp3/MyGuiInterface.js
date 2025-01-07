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

        // define folders
        const cameraFolder = this.datgui.addFolder("Camera");
        const sceneFolder = this.datgui.addFolder("Scene");
        const lightHelpersFolder = this.datgui.addFolder("Lights");
        const gameFolder = this.datgui.addFolder("Game");
        const routeFolder = this.datgui.addFolder("Route");

        // cameras configuration
        cameraFolder
            .add(this.app, "activeCameraName", camerasNames)
            .name("active camera");
        cameraFolder.open();

        // scene configuration
        sceneFolder
            .add(this.contents.game.ambientLight, "intensity", 0, 10)
            .name("ambient intensity")
            .onChange((value) => {
                this.contents.game.ambientLight.intensity = value;
            });
        sceneFolder
            .addColor(this.contents.game.ambientLight, "color")
            .name("ambient color")
            .onChange((value) => {
                this.contents.game.ambientLight.color = value;
            });
        sceneFolder
            .addColor(this.app.scene, "background")
            .name("background color")
            .onChange((value) => {
                this.app.scene.background = value;
            });
        sceneFolder
            .add(this.contents, "graphActive", [
                "Default",
                "With Wireframe",
                "Without Wireframe",
            ])
            .name("wireframe")
            .onChange((value) => {
                this.contents.updateGraph(value);
            });
        sceneFolder.open();

        // helpers configuration
        lightHelpersFolder
            .add(this.contents, "lightHelpers")
            .name("enabled helpers")
            .onChange(() => {
                this.contents.updateHelpers(this.contents.lightHelpers);
            });
        lightHelpersFolder.open();

        // track configuration
        const trackFolder = this.datgui.addFolder("Track");
        trackFolder
            .add(this.contents.game.track, "segments", 10, 500)
            .step(50)
            .onChange((value) => this.contents.game.track.updateCurve(value));
        trackFolder
            .add(this.contents.game.track, "width", 5, 20)
            .step(0.1)
            .onChange((value) => this.contents.game.track.updateCurve(value));
        trackFolder
            .add(this.contents.game.track, "closedCurve")
            .name("closed curve")
            .onChange((value) =>
                this.contents.game.track.updateCurveClosing(value)
            );
        trackFolder
            .add(this.contents.game.track, "textureRepeat", 1, 100)
            .name("texture repeat")
            .step(1)
            .onChange((value) => {
                this.contents.game.track.updateTextureRepeat(value);
            });
        trackFolder
            .add(this.contents.game.track, "showLine")
            .name("show line")
            .onChange(() => this.contents.game.track.updateLineVisibility());
        trackFolder
            .add(this.contents.game.track, "showWireframe")
            .name("show wireframe")
            .onChange(() =>
                this.contents.game.track.updateWireframeVisibility()
            );
        trackFolder
            .add(this.contents.game.track, "showMesh")
            .name("show mesh")
            .onChange(() => this.contents.game.track.updateMeshVisibility());

        // game configuration folder
        gameFolder
            .add(this.contents.game, "obstaclePenalty", 1, 10)
            .name("penalty duration")
            .step(1)
            .onChange((value) => (this.contents.game.obstaclePenalty = value));
        gameFolder
            .add(this.contents.game, "wN", 4, 15)
            .name("north wind")
            .step(1)
            .onChange((value) => (this.contents.game.wN = value));
        gameFolder
            .add(this.contents.game, "wS", 4, 15)
            .name("south wind")
            .step(1)
            .onChange((value) => (this.contents.game.wS = value));
        gameFolder
            .add(this.contents.game, "wE", 4, 15)
            .name("east wind")
            .step(1)
            .onChange((value) => (this.contents.game.wE = value));
        gameFolder
            .add(this.contents.game, "wW", 4, 15)
            .name("west wind")
            .step(1)
            .onChange((value) => (this.contents.game.wW = value));

        //route folder
        routeFolder
            .add(this.contents.game, "showRoute")
            .name("show routes")
            .onChange(() => this.contents.game.showRoutes());
    }
}

export { MyGuiInterface };
