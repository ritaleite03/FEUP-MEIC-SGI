import * as THREE from 'three';

class MyParser {

	/**
	   constructs the object
	*/
	constructor(data) {
		// check errors of syntax in blocks
		if(!this.checkSyntaxBlocks(data['yasf'])) {
			return
		}
		// define value of intial camera and root id
		this.initC = data['yasf']['cameras']['initial']
		this.rootO = data['yasf']['graph']['rootid']
		// define other components
		this.dataGlobals = []
		this.dataFog = []
		this.dataCameras = []
		this.dataTextures = []
		this.dataMaterials = []
		for(let key in data['yasf']['fog']) this.getFog(key, data['yasf']['fog'][key])
		for(let key in data['yasf']['cameras']) this.getCamera(key, data['yasf']['cameras'][key])
		for(let key in data['yasf']['textures']) this.getTexture(key, data['yasf']['textures'][key])
		for(let key in data['yasf']['materials']) this.getMaterial(key, data['yasf']['materials'][key])
	}

	checkSyntaxBlocks(data) {
		// check if there are blocks missionf
		if ([data['globals'], data['fog'], data['cameras'], data['textures'], data['materials'], data['grapf']].every((value) => value !== undefined)) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing block(s)')
			return false
		}
		// check missing mandatory components in globals
		if (!data['globals'].hasOwnProperty('background') || !data['globals'].hasOwnProperty('ambient')
		) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing components in globals')
			return false
		}
		// check missing mandatory components in fog
		if (!data['fog'].hasOwnProperty('color') || !data['fog'].hasOwnProperty('near') || !data['fog'].hasOwnProperty('far')) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing components in fog')
			return false
		}
		// check missing mandatory components in cameras
		if(!data['cameras'].hasOwnProperty('initial') || (Object.keys(data['cameras']).length < 2)) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing components in cameras')
			return false
		}
		// check missing mandatory components in materials
		if(Object.keys(data['materials']).length < 1) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing components in materials')
			return false
		}
		// check missing mandatory components in materials
		if(!data['graph'].hasOwnProperty('rootid')) {
			console.error('Error in MyParser.checkSyntaxBlocks: missing components in graph')
			return false
		}
		return true
	}

	getGlobal(name, data) {
		// variables
		const r = data['r']
		const g = data['g']
		const b = data['b']
		// check if they are defined
		if(![r, g, b].every((value) => value !== undefined)) {
			console.error('Error in MyParser.getGlobal : components in color are undefined');
			return
		}
		// check if they are of type number
		if(![r, g, b].every(value => typeof value === 'number')) {
			console.error('Error in MyParser.getGlobal : components in color are not numbers');
			return
		}
		// add component
		this.dataGlobals[name] = new THREE.Color().setRGB( r, g, b );
	}

	getFog(name, data) {
		// color component
		if(name === 'color') {
			// variables
			const r = data['r']
			const g = data['g']
			const b = data['b']
			// check if they are defined
			if(![r, g, b].every((value) => value !== undefined)) {
				console.error('Error in MyParser.getFog :  components in color are undefined');
				return
			}
			// check if they are of type number
			if(![r, g, b].every(value => typeof value === 'number')) {
				console.error('Error in MyParser.getFog : components in color are not numbers');
				return
			}
			// add component
			this.dataFog[name] = new THREE.Color().setRGB( r, g, b );
			return
		}
		// near or far components
		// check if they are of type number
		if(typeof data !== 'number') {
			console.error('Error in MyParser.getFog : near or far are not numbers');
			return
		}
		// add component
		this.dataFog[name] = data
	}

	getCamera(name, data) {
		if(name === 'initial') return
		// varibles
		let object = null
		// create camera according with its type
		if(data['type'] === 'perspective') {
			// variables
			const angle = data['angle']
			const near = data['near']
			const far = data['far']
			// check if they are defined
			if(![angle, near, far].every((value) => value !== undefined)) {
				console.error('Error in MyParser.getCamera : components in perspective are undefined');
				return
			}
			// check if they are of type number
			if(![angle, near, far].every(value => typeof value === 'number')) {
				console.error('Error in MyParser.getCamera : components in perspective are not numbers');
				return
			}
			// create camera object
			object = new THREE.PerspectiveCamera(angle, window.innerWidth / window.innerHeight, near, far)
		}
		else if(data['type'] === 'orthogonal') {
			// varibles
			const near = data['near']
			const far =  data['far']
			const left = data['left']
			const right = data['right']
			const bottom = data['bottom']
			const top = data['top']
			// check if they are defined
			if(![near, far, left, right, bottom, top].every((value) => value !== undefined)) {
				console.error('Error in MyParser.getCamera : components in orthogonal are undefined');
				return
			}
			// check if they are of type number
			if(![near, far, left, right, bottom, top].every(value => typeof value === 'number')) {
				console.error('Error in MyParser.getCamera : components in orthogonal are not numbers');
				return
			}
			// create camera object
			object = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
		}
		else {
			console.error('Error in MyParser.getCamera : type not known');
			return
		}
		// define position and target
		if(data['location'] === undefined || data['target'] === undefined) {
			console.error('Error in MyParser.getCamera : location or target are undefined');
			return
		}
		// variables
		const xL = data['location']['x']
		const yL = data['location']['y']
		const zL = data['location']['z']
		const xT = data['target']['x']
		const yT = data['target']['y']
		const zT = data['target']['z']
		// check if they are of type number
		if(![xL,yL,zL,xT,yT,zT].every(value => typeof value === 'number')) {
			console.error('Error in MyParser.getCamera : components in location or target are not numbers');
			return
		}
		// check if they are defined
		if(![xL,yL,zL,xT,yT,zT].every((value) => value !== undefined)) {
			console.error('Error in MyParser.getCamera : components in location or target are undefined');
			return
		}
		// add camera
		object.position.set(xL,yL,zL)
		object.lookAt(xT,yT,zT)
		this.dataCameras[name] = object
	}

	getTexture(name, data) {
		const loader = new THREE.TextureLoader()
		// check if filepath is defined
		if(data['filepath'] === undefined) {
			console.error('Error in MyParser.getTexture : component filepath is undefined');
			return
		}
		// check if filepath is of type number
		if(typeof data['filepath'] !==  'string') {
			console.error('Error in MyParser.getTexture : component filepath is not string');
			return
		}
		// add texture
		this.dataTextures[name] = loader.load(data['filepath']);
	}

	getMaterial(name, data) {
		let attributes = {}
		// check if there are mandotory attributes missing
		if (![data['color'], data['specular'], data['shininess'], data['emissive'], data['transparent'], data['opacity']].every((value) => value !== undefined)) {
			console.error('Error in MyParser.getMaterial : missing attributes');
			return
		}
		// color, specular and emissive attributes
		const rC = data['color']['r']
		const gC = data['color']['g']
		const bC = data['color']['b']
		const rS = data['specular']['r']
		const gS = data['specular']['g']
		const bS = data['specular']['b']
		const rE = data['emissive']['r']
		const gE = data['emissive']['g']
		const bE = data['emissive']['b']
		const shininess = data['shininess']
		const opacity = data['opacity']
		// check if they are defined
		if (![rC,gC,bC,rS,gS,bS,rE,gE,bE,shininess,opacity].every((value) => value !== undefined)) {
			console.error('Error in MyParser.getMaterial : components in color, specular, emissive, shininess or opacity are undefined');
			return
		}
		// check if they are of type number
		if(![rC,gC,bC,rS,gS,bS,rE,gE,bE,shininess,opacity].every(value => typeof value === 'number')) {
			console.error('Error in MyParser.getMaterial : components in color, specular, emissive, shininess or opacity are not numbers');
			return
		}
		// add attributes
		attributes['color'] = new THREE.Color().setRGB( rC, gC, bC )
		attributes['specular'] = new THREE.Color().setRGB( rS, gS, bS )
		attributes['emissive'] = new THREE.Color().setRGB( rE, gE, bE )
		attributes['shininess'] = shininess
		attributes['opacity'] = opacity
		// other attributes
		if (data['wireframe'] !== undefined) {
			// check if wireframe is of type boolean
			if(typeof data['wireframe'] !== 'boolean') {
				console.error('Error in MyParser.getMaterial : component wireframe is not boolean');
				return
			}
			attributes['wireframe'] = data['wireframe']
		}
		if(data['twosided'] !== undefined) {
			// check if twosided is of type boolean
			if(typeof data['twosided'] !== 'boolean') {
				console.error('Error in MyParser.getMaterial : component twosided is not boolean');
				return
			}
			attributes['side'] = THREE.DoubleSide
		}
		this.dataMaterials[name] = new THREE.MeshPhongMaterial(attributes)
	}
}

export { MyParser };
