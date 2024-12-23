import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyParser } from "./parser/MyParser.js";
import { MyGuiInterface } from "./MyGuiInterface.js";
import { MyFont } from "./parser/MyFont.js";
import { MyMenuStart } from "./object/MyMenuStart.js";
import { MyBillboard } from "./object/MyBillboard.js";

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
        this.track = null;
        this.ballonPlayer = null;
        this.ballonOponnent = null;

        // reader
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");

        // lights
        this.dataLights = [];
        this.dataLightsHelpers = [];
        this.lightHelpers = false;
        this.ambientLight = null;

        // graph
        this.graphDic = {};
        this.graphActive = "Default";
        this.graphDefault = null;
        this.grahNoWireframe = null;
        this.grahYesWireframe = null;

        // picker
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 200;
        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0x00ff00";

        this.availableLayers = ["none", "player", "oponent"];
        this.selectedLayer = this.availableLayers[1];
        document.addEventListener(
            // "pointermove",
            // "mousemove",
            "pointerdown",
            // list of events: https://developer.mozilla.org/en-US/docs/Web/API/Element
            this.onPointerMove.bind(this)
        );

        // menu
        this.billboard = new MyBillboard(app);
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
        this.parser = new MyParser(this, this.app, data);
        this.parser
            .initialize()
            .then(() => {
                this.app.setActiveCamera(this.parser.data.yasf.cameras.initial);
                this.app.cameras = this.parser.dataCameras;

                this.buildObjects();
                this.buildScene();
                this.buildGuiInterface();
            })
            .catch((error) => {});
    }

    buildObjects() {
        // build graphs
        const graph = this.parser.graph;
        this.graphDefault = this.parser.graph;
        this.grahYesWireframe = this.groupWireframe(graph, true);
        this.grahNoWireframe = this.groupWireframe(graph, false);

        // build dict
        this.graphDic = {
            Default: this.graphDefault,
            "With Wireframe": this.grahYesWireframe,
            "Without Wireframe": this.grahNoWireframe,
        };

        // build track
        this.track = this.parser.track;

        // build lights
        this.dataLights = this.parser.dataLights;
        this.dataLightsHelpers = this.parser.dataLightsHelpers;
        this.ambientLight = this.parser.ambientLight;
    }

    buildScene() {
        this.app.scene.add(this.track.object);
        //this.app.scene.add(new MyPark(this.app, "player"));
        this.app.scene.add(this.graphDefault);
        this.app.scene.add(this.billboard);
    }

    buildGuiInterface() {
        // Configure GUI and scene contents
        let gui = new MyGuiInterface(this.app);
        gui.setContents(this);
        gui.init();
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

    update() {}

    /*
     * Change the color of the first intersected object
     *
     */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(
                    this.lastPickedObj.currentHex
                );
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex =
                this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(
                this.lastPickedObj.currentHex
            );
        this.lastPickedObj = null;
    }

    pickingHelper(intersects) {
        const possible = [
            this.selectedLayer + "_1",
            this.selectedLayer + "_2",
            this.selectedLayer + "_3",
            this.selectedLayer + "_4",
        ];

        // objects were intersected
        if (intersects.length > 0) {
            const obj = intersects[0].object;

            // object selected is not a choice
            if (!possible.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj();
                console.log("Object cannot be picked !");
            }

            // object selected is a choice
            else {
                console.log("Object was picked !");
                this.changeColorOfFirstPickedObj(obj);
            }
        }

        // no objects were intersected
        else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(
            this.app.scene.children
        );
        this.pickingHelper(intersects);
        this.transverseRaycastProperties(intersects);
    }

    /**
     * Print to console information about the intersected objects
     * @param {*} intersects
     */
    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {
            console.log(intersects[i]);
            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }
}

export { MyContents };
