import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyParser } from './parser/MyParser.js';
import { MyGuiInterface } from './MyGuiInterface.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.parser = null
        this.axis = null
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");
        
        this.dataLights = []
        this.dataLightsHelpers = []
        this.lightHelpers = false
        this.ambientLight = null

        this.graphDic = {}
        this.graphActive = "Default"
        this.graphDefault = null
        this.grahNoWireframe = null
        this.grahYesWireframe = null
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
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.parser = new MyParser(this, this.app, data)
    }

    cloneGroupWithWireframe(group, isWireframe) {
        const clonedGroup = group.clone();    
        clonedGroup.traverse((object) => {
            if (object.isMesh && object.material) {
                object.geometry = object.geometry.clone();
                // if it is an array of materials
                if (Array.isArray(object.material)) {
                    object.material = object.material.map(mat => {
                        if (mat.clone) return mat.clone()
                        return mat;
                    });
                    object.material.forEach(material => { material.wireframe = isWireframe; });
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
    

    
    updateHelpers(value) {
        this.lightHelpers = value

        for(let key in this.dataLightsHelpers) {
            const helper = this.dataLightsHelpers[key].helper
            if (value) {
                this.app.scene.add(helper)
            }
            else {
                this.app.scene.remove(helper)
            }
        }
    }

    updateGraph(value) {
        for(let key in this.app.scene.children) {
            if  (this.app.scene.children[key].name === 'root_graph') {
                this.app.scene.remove(this.app.scene.children[key])
            }
        }
        this.app.scene.add(this.graphDic[value])
        this.graphActive = value
    }

    update() {
    }

}

export { MyContents };
