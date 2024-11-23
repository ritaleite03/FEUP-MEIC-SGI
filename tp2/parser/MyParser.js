import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';

class MyParser {

	/**
	   constructs the object
	*/
	constructor(app, data) {
		this.app = app
		this.buider = new MyNurbsBuilder()
		if(!data.yasf.globals || !data.yasf.cameras || !data.yasf.textures || !data.yasf.materials || !data.yasf.graph || Object.keys(data.yasf).length < 5) {
			console.error('Error in MyParser.constructor: unexpected or missing blocks');
			return;
		}
		if(!data.yasf.cameras.initial || !data.yasf.graph.rootid) {
			console.error('Error in MyParser.constructor: rootid or initial camera missing definitions');
			return;			
		}
		if(!data.yasf.graph[data.yasf.graph.rootid] || !data.yasf.cameras[data.yasf.cameras.initial]) {
			console.error('Error in MyParser.constructor: name of rootid or initial camera missing definitions');
			return;
		}
		this.defineGlobals(data.yasf.globals)
		this.defineCameras(data.yasf.cameras)
		this.dataTextures = []
		this.dataMaterials = []
		this.dataNodes = []
		this.dataLights = []
		for(let key in data.yasf.textures) this.getTexture(key, data.yasf.textures[key])
		for(let key in data.yasf.materials) this.getMaterial(key, data.yasf.materials[key])
		this.app.setActiveCamera(data.yasf.cameras.initial)
		this.app.scene.add(this.parse(data.yasf.graph, data.yasf.graph.rootid, null, false, false))
		for(const light of this.dataLights) {
			if (light instanceof THREE.SpotLight) {
				const helper = new THREE.SpotLightHelper(light)
				helper.visible = false
				this.app.scene.add(helper)
			}
			if (light instanceof THREE.PointLight) {
				const helper = new THREE.PointLightHelper(light)
				helper.visible = false
				this.app.scene.add(helper)
			}
		}
	}

