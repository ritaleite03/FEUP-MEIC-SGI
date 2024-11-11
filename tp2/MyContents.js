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
        this.reader.open("scenes/demo1.json");
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
        this.parser = new MyParser(data)
        // update scene with cameras
        this.app.cameras = this.parser.dataCameras
        this.app.setActiveCamera(this.parser.initC)
        // update scene with globals
        this.app.scene.background = this.parser.dataGlobals.background
        this.app.scene.ambient = this.parser.dataGlobals.ambient
        // update scene with fog
        this.app.scene.fog = new THREE.Fog( this.parser.dataFog.color, this.parser.dataFog.near, this.parser.dataFog.far)

        // create the gui interface object
        let gui = new MyGuiInterface(this.app)
        // set the contents object in the gui interface object
        gui.setContents(this)

        // we call the gui interface init 
        // after contents were created because
        // interface elements may control contents items
        gui.init();
        this.app.scene.add(this.parse(data, this.parser.rootO))

    }

    parsePrimpPointlight(prim) {
		// create color component
		let color = '#ffffff'
		if(prim['color'] !== undefined) {
			const r = prim['color']['r']
			const g = prim['color']['g']
			const b = prim['color']['b']
			if(r !== undefined && g !== undefined && b !== undefined) color = new THREE.Color(r,g,b)
		}
		// create light
		const intensity = prim.hasOwnProperty('intensity') ? prim['intensity'] : 1
		const distance = prim.hasOwnProperty('distance') ? prim['distance'] : 0
		const decay = prim.hasOwnProperty('decay') ? prim['decay'] : 0
		const pointlight = new THREE.PointLight(color, intensity, distance, decay)
		// set position
		let position = [0,0,0]
		if(prim['position'] !== undefined) {
			const x = prim['position']['x']
			const y = prim['position']['y']
			const z = prim['position']['z']
			if(x !== undefined && y !== undefined && z !== undefined) position =[x,y,z]
		}
		pointlight.position.set(position[0],position[1],position[2])
		// set shadow
		if(prim['castshadow'] !== undefined) position.castshadow = prim['castshadow']
		return pointlight
	}

    parsePrimRectangle(prim) {
		if(prim['xy1'] !== undefined && prim['xy2'] !== undefined) {
			const xy1X = prim['xy1']['x']
			const xy1Y = prim['xy1']['y']
			const xy2X = prim['xy2']['x']
			const xy2Y = prim['xy2']['y']
			// check if they are defined
			if (![xy1X,xy1Y,xy2X,xy2Y].every((value) => value !== undefined)) {
				console.error('Error in MyParser.parsePrimRectangle : components are undefined');
				return
			}
			// check if they are of type number
			if(![xy1X,xy1Y,xy2X,xy2Y].every(value => typeof value === 'number')) {
				console.error('Error in MyParser.parsePrimRectangle : components are not numbers');
				return
			}
			const width = Math.abs(xy2X - xy1X);
			const height = Math.abs(xy2Y - xy1Y);
			const parts_x = prim['parts_x'] !== undefined ? prim['parts_x'] : 1
			const parts_y = prim['parts_y'] !== undefined ? prim['parts_y'] : 1

			return new THREE.PlaneGeometry(width,height,parts_x,parts_y)
		}
		else {
			console.error('Error in MyParser.parsePrimRectangle : components not defined');
		}
	}

    parse(data, name) {

        const parent = data['yasf']['graph'][name]
        const children = data['yasf']['graph'][name]['children']
        const group = new THREE.Group();

        if(children !== undefined && children !== null) {

            for(let child in children) {
                const node = parent['children'][child]
                if (node['type'] === 'noderef') {
                    group.add(this.parse(data, child))
                }
                else {
                    let object = null
                    if (node['type'] === 'pointlight') {
                        object = this.parsePrimpPointlight(node)
                        group.add(object)
                        continue
                    }
                    if (node['type'] === 'rectangle') {
                        object = this.parsePrimRectangle(node)
                    }             
                    if(object !== null) {
                        const material = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", transparent: true, opacity: 0.5, side: THREE.DoubleSide})
                        const mesh = new THREE.Mesh(object, material)
                        group.add(mesh)
                    }
                }

            }
        }

        if (parent['transforms'] !== undefined) {

            for(let index in parent['transforms']) {
                const transformation = parent['transforms'][index]

                if (transformation['type'] === 'translate') {
                    const x = transformation['amount']['x']
                    const y = transformation['amount']['y']
                    const z = transformation['amount']['z']
                    // check if they are defined
                    if (![x,y,z].every((value) => value !== undefined)) {
                        console.error('Error in MyParser.parseNode : components in translate are undefined');
                        return
                    }
                    // check if they are of type number
                    if(![x,y,z].every(value => typeof value === 'number')) {
                        console.error('Error in MyParser.parseNode : components in translate are not numbers');
                        return
                    }
                    group.position.set(x,y,z)
                }

                if (transformation['type'] === 'rotate') {
					const x = transformation['amount']['x']
					const y = transformation['amount']['y']
					const z = transformation['amount']['z']
					// check if they are defined
					if (![x,y,z].every((value) => value !== undefined)) {
						console.error('Error in MyParser.parseNode : components in rotate are undefined');
						return
					}
					// check if they are of type number
					if(![x,y,z].every(value => typeof value === 'number')) {
						console.error('Error in MyParser.parseNode : components in rotate are not numbers');
						return
					}
					group.rotateX(x * Math.PI / 180)
                    group.rotateY(y * Math.PI / 180)
                    group.rotateZ(z * Math.PI / 180)
				}

                if (transformation['type'] === 'scale') {
					const x = transformation['amount']['x']
					const y = transformation['amount']['y']
					const z = transformation['amount']['z']
					// check if they are defined
					if (![x,y,z].every((value) => value !== undefined)) {
						console.error('Error in MyParser.parseNode : components in scale are undefined');
						return
					}
					// check if they are of type number
					if(![x,y,z].every(value => typeof value === 'number')) {
						console.error('Error in MyParser.parseNode : components in scale are not numbers');
						return
					}
                    group.scale.set(x,y,z)
				}
            }
        }
        if(parent['materialref'] !== undefined) {
            const material = this.parser.dataMaterials[parent['materialref']['materialId']]
            console.log(material)
            console.log(name)

            group.children.forEach((child) => {
                console.log(child)
                if (child.isMesh) {
                    console.log(child)
                    console.log(child.material)
                  child.material = material;
                }
              });
        }

        if(name === this.parser.rootO) {

        }
        return group
    }

    update() {
    }

}

export { MyContents };
