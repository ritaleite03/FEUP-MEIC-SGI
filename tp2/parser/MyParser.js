import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';

class MyParser {

	/**
	   constructs the object
	*/
	constructor(app, data) {
		this.app = app
		this.buider = new MyNurbsBuilder
		this.defineGlobals(data.yasf.globals)
		this.defineFog(data.yasf.fog)
		this.defineCameras(data.yasf.cameras)
		this.dataTextures = []
		this.dataMaterials = []
		for(let key in data.yasf.textures) this.getTexture(key, data.yasf.textures[key])
		for(let key in data.yasf.materials) this.getMaterial(key, data.yasf.materials[key])
		this.app.setActiveCamera(data.yasf.cameras.initial)
		this.app.scene.add(this.parse(data.yasf.graph, data.yasf.graph.rootid, null))
	}

	defineGlobals(data) {
		if (!data.background || !data.ambient || Object.keys(data).length !== 2) {
			console.error('Error in MyParser.defineGlobals: unexpected or missing definitions');
			return;
		}	
		const background = [data.background.r, data.background.g, data.background.b];
		const ambient = [data.ambient.r, data.ambient.g, data.ambient.b];
		const all = [...background, ...ambient];
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineGlobals: invalid or undefined values');
			return;
		}	
		this.app.scene.background = new THREE.Color(...background);
		this.app.scene.ambient = new THREE.Color(...ambient);
	}
	
	defineFog(data) {
		if (!data.color || !data.near || !data.far || Object.keys(data).length !== 3) {
			console.error('Error in MyParser.defineFog: unexpected or missing definitions');
			return
		}
		const color = [data.color.r, data.color.g, data.color.b]
		const near = data.near
		const far = data.far
		const all = [...color, near, far]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineFog: invalid or undefined values');
			return
		}
        this.app.scene.fog = new THREE.Fog( new THREE.Color(...color), near, far)
	}

	defineCameras(data) {
		let listCameras = []
		if (!data.initial || Object.keys(data).length < 2) {
			console.error('Error in MyParser.defineCameras: unexpected or missing definitions');
			return
		}
		for(let key in data) {
			if(key === 'initial') {
				continue
			}	
			if(data[key].type === 'perspective') {
				const position = [data[key].location.x, data[key].location.y, data[key].location.z]
				const target = [data[key].target.x, data[key].target.y, data[key].target.z]
				const angle = data[key].angle
				const near = data[key].near
				const far = data[key].far
				const all = [...position, ...target, angle, near, far]
				if (all.some(val => val === undefined || typeof val !== 'number')) {
					console.error('Error in MyParser.defineCameras: invalid or undefined values');
					return
				}
				const objectCamera = new THREE.PerspectiveCamera(angle, window.innerWidth / window.innerHeight, near, far)
				objectCamera.position.set(...position)
				objectCamera.lookAt(...target)
				listCameras[key] = objectCamera
				continue
			}
			if(data[key].type === 'orthogonal') {
				const position = [data[key].location.x, data[key].location.y, data[key].location.z]
				const target = [data[key].target.x, data[key].target.y, data[key].target.z]
				const near = data[key].near
				const far =  data[key].far
				const left = data[key].left
				const right = data[key].right
				const bottom = data[key].bottom
				const top = data[key].top
				const all = [...position, ...target, near, far, left, right, bottom, top]
				if (all.some(val => val === undefined || typeof val !== 'number')) {
					console.error('Error in MyParser.defineCameras: invalid or undefined values');
					return
				}
				const objectCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
				objectCamera.position.set(...position)
				objectCamera.lookAt(...target)
				listCameras[key] = objectCamera
				continue
			}
			else {
				console.error('Error in MyParser.defineCameras : type not known');
				return
			}
		}
		this.app.cameras = listCameras

	}

	getTexture(name, data) {
		if(!data.filepath) {
			console.error('Error in MyParser.getTexture : component filepath is undefined');
			return
		}
		if(typeof data.filepath !==  'string') {
			console.error('Error in MyParser.getTexture : component filepath is not string');
			return
		}
		const texture = new THREE.TextureLoader().load(data.filepath);
		texture.wrapS = THREE.RepeatWrapping
		texture.wrapT = THREE.RepeatWrapping
		this.dataTextures[name] = texture
	}

	getMaterial(name, data) {
		let attributes = {}
		if (![data.color, data.specular, data.shininess, data.emissive, data.transparent, data.opacity].every((value) => value !== undefined)) {
			console.error('Error in MyParser.getMaterial : missing attributes');
			return
		}
		const color = [data.color.r, data.color.g, data.color.b]
		const specular = [data.specular.r, data.specular.g, data.specular.b]
		const emissive = [data.emissive.r, data.emissive.g, data.emissive.b]
		const shininess = data.shininess
		const opacity = data.opacity
		const all = [...color, ...specular, ...emissive, shininess, opacity]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.getMaterial: invalid or undefined values');
			return
		}
		attributes.color = new THREE.Color().setRGB(...color)
		attributes.specular = new THREE.Color().setRGB(...specular)
		attributes.emissive = new THREE.Color().setRGB(...emissive)
		attributes.shininess = shininess
		attributes.opacity = opacity
		attributes.wireframe = data.wireframe ? data.wireframe : false
		if(data.shading) {
			if(typeof data.shading !== 'boolean') {
				console.error('Error in MyParser.getMaterial : invalid or undefined values');
				return
			}
			attributes.flatShading = true
		}
		if(data.twosided) {
			if(typeof data.twosided !== 'boolean') {
				console.error('Error in MyParser.getMaterial : invalid or undefined values');
				return
			}
			attributes['side'] = THREE.DoubleSide
		}
		if(data.textureref) {
			const texture = this.dataTextures[data.textureref].clone()
			if (data.texlength_s) texture.repeat.x = data.texlength_s;
			if (data.texlength_t) texture.repeat.y = data.texlength_t;
			texture.wrapS = THREE.MirroredRepeatWrapping;
			texture.wrapT = THREE.MirroredRepeatWrapping;
			attributes.map = texture
		}
		if(data.bumpref) {
			attributes.bumpMap = this.dataTextures[data.bumpref].clone()
			attributes.bumpScale = data.bumpscale ? data.bumpscale : 1
		}
		if(data.specularref) {
			attributes.specularMap = this.dataTextures[data.specularref].clone()
		}
		this.dataMaterials[name] = new THREE.MeshPhongMaterial(attributes)
	}

	parsePointlight(prim) {
		if (![prim.color, prim.position].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parsePointlight : missing attributes');
			return
		}
		const position = [prim.position.x, prim.position.y, prim.position.z]
		const color = [prim.color.r, prim.color.g, prim.color.b]
		const intensity = prim.intensity ? prim.intensity : 1
		const distance = prim.distance ? prim.distance : 2000
		const decay = prim.decay ? prim.decay : 2
		const shadowfar = prim.shadowfar ? prim.shadowfar : 500
		const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512
		const castshadow = prim.castshadow ? prim.castshadow : false
		const all = [...position, ...color, intensity, distance, decay, shadowfar, shadowmapsize]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parsePointlight: invalid or undefined values');
			return
		}
		const pointlight = new THREE.PointLight(new THREE.Color(...color), intensity, distance, decay)
		pointlight.position.set(...position)
		pointlight.castShadow = castshadow
		pointlight.shadowfar = shadowfar
		pointlight.shadowmapsize = shadowmapsize
		return pointlight
	}

	parseSpotlight(prim) {
		if (![prim.color, prim.angle, prim.position, prim.target].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseSpotlight : missing attributes');
			return
		}
		const position = [prim.position.x, prim.position.y, prim.position.z]
		const target = [prim.target.x, prim.target.y, prim.target.z]
		const color = [prim.color.r, prim.color.g, prim.color.b]
		const intensity = prim.intensity ? prim.intensity : 1
		const distance = prim.distance ? prim.distance : 2000
		const angle = prim.angle
		const decay = prim.decay ? prim.decay : 2
		const penumbra = prim.penumbra ? prim.penumbra : 1
		const shadowfar = prim.shadowfar ? prim.shadowfar : 500
		const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512
		const castshadow = prim.castshadow ? prim.castshadow : false
		const all = [...position, ...target, ...color, intensity, distance, angle, decay, penumbra, shadowfar, shadowmapsize]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseSpotlight: invalid or undefined values');
			return
		}
		const spotlight = new THREE.SpotLight(new THREE.Color(...color), intensity, distance, angle, penumbra, decay)
		spotlight.position.set(...position)
		spotlight.target.position.set(...target)
		spotlight.castShadow = castshadow
		spotlight.shadowfar = shadowfar
		spotlight.shadowmapsize = shadowmapsize
		return spotlight
	}

	parseDirectionalLight(prim) {
		if (![prim.color, prim.position].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseSpotlight : missing attributes');
			return
		}
		const position = [prim.position.x, prim.position.y, prim.position.z]
		const color = [prim.color.r, prim.color.g, prim.color.b]
		const intensity = prim.intensity ? prim.intensity : 1
		const shadowleft = prim.shadowleft ? prim.shadowleft : -5
		const shadowright = prim.shadowright ? prim.shadowright : 5
		const shadowbottom = prim.shadowbottom ? prim.shadowbottom : -5
		const shadowtop = prim.shadowtop ? prim.shadowtop : 5
		const shadowfar = prim.shadowfar ? prim.shadowfar : 500
		const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512
		const castshadow = prim.castshadow ? prim.castshadow : false
		const all = [...position, ...color, intensity, shadowleft, shadowright, shadowbottom, shadowtop, shadowfar, shadowmapsize]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseSpotlight: invalid or undefined values');
			return
		}
		const directionallight = new THREE.DirectionalLight(new THREE.Color(...color), intensity)
		directionallight.position.set(...position)
		directionallight.castShadow = castshadow
		directionallight.shadowleft = shadowleft
		directionallight.shadowright = shadowright
		directionallight.shadowtop = shadowtop
		directionallight.shadowbottom = shadowbottom
		directionallight.shadowfar = shadowfar
		directionallight.shadowmapsize = shadowmapsize
		return directionallight
	}

    parseRectangle(prim) {
		if (![prim.xy1, prim.xy2].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseRectangle : missing attributes');
			return
		}
		const xy1X = prim.xy1.x
		const xy1Y = prim.xy1.y
		const xy2X = prim.xy2.x
		const xy2Y = prim.xy2.y
		const all = [xy1X, xy1Y, xy2X, xy2Y]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseRectangle: invalid or undefined values');
			return
		}
		const width = Math.abs(xy2X) + Math.abs(xy1X);
		const height = Math.abs(xy2Y) + Math.abs(xy1Y);
		const parts_x = prim.parts_x ? prim.parts_x : 1
		const parts_y = prim.parts_y ? prim.parts_y : 1
		return new THREE.PlaneGeometry(width,height,parts_x,parts_y)
	}

	parseTriangle(prim) {
		if (![prim.xyz1, prim.xyz2, prim.xyz3].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseTriangle : missing attributes');
			return
		}
		const position1 = [prim.xyz1.x, prim.xyz1.y, prim.xyz1.z]
		const position2 = [prim.xyz2.x, prim.xyz2.y, prim.xyz2.z]
		const position3 = [prim.xyz3.x, prim.xyz3.y, prim.xyz3.z]
		const all = [...position1, ...position2, ...position3]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseTriangle: invalid or undefined values');
			return
		}
		return new THREE.Triangle(new THREE.Vector3(...position1), new THREE.Triangle(...position2), new THREE.Triangle(...position3))
	}

	parseBox(prim) {
		if (![prim.xyz1, prim.xyz2].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseBox : missing attributes');
			return
		}
		const xyz1X = prim.xyz1.x
		const xyz1Y = prim.xyz1.y
		const xyz1Z = prim.xyz1.z
		const xyz2X = prim.xyz2.x
		const xyz2Y = prim.xyz2.y
		const xyz2Z = prim.xyz2.z
		const all = [xyz1X, xyz1Y, xyz1Z, xyz2X, xyz2Y, xyz2Z]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseBox: invalid or undefined values');
			return
		}
		const width = Math.abs(xyz2X - xyz1X);
		const height = Math.abs(xyz2Y - xyz1Y);
		const depth = Math.abs(xyz2Z - xyz1Z);
		const parts_x = prim.parts_x ? prim.parts_x : 1
		const parts_y = prim.parts_y ? prim.parts_y : 1
		const parts_z = prim.parts_z ? prim.parts_z : 1
		return new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z)
	}

	parseCylinder(prim) {
		if (![prim.base, prim.top, prim.height, prim.slices, prim.stacks].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseCylinder : missing attributes');
			return
		}
		const base = prim.base
		const top = prim.top
		const height = prim.height
		const slices = prim.slices
		const stacks = prim.stacks
		const thetaStart = prim.thetaStart ? prim.thetaStart * Math.PI / 180 : 0
		const thetaLength = prim.thetaLength ? prim.thetaLength * Math.PI / 180 : 2 * Math.PI
		const all = [base, top, height, slices, stacks, thetaStart, thetaLength]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseCylinder: invalid or undefined values');
			return
		}
		const capsclose = prim.capsclose ? prim.capsclose : false
		return new THREE.CylinderGeometry(top, base, height, slices, stacks, capsclose, thetaStart, thetaLength)
	}

	parseSphere(prim) {
		if (![prim.radius, prim.slices, prim.stacks].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseSphere : missing attributes');
			return
		}
		const radius = prim.radius
		const slices = prim.slices
		const stacks = prim.stacks
		const thetastart = prim.thetastart ? prim.thetastart * Math.PI / 180 : 0
		const thetalength = prim.thetalength ? prim.thetalength * Math.PI / 180 : Math.PI
		const phistart = prim.phistart ? prim.phistart * Math.PI / 180 : 0
		const philength = prim.philength ? prim.philength * Math.PI / 180 : 2 * Math.PI
		const all = [radius, slices, stacks, thetastart, thetalength, phistart, philength]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseSphere: invalid or undefined values');
			return
		}
		return new THREE.SphereGeometry(radius, slices, stacks, phistart, philength, thetastart, thetalength)
	}

	parseNurbs(prim) {
		if (![prim.degree_u, prim.degree_v, prim.parts_u, prim.parts_v, prim.controlpoints].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseSphere : missing attributes');
			return
		}
		const degree_u = prim.degree_u
		const degree_v = prim.degree_v
		const parts_u = prim.parts_u
		const parts_v = prim.parts_v
		const controlpoints = prim.controlpoints
		const all = [degree_u, degree_v, parts_u, parts_v]
		if (all.some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseSphere: invalid or undefined values');
			return
		}
		if (controlpoints.some(innerList => !Array.isArray(innerList) || innerList.some(val => val === undefined || typeof val !== 'number'))) {
			console.error('Error in MyParser.parseSphere: invalid or undefined values');
			return;
		}
		return this.buider.build(controlpoints, degree_u, degree_v, parts_u, parts_v)
	}


    parse(data, name, material) {
        const parent = data[name]
        const children = data[name].children
        const group = new THREE.Group();
        if(parent.materialref) {
			material = this.dataMaterials[parent.materialref.materialId]
		}
        for(let i = 0; i < Object.keys(children).length; i++) {
			const name = Object.keys(children)[i]
            const node = parent['children'][name]
            if (node.type === 'noderef') {
                group.add(this.parse(data, name, material))
            }
            else {
                let object = null
                if (node.type === 'pointlight') group.add(this.parsePointlight(node))
				if (node.type === 'spotlight') group.add(this.parseSpotlight(node))
				if (node.type === 'rectangle') object = this.parseRectangle(node)
				if (node.type === 'triangle') object = this.parseTriangle(node)
				if (node.type === 'box') object = this.parseBox(node)
				if (node.type === 'cylinder') object = this.parseCylinder(node)
				if (node.type === 'sphere') object = this.parseSphere(node)
				if (node.type === 'nurbs') object = this.parseNurbs(node)
                if(object) {
					let objectMaterial = material ? material : new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff"})
                    const mesh = new THREE.Mesh(object, objectMaterial)
                    group.add(mesh)
                }
            }
        } 
        if (parent.transforms) {
            for(let i = 0; i < parent.transforms.length; i++) {
                const transformation = parent.transforms[i]
                const x = transformation.amount.x
                const y = transformation.amount.y
                const z = transformation.amount.z
				const all = [x,y,z]
				if (all.some(val => val === undefined || typeof val !== 'number')) {
					console.error('Error in MyParser.parse: invalid or undefined values');
					return
				}
                if (transformation.type === 'translate') {
                    group.position.set(...all)
                }
                if (transformation.type === 'rotate') {	
					group.rotateX(x * Math.PI / 180)
                    group.rotateY(y * Math.PI / 180)
                    group.rotateZ(z * Math.PI / 180)
				}
                if (transformation.type === 'scale') {
                    group.scale.set(...all)
				}
            }
        }
        return group
    }
}

export { MyParser };