	defineGlobals(data) {
		if (!data.background || !data.ambient || !data.fog || !data.skybox || Object.keys(data).length !== 4) {
			console.error('Error in MyParser.defineGlobals: unexpected or missing definitions');
			return;
		}
		if (!data.skybox.size || !data.skybox.center || !data.skybox.emissive || !data.skybox.front || !data.skybox.back || !data.skybox.up || !data.skybox.down || ! data.skybox.left || !data.skybox.right || Object.keys(data.skybox).length !== 10) {
			console.error('Error in MyParser.defineSkybox: unexpected or missing definitions');
			return
		}
		const app_background = [data.background.r, data.background.g, data.background.b];
		if ([...app_background].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineGlobals: invalid or undefined values in background');
			return;
		}	
		this.app.scene.background = new THREE.Color().setRGB(...app_background);
		const app_ambient = [data.ambient.r, data.ambient.g, data.ambient.b];
		if ([...app_ambient].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineGlobals: invalid or undefined values in ambient');
			return;
		}
		this.app.scene.ambient = new THREE.Color().setRGB(...app_ambient);
		const fog_color = [data.fog.color.r, data.fog.color.g, data.fog.color.b]
		const fog_near = data.fog.near
		const fog_far = data.fog.far
		if ([...fog_color, fog_near, fog_far].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineGlobals: invalid or undefined values in fog');
			return;
		}
        this.app.scene.fog = new THREE.Fog(new THREE.Color().setRGB(...fog_color), fog_near, fog_far)
		const sky_dimensions = [data.skybox.size.x, data.skybox.size.y, data.skybox.size.z]
		const sky_center = [data.skybox.center.x, data.skybox.center.y, data.skybox.center.z]
		const sky_emissive = [data.skybox.emissive.r, data.skybox.emissive.g, data.skybox.emissive.b]
		const sky_intensity = data.skybox.intensity	
		if ([...sky_dimensions, ...sky_center, ...sky_emissive, sky_intensity].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.defineGlobals: invalid or undefined skybox');
			return;
		}	
		const loader = new THREE.TextureLoader()
		const sky_color = new THREE.Color().setRGB(...sky_emissive);
		const material1 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.front), side: THREE.DoubleSide})
		const material2 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.back), side: THREE.DoubleSide})
		const material3 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.up), side: THREE.DoubleSide})
		const material4 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.down), side: THREE.DoubleSide})
		const material5 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.left), side: THREE.DoubleSide})
		const material6 = new THREE.MeshPhongMaterial({emissive:sky_color, emissiveIntensity:sky_intensity, map:loader.load(data.skybox.right), side: THREE.DoubleSide})
		const materials = [material1, material2, material3, material4, material5, material6]
		const object = new THREE.BoxGeometry(...sky_dimensions)
		const mesh = new THREE.Mesh(object, materials)
		mesh.position.set(...sky_center)
		this.app.scene.add(mesh)
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
				if ([...position, ...target, angle, near, far].some(val => val === undefined || typeof val !== 'number')) {
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
				if ([...position, ...target, near, far, left, right, bottom, top].some(val => val === undefined || typeof val !== 'number')) {
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
		const all = [...color, ...specular, ...emissive]
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
			attributes.map = texture
		}
		if(data.bumpref) {
			const bump = this.dataTextures[data.bumpref].clone()
			if (data.texlength_s) bump.repeat.x = data.texlength_s;
			if (data.texlength_t) bump.repeat.y = data.texlength_t;
			attributes.bumpMap = bump
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
		const pointlight = new THREE.PointLight(new THREE.Color().setRGB(...color), intensity, distance, decay)
		pointlight.position.set(...position)
		pointlight.castShadow = castshadow
		pointlight.shadowfar = shadowfar
		pointlight.shadowmapsize = shadowmapsize
		this.dataLights.push(pointlight)
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
		const angle = prim.angle * Math.PI / 180
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
		const spotlight = new THREE.SpotLight(new THREE.Color().setRGB(...color), intensity, distance, angle, penumbra, decay)
		spotlight.position.set(...position)
		spotlight.target.position.set(...target)
		spotlight.castShadow = castshadow
		spotlight.shadowfar = shadowfar
		spotlight.shadowmapsize = shadowmapsize
		this.dataLights.push(spotlight)
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
		const directionallight = new THREE.DirectionalLight(new THREE.Color().setRGB(...color), intensity)
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

    parseRectangle(prim, material) {
		if (![prim.xy1, prim.xy2].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseRectangle : missing attributes');
			return
		}
		if ([prim.xy1.x, prim.xy1.y, prim.xy2.x, prim.xy2.y].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseRectangle: invalid or undefined values');
			return
		}
		const width = Math.abs(prim.xy2.x) + Math.abs(prim.xy1.x);
		const height = Math.abs(prim.xy2.y) + Math.abs(prim.xy1.y);
		const parts_x = prim.parts_x ? prim.parts_x : 1
		const parts_y = prim.parts_y ? prim.parts_y : 1
		const object = new THREE.PlaneGeometry(width, height, parts_x, parts_y)
		const mesh =  new THREE.Mesh(object, material)
		mesh.position.set((prim.xy1.x + prim.xy2.x) / 2, (prim.xy1.y + prim.xy2.y) / 2, 0)
		return mesh
	}

	parseTriangle(prim, material) {
		if (![prim.xyz1, prim.xyz2, prim.xyz3].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseTriangle : missing attributes');
			return
		}
		const position1 = [prim.xyz1.x, prim.xyz1.y, prim.xyz1.z]
		const position2 = [prim.xyz2.x, prim.xyz2.y, prim.xyz2.z]
		const position3 = [prim.xyz3.x, prim.xyz3.y, prim.xyz3.z]
		if ([...position1, ...position2, ...position3].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseTriangle: invalid or undefined values');
			return
		}
		const object =  new THREE.Triangle(new THREE.Vector3(...position1), new THREE.Triangle(...position2), new THREE.Triangle(...position3))
		const mesh = new THREE.Mesh(object, material)
		mesh.position.set((prim.xyz1.x + prim.xyz2.x + prim.xyz3.x) / 3, (prim.xyz1.y + prim.xyz2.y + prim.xyz3.y) / 3, 0)
		return mesh
	}

	parseBox(prim, material) {
		if (![prim.xyz1, prim.xyz2].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseBox : missing attributes');
			return
		}
		if ([prim.xyz1.x, prim.xyz1.y, prim.xyz1.z, prim.xyz2.x, prim.xyz2.y, prim.xyz2.z].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseBox: invalid or undefined values');
			return
		}
		const width = Math.abs(prim.xyz2.x) + Math.abs(prim.xyz1.x);
		const height = Math.abs(prim.xyz2.y) + Math.abs(prim.xyz1.y);
		const depth = Math.abs(prim.xyz2.z) + Math.abs(prim.xyz1.z);
		const parts_x = prim.parts_x ? prim.parts_x : 1
		const parts_y = prim.parts_y ? prim.parts_y : 1
		const parts_z = prim.parts_z ? prim.parts_z : 1
		const object = new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z)
		const mesh = new THREE.Mesh(object, material)
		mesh.position.set((prim.xyz1.x + prim.xyz2.x) / 2, (prim.xyz1.y + prim.xyz2.y) / 2, (prim.xyz1.z + prim.xyz2.z) / 2)
		return mesh
	}

	parseCylinder(prim, material) {
		if (![prim.base, prim.top, prim.height, prim.slices, prim.stacks].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseCylinder : missing attributes');
			return
		}
		const thetastart = prim.thetastart ? prim.thetastart * Math.PI / 180 : 0
		const thetalength = prim.thetalength ? prim.thetalength * Math.PI / 180 : 2 * Math.PI
		const capsclose = prim.capsclose ? prim.capsclose : false
		if ([thetastart, thetalength].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseCylinder: invalid or undefined values');
			return
		}
		const object = new THREE.CylinderGeometry(prim.top, prim.base, prim.height, prim.slices, prim.stacks, capsclose, thetastart, thetalength)
		return new THREE.Mesh(object, material)
	}

	parseSphere(prim, material) {
		if (![prim.radius, prim.slices, prim.stacks].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseSphere : missing attributes');
			return
		}
		const thetastart = prim.thetastart ? prim.thetastart * Math.PI / 180 : 0
		const thetalength = prim.thetalength ? prim.thetalength * Math.PI / 180 : Math.PI
		const phistart = prim.phistart ? prim.phistart * Math.PI / 180 : 0
		const philength = prim.philength ? prim.philength * Math.PI / 180 : 2 * Math.PI
		if ([thetastart, thetalength, phistart, philength].some(val => val === undefined || typeof val !== 'number')) {
			console.error('Error in MyParser.parseSphere: invalid or undefined values');
			return
		}
		const object = new THREE.SphereGeometry(prim.radius, prim.slices, prim.stacks, phistart, philength, thetastart, thetalength)
		return new THREE.Mesh(object, material)
	}

	parseNurbs(prim, material) {
		if (![prim.degree_u, prim.degree_v, prim.parts_u, prim.parts_v, ...prim.controlpoints].every((value) => value !== undefined)) {
			console.error('Error in MyParser.parseNurbs : missing attributes');
			return
		}
		if(![prim.degree_u, prim.degree_v, prim.parts_u, prim.parts_v].every((value) => value > 0)){
			console.error('Error in MyParser.parseNurbs : attributes are not positives');
			return
		}
		if(prim.controlpoints.length !== (prim.degree_u + 1) * (prim.degree_v + 1)){
			console.error('Error in MyParser.parseNurbs : number of controlpoints are incorrect');
			return
		}
		let points = [];
		let row = [];
		for (let i = 0; i < prim.controlpoints.length; i++) {
			let x = prim.controlpoints[i].x
			let y = prim.controlpoints[i].y
			let z = prim.controlpoints[i].z
			let positions = [x,y,z]
			if (positions.some(val => val === undefined || typeof val !== 'number')) {
				console.error('Error in MyParser.parseNurbs: invalid or undefined values in points coordinates');
				return
			}
			row.push([x, y, z, 1]);
    		if ((i + 1) % (prim.degree_v + 1) === 0) { 
        		points.push(row);
        		row = [];
    		}
		}
		const object = this.buider.build(points, prim.degree_u, prim.degree_v, prim.parts_u, prim.parts_v, null)
		return new THREE.Mesh(object, material)
	}


    parse(data, name, material, castshadows, receiveshadows) {
        const parent = data[name]
		const parent_material = parent.materialref ? this.dataMaterials[parent.materialref.materialId] : material
		const parent_castshadows = parent.castshadows ? parent.castshadows : castshadows
		const parent_receiveshadows = parent.parent_receiveshadows ? parent.parent_receiveshadows : receiveshadows
        const list_children = data[name].children ? data[name].children : {}
		if(parent.type !== 'node') {
			console.error('Error in MyParser.parse: invalid or undefined parent type');
			return
		}
		if(name !== name.toLowerCase()) {
			console.error('Error in MyParser.parse: node name is not in lowercase');
			return	
		}
		if(list_children.length > 1) {
			console.error('Error in MyParser.parse: more than one primitive in the node');
			return
		}
        let  group = new THREE.Group();
		if(this.dataNodes[name]) {
			group = this.dataNodes[name].clone()
			group.name = name
			group.children.forEach((child) => {
				this.changeMaterialShadows(data, child, parent_material, parent_castshadows, parent_receiveshadows)
			  });
		}
		else {
        	for(let i = 0; i < Object.keys(list_children).length; i++) {
				const child_name = Object.keys(list_children)[i]
        	    const child_node = parent['children'][child_name]
				const child_material = parent_material ? parent_material : new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff"})
				if(child_name === 'nodesList') {
					for(const node of child_node) {
						const group_node = this.parse(data, node, parent_material, parent_castshadows, parent_receiveshadows)
						group_node.name = node
						group.add(group_node)
					}
					continue
				}
				if (child_node.type === 'pointlight') {
					const light = this.parsePointlight(child_node)
					light.name = child_name
					group.add(light)
					continue
				}
				if (child_node.type === 'spotlight') {
					const light = this.parseSpotlight(child_node)
					light.name = child_name
					group.add(light)
					continue
				}
				let mesh = null
				if (child_node.type === 'rectangle') mesh = this.parseRectangle(child_node, child_material)
				if (child_node.type === 'triangle') mesh = this.parseTriangle(child_node, child_material)
				if (child_node.type === 'box') mesh = this.parseBox(child_node, child_material)
				if (child_node.type === 'cylinder') mesh = this.parseCylinder(child_node, child_material)
				if (child_node.type === 'sphere') mesh = this.parseSphere(child_node, child_material)
				if (child_node.type === 'nurbs') mesh = this.parseNurbs(child_node, child_material)
				mesh.name = child_name
				mesh.castShadow = parent_castshadows
				mesh.receiveShadow = parent_receiveshadows
				group.add(mesh)
        	}
			group.name = name
			this.dataNodes[name] = group
		}
        if (parent.transforms) {
            for(let i = 0; i < parent.transforms.length; i++) {
                const transformation = parent.transforms[i]
                const x = transformation.amount.x
                const y = transformation.amount.y
                const z = transformation.amount.z
				if ([x, y, z].some(val => val === undefined || typeof val !== 'number')) {
					console.error('Error in MyParser.parse: invalid or undefined values');
					return
				}
                if (transformation.type === 'translate') {
                    group.position.set(x, y, z)
                }
                if (transformation.type === 'rotate') {	
					group.rotateX(x * Math.PI / 180)
                    group.rotateY(y * Math.PI / 180)
                    group.rotateZ(z * Math.PI / 180)
				}
                if (transformation.type === 'scale') {
                    group.scale.set(x, y, z)
				}
            }
        }
        return group
    }

	changeMaterialShadows(data, node, material, castshadows, receiveshadows) {
		if (node.isGroup) {
			if(data[node.name]['materialref']) {
				node.children.forEach((child) => {
					this.changeShadows(data, child, castshadows, receiveshadows)
				})
			}
			else {
				node.children.forEach((child) => {
					this.changeMaterialShadows(data, child, material, castshadows, receiveshadows)
				})
			}
		} else {
			console.log(node)
			node.material = material
			node.material.needsUpdate = true
			node.castShadow = castshadows
			node.receiveshadows = receiveshadows
			if (node instanceof THREE.SpotLight) {
				this.dataLights.push(node)
			}
			if (node instanceof THREE.PointLight) {
				this.dataLights.push(node)
			}
		}	
	}

	changeShadows(data, node, castshadows, receiveshadows) {
		if (node.isGroup) {
			node.children.forEach((child) => {
				this.changeShadows(data, child, castshadows, receiveshadows)
			})
		} else {
			console.log(node)
			node.castShadow = castshadows
			node.receiveshadows = receiveshadows
			if (node instanceof THREE.SpotLight) {
				this.dataLights.push(node)
			}
			if (node instanceof THREE.PointLight) {
				this.dataLights.push(node)
			}
		}	
	}
}

export { MyParser };
