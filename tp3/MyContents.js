import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyParser } from "./parser/MyParser.js";
import { MyGuiInterface } from "./MyGuiInterface.js";
import { MyBillboard } from "./object/MyBillboard.js";
import { MyPark } from "./object/MyPark.js";

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
        this.parkPlayer = new MyPark(this.app, "player");
        this.parkOponent = new MyPark(this.app, "oponent");
        this.ballonPlayerPicker = null;
        this.ballonOponnentPicker = null;
        this.ballonPlayer = null;
        this.ballonOponnent = null;
        this.sidePlayer = null;
        this.billboard = new MyBillboard(app);

        // wind
        this.windE = 1;
        this.windN = 1;
        this.windW = 1;
        this.windS = 1;

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

        document.addEventListener("pointerdown", this.onPointerMove.bind(this));
        document.addEventListener("keydown", (event) => {
            if (this.state === "game") {
                if (event.key == "ArrowDown") {
                    this.ballonPlayer.moveDown();
                } else if (event.key === "ArrowUp") {
                    this.ballonPlayer.moveUp();
                }
            }
        });
        this.state = "initial";
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
        this.app.scene.add(this.graphDefault);
        this.app.scene.add(this.billboard);

        this.parkPlayer.position.set(-20, 0, 50);
        this.parkOponent.position.set(-20, 0, -50);

        this.app.scene.add(this.parkPlayer);
        this.app.scene.add(this.parkOponent);
    }

    buildSceneGame() {
        const postTrackX = -this.track.points[0].x * this.track.widthS;
        const postTrackZ = this.track.points[0].z * this.track.widthS;

        const dictPlayer = {
            player_1: 0,
            player_2: 1,
            player_3: 2,
            player_4: 3,
        };
        const dictOponent = {
            oponent_1: 0,
            oponent_2: 1,
            oponent_3: 2,
            oponent_4: 3,
        };

        this.ballonPlayer =
            this.parkPlayer.ballons[
                dictPlayer[this.ballonPlayerPicker.name]
            ].clone();

        this.ballonOponnent =
            this.parkOponent.ballons[
                dictOponent[this.ballonOponnentPicker.name]
            ].clone();

        if ((this.sidePlayer.name = "side_1")) {
            this.ballonPlayer.position.set(postTrackX - 5, 10, postTrackZ);
            this.ballonOponnent.position.set(postTrackX + 5, 10, postTrackZ);
        } else {
            this.ballonPlayer.position.set(postTrackX + 5, 10, postTrackZ);
            this.ballonOponnent.position.set(postTrackX - 5, 10, postTrackZ);
        }

        this.app.scene.add(this.ballonPlayer);
        this.app.scene.add(this.ballonOponnent);
    }

    async runSceneGame() {
        while (true) {
            this.ballonPlayer.moveWind(
                this.windN,
                this.windS,
                this.windE,
                this.windW
            );
            await this.sleep(1000);
        }
    }

    buildGuiInterface() {
        // Configure GUI and scene contents
        let gui = new MyGuiInterface(this.app);
        gui.setContents(this);
        gui.init();
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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
    changeColorOfFirstPickedObj(obj, name) {
        if (name == "player") {
            if (this.ballonPlayerPicker != obj) {
                if (this.ballonPlayerPicker)
                    this.ballonPlayerPicker.material.color.setHex(
                        this.ballonPlayerPicker.currentHex
                    );
                this.ballonPlayerPicker = obj;
                this.ballonPlayerPicker.currentHex =
                    this.ballonPlayerPicker.material.color.getHex();
                this.ballonPlayerPicker.material.color.setHex(
                    this.pickingColor
                );
            }
        }
        if (name == "oponent") {
            if (this.ballonOponnentPicker != obj) {
                if (this.ballonOponnentPicker)
                    this.ballonOponnentPicker.material.color.setHex(
                        this.ballonOponnentPicker.currentHex
                    );
                this.ballonOponnentPicker = obj;
                this.ballonOponnentPicker.currentHex =
                    this.ballonOponnentPicker.material.color.getHex();
                this.ballonOponnentPicker.material.color.setHex(
                    this.pickingColor
                );
            }
        }
        if (name == "side") {
            if (this.sidePlayer != obj) {
                if (this.sidePlayer) {
                    this.sidePlayer.material.color.setHex(
                        this.sidePlayer.currentHex
                    );
                }
                this.sidePlayer = obj;
                this.sidePlayer.currentHex =
                    this.sidePlayer.material.color.getHex();
                this.sidePlayer.material.color.setHex(this.pickingColor);
            }
        }
    }

    pickingHelper(intersects) {
        const possible_player = [
            "player_1",
            "player_2",
            "player_3",
            "player_4",
        ];

        const possible_oponent = [
            "oponent_1",
            "oponent_2",
            "oponent_3",
            "oponent_4",
        ];

        const possible_side = ["side_1", "side_2"];

        if (intersects.length > 0) {
            // initial state
            if (this.state === "initial") {
                const obj = intersects[0].object;

                // picking player ballon
                if (possible_player.includes(obj.name)) {
                    this.changeColorOfFirstPickedObj(obj, "player");
                }

                // picking oponent ballon
                if (possible_oponent.includes(obj.name)) {
                    this.changeColorOfFirstPickedObj(obj, "oponent");
                }

                // picking side track
                if (possible_side.includes(obj.name)) {
                    this.changeColorOfFirstPickedObj(obj, "side");
                }

                // starting game
                if (obj.name == "startButton") {
                    if (
                        this.ballonPlayerPicker !== null &&
                        this.ballonOponnentPicker !== null &&
                        this.billboard.display.name !== "" &&
                        this.sidePlayer !== null
                    ) {
                        this.state = "game";
                        this.billboard.updateDisplay();
                        this.buildSceneGame();
                        this.runSceneGame();
                    }
                }
            }
        }
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
        var intersects = this.raycaster.intersectObjects(
            this.app.scene.children
        );
        this.pickingHelper(intersects);
    }
}

export { MyContents };
