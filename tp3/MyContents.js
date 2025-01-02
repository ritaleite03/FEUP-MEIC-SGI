import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyParser } from "./parser/MyParser.js";
import { MyGuiInterface } from "./MyGuiInterface.js";
import { MyGame } from "./MyGame.js";
import { PerspectiveCamera } from "three";
import * as THREE from "three";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        // objects
        this.app = app;
        this.parser = null;
        this.axis = null;
        this.game = null;

        // reader
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");

        // lights
        this.dataLights = [];
        this.dataLightsHelpers = [];
        this.lightHelpers = false;
        this.ambientLight = null;
        this.ambientLightNow = null;

        // graph
        this.graphDic = {};
        this.graphActive = "Default";
        this.graphDefault = null;
        this.grahNoWireframe = null;
        this.grahYesWireframe = null;
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.");
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     *
     * @param {*} data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        this.parser = new MyParser(this.app, data);
        this.parser
            .initialize()
            .then(() => {
                // build cameras
                this.app.setActiveCamera(this.parser.data.yasf.cameras.initial);
                this.app.cameras = this.parser.dataCameras;

                const fov = 75;
                const aspect = window.innerWidth / window.innerHeight;
                const near = 0.1;
                const far = 1000;

                this.app.cameras["FirstPerson"] = new THREE.PerspectiveCamera(
                    fov,
                    aspect,
                    near,
                    far
                );

                this.app.cameras["ThirdPerson"] = new THREE.PerspectiveCamera(
                    fov,
                    aspect,
                    near,
                    far
                );

                console;
                // build graphs
                const graph = this.parser.graph;
                this.graphDefault = this.parser.graph;
                this.grahYesWireframe = this.groupWireframe(graph, true);
                this.grahNoWireframe = this.groupWireframe(graph, false);
                this.app.scene.add(this.graphDefault);

                // build dict
                this.graphDic = {
                    Default: this.graphDefault,
                    "With Wireframe": this.grahYesWireframe,
                    "Without Wireframe": this.grahNoWireframe,
                };

                this.game = new MyGame(
                    this.app,
                    this.parser.track,
                    this.parser.powerUps,
                    this.parser.powerDowns,
                    this.parser.parkPlayer,
                    this.parser.parkOponent
                );
                this.game.startGame();

                // build lights
                this.dataLights = this.parser.dataLights;
                this.dataLightsHelpers = this.parser.dataLightsHelpers;

                // build gui interface
                let gui = new MyGuiInterface(this.app);
                gui.setContents(this);
                gui.init();
            })
            .catch((error) => {});
    }

    /**
     *
     * @param {*} group
     * @param {*} isWireframe
     * @returns
     */
    groupWireframe(group, isWireframe) {
        const clonedGroup = group.clone();
        clonedGroup.traverse((object) => {
            if (object.isMesh && object.material) {
                object.geometry = object.geometry.clone();

                // if it is an array of materials
                if (Array.isArray(object.material)) {
                    object.material = object.material.map((mat) => {
                        if (mat.clone) return mat.clone();
                        return mat;
                    });
                    object.material.forEach((material) => {
                        material.wireframe = isWireframe;
                    });
                }

                // if its just one
                else {
                    if (object.material.clone) {
                        object.material = object.material.clone();
                        object.material.wireframe = isWireframe;
                    }
                }
            }
        });
        return clonedGroup;
    }

    /**
     *
     * @param {*} value
     */
    updateHelpers(value) {
        this.lightHelpers = value;

        for (let key in this.dataLightsHelpers) {
            const helper = this.dataLightsHelpers[key].helper;
            if (value) {
                this.app.scene.add(helper);
            } else {
                this.app.scene.remove(helper);
            }
        }
    }

    /**
     *
     * @param {*} value
     */
    updateGraph(value) {
        for (let key in this.app.scene.children) {
            if (this.app.scene.children[key].name === "root_graph") {
                this.app.scene.remove(this.app.scene.children[key]);
            }
        }
        this.app.scene.add(this.graphDic[value]);
        this.graphActive = value;
    }

    update() {
        this.game.update();
    }
}

export { MyContents };
