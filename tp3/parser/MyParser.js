import * as THREE from "three";
import { MyNurbsBuilder } from "../MyNurbsBuilder.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTrack } from "../object/MyTrack .js";
import { MyRoute } from "../object/MyRoute.js";
import { MyPowerUp } from "../object/MyPowerUp.js";
import { MyObstacle } from "../object/MyObstacle.js";

class MyParser {
    /**
     * Constructs the object.
     */
    constructor(app, data) {
        // Set up initial variables
        this.app = app;
        this.data = data;
        this.dataCameras = [];
        this.dataTextures = [];
        this.dataMaterials = [];
        this.dataNodes = [];
        this.dataLights = [];
        this.dataLightsHelpers = [];
        this.ambientLight = null;
        this.graph = null;

        // Set up game variables
        this.track = null;
        this.routes = [];
        this.powerUps = [];
        this.powerDowns = [];
        this.parkPlayer = [];
        this.parkOponent = [];

        this.buider = new MyNurbsBuilder();
    }

    /**
     * Initializes the object and processes asynchronous tasks.
     */
    async initialize() {
        // Validate data structure
        if (
            !this.data.yasf.globals ||
            !this.data.yasf.cameras ||
            !this.data.yasf.textures ||
            !this.data.yasf.materials ||
            !this.data.yasf.graph ||
            Object.keys(this.data.yasf).length < 5
        ) {
            console.error(
                "Error in MyParser.initialize: unexpected or missing blocks"
            );
            throw new Error(
                "Initialization failed due to missing data blocks."
            );
        }
        if (!this.data.yasf.cameras.initial || !this.data.yasf.graph.rootid) {
            console.error(
                "Error in MyParser.initialize: rootid or initial camera missing definitions"
            );
            throw new Error(
                "Initialization failed due to missing rootid or initial camera."
            );
        }
        if (
            !this.data.yasf.graph[this.data.yasf.graph.rootid] ||
            !this.data.yasf.cameras[this.data.yasf.cameras.initial]
        ) {
            console.error(
                "Error in MyParser.initialize: name of rootid or initial camera missing definitions"
            );
            throw new Error(
                "Initialization failed due to incorrect rootid or initial camera definitions."
            );
        }

        // Load textures
        await this.getAllTextures();

        // Process materials
        for (let key in this.data.yasf.materials) {
            this.getMaterial(key, this.data.yasf.materials[key]);
        }

        // Define globals and cameras
        this.defineGlobals(this.data.yasf.globals);
        this.defineCameras(this.data.yasf.cameras);
        this.defineTrack(this.data.yasf.track);
        this.defineRoutes(this.data.yasf.routes);
        this.definePowerUp(this.data.yasf.powerUp);
        this.definePowerDown(this.data.yasf.powerDown);
        this.defineParkPlayer(this.data.yasf.parkPlayer);
        this.defineParkOponent(this.data.yasf.parkOponent);

        // Parse the scene graph
        this.graph = this.parse(
            this.data.yasf.graph,
            this.data.yasf.graph.rootid,
            null,
            false,
            false
        );
        this.graph.name = "root_graph";

        // Add lights' helpers
        for (const light of this.dataLights) {
            if (light instanceof THREE.SpotLight)
                this.dataLightsHelpers.push({
                    light: light,
                    helper: new THREE.SpotLightHelper(light),
                });
            if (light instanceof THREE.PointLight)
                this.dataLightsHelpers.push({
                    light: light,
                    helper: new THREE.PointLightHelper(light),
                });
            if (light instanceof THREE.DirectionalLight)
                this.dataLightsHelpers.push({
                    light: light,
                    helper: new THREE.DirectionalLightHelper(light),
                });
        }
    }

    /**
     *
     * Parses information from globals block.
     * Defines the background, the ambient light, the skybox and the fog.
     *
     * @param {Object} data object corresponding to globals block
     * @returns
     */
    defineGlobals(data) {
        // repor skybox
        // check for errors
        if (
            !data.background ||
            !data.ambient ||
            !data.fog ||
            !data.skybox ||
            Object.keys(data).length !== 4
        ) {
            console.error(
                "Error in MyParser.defineGlobals: unexpected or missing definitions"
            );
            return;
        }
        if (
            !data.skybox.size ||
            !data.skybox.center ||
            !data.skybox.emissive ||
            !data.skybox.front ||
            !data.skybox.back ||
            !data.skybox.up ||
            !data.skybox.down ||
            !data.skybox.left ||
            !data.skybox.right ||
            Object.keys(data.skybox).length !== 10
        ) {
            console.error(
                "Error in MyParser.defineSkybox: unexpected or missing definitions"
            );
            return;
        }
        const app_background = [
            data.background.r,
            data.background.g,
            data.background.b,
        ];
        if (
            [...app_background].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.defineGlobals: invalid or undefined values in background"
            );
            return;
        }

        // define background
        this.app.scene.background = new THREE.Color().setRGB(...app_background);
        const app_ambient = [data.ambient.r, data.ambient.g, data.ambient.b];
        if (
            [...app_ambient].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.defineGlobals: invalid or undefined values in ambient"
            );
            return;
        }

        const ambient_color = new THREE.Color().setRGB(...app_ambient);
        const ambient_intesity = data.ambient.intensity;
        this.ambientLight = new THREE.AmbientLight(
            ambient_color,
            ambient_intesity
        );

        // define ambient
        const fog_color = [
            data.fog.color.r,
            data.fog.color.g,
            data.fog.color.b,
        ];
        const fog_near = data.fog.near;
        const fog_far = data.fog.far;
        if (
            [...fog_color, fog_near, fog_far].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.defineGlobals: invalid or undefined values in fog"
            );
            return;
        }
        this.app.scene.fog = new THREE.Fog(
            new THREE.Color().setRGB(...fog_color),
            fog_near,
            fog_far
        );

        // define skybox
        const sky_dimensions = [
            data.skybox.size.x,
            data.skybox.size.y,
            data.skybox.size.z,
        ];
        const sky_center = [
            data.skybox.center.x,
            data.skybox.center.y,
            data.skybox.center.z,
        ];
        const sky_emissive = [
            data.skybox.emissive.r,
            data.skybox.emissive.g,
            data.skybox.emissive.b,
        ];
        const sky_intensity = data.skybox.intensity;
        if (
            [
                ...sky_dimensions,
                ...sky_center,
                ...sky_emissive,
                sky_intensity,
            ].some((val) => val === undefined || typeof val !== "number")
        ) {
            console.error(
                "Error in MyParser.defineGlobals: invalid or undefined skybox"
            );
            return;
        }
        const loader = new THREE.TextureLoader();
        const sky_color = new THREE.Color().setRGB(...sky_emissive);
        const material_right = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.right),
            side: THREE.DoubleSide,
        });
        const material_left = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.left),
            side: THREE.DoubleSide,
        });
        const material_up = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.up),
            side: THREE.DoubleSide,
        });
        const material_down = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.down),
            side: THREE.DoubleSide,
        });
        const material_back = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.back),
            side: THREE.DoubleSide,
        });
        const material_front = new THREE.MeshPhongMaterial({
            emissive: sky_color,
            emissiveIntensity: sky_intensity,
            map: loader.load(data.skybox.front),
            side: THREE.DoubleSide,
        });
        const object = new THREE.BoxGeometry(...sky_dimensions);
        const mesh = new THREE.Mesh(object, [
            material_right,
            material_left,
            material_up,
            material_down,
            material_back,
            material_front,
        ]);
        mesh.position.set(...sky_center);
        this.app.scene.add(mesh);
    }

    /**
     *
     * Parses information from cameras block.
     * Creates the cameras and saves them in dataCameras.
     *
     * @param {Object} data object corresponding to cameras block
     * @returns
     */
    defineCameras(data) {
        // check for errors
        if (!data.initial || Object.keys(data).length < 2) {
            console.error(
                "Error in MyParser.defineCameras: unexpected or missing definitions"
            );
            return;
        }

        // define cameras
        for (let key in data) {
            if (key === "initial") continue;
            if (data[key].type === "perspective") {
                const position = [
                    data[key].location.x,
                    data[key].location.y,
                    data[key].location.z,
                ];
                const target = [
                    data[key].target.x,
                    data[key].target.y,
                    data[key].target.z,
                ];
                const angle = data[key].angle;
                const near = data[key].near;
                const far = data[key].far;
                if (
                    [...position, ...target, angle, near, far].some(
                        (val) => val === undefined || typeof val !== "number"
                    )
                ) {
                    console.error(
                        "Error in MyParser.defineCameras: invalid or undefined values in camera " +
                            key
                    );
                    return;
                }
                const objectCamera = new THREE.PerspectiveCamera(
                    angle,
                    window.innerWidth / window.innerHeight,
                    near,
                    far
                );
                objectCamera.position.set(...position);
                objectCamera.lookAt(...target);
                this.dataCameras[key] = objectCamera;
                continue;
            }
            if (data[key].type === "orthogonal") {
                const position = [
                    data[key].location.x,
                    data[key].location.y,
                    data[key].location.z,
                ];
                const target = [
                    data[key].target.x,
                    data[key].target.y,
                    data[key].target.z,
                ];
                const near = data[key].near;
                const far = data[key].far;
                const left = data[key].left;
                const right = data[key].right;
                const bottom = data[key].bottom;
                const top = data[key].top;
                if (
                    [
                        ...position,
                        ...target,
                        near,
                        far,
                        left,
                        right,
                        bottom,
                        top,
                    ].some(
                        (val) => val === undefined || typeof val !== "number"
                    )
                ) {
                    console.error(
                        "Error in MyParser.defineCameras: invalid or undefined values in camera " +
                            key
                    );
                    return;
                }
                const objectCamera = new THREE.OrthographicCamera(
                    left,
                    right,
                    top,
                    bottom,
                    near,
                    far
                );
                objectCamera.position.set(...position);
                objectCamera.lookAt(...target);
                this.dataCameras[key] = objectCamera;
                continue;
            } else {
                console.error(
                    "Error in MyParser.defineCameras : type not known"
                );
                return;
            }
        }
    }

    defineTrack(data) {
        let pointsList = [];
        for (let i = 0; i < data.points.length; i++) {
            let x = data.points[i].x;
            let y = data.points[i].y;
            let z = data.points[i].z;
            pointsList.push(new THREE.Vector3(x, y, z));
        }
        this.track = new MyTrack(this.app, pointsList);
    }

    defineRoutes(data) {
        Object.entries(data).forEach(([key, value]) => {
            let pointsList = [];
            for (let j = 0; j < value.points.length; j++) {
                let x = value.points[j].x;
                let y = value.points[j].y;
                let z = value.points[j].z;
                pointsList.push(new THREE.Vector3(x, y, z));
            }
            const route = new MyRoute(pointsList);
            route.name = key;
            this.routes.push(route);
        });
    }

    definePowerUp(data) {
        for (let i = 0; i < data.points.length; i++) {
            let x = data.points[i].x;
            let y = data.points[i].y;
            let z = data.points[i].z;
            const power = new MyPowerUp();
            power.position.set(x, y, z);
            this.powerUps.push(power);
        }
    }

    definePowerDown(data) {
        for (let i = 0; i < data.points.length; i++) {
            let x = data.points[i].x;
            let y = data.points[i].y;
            let z = data.points[i].z;
            const power = new MyObstacle();
            power.position.set(x, y, z);
            this.powerDowns.push(power);
        }
    }

    defineParkPlayer(data) {
        if (!data.ballons) {
            console.error(
                "Error in MyParser.defineParkPlayer : component ballons is undefined"
            );
        }
        for (const i in data.ballons) {
            let color = data.ballons[i].color;
            color = new THREE.Color().setRGB(color.r, color.g, color.b);
            this.parkPlayer.push({ color: color });
        }
    }

    defineParkOponent(data) {
        if (!data.ballons) {
            console.error(
                "Error in MyParser.defineParkOponent : component ballons is undefined"
            );
        }
        for (const i in data.ballons) {
            // define color
            let color = data.ballons[i].color;
            color = new THREE.Color().setRGB(color.r, color.g, color.b);

            // define velocity
            let velocity = data.ballons[i].velocity
                ? data.ballons[i].velocity
                : null;

            // define route
            let route = [];

            for (const j in data.ballons[i].route) {
                const x = data.ballons[i].route[j].x;
                const y = data.ballons[i].route[j].y;
                const z = data.ballons[i].route[j].z;

                //const x = -data.ballons[i].route[j].x * 5;
                //const y = data.ballons[i].route[j].y * 5;
                //const z = data.ballons[i].route[j].z * 5;

                route.push(new THREE.Vector3(x, y, z));
            }

            this.parkOponent.push({
                color: color,
                velocity: velocity,
                route: route,
            });
        }
    }

    /**
     * Creates all textures
     */
    async getAllTextures() {
        for (let key in this.data.yasf.textures)
            await this.getTexture(key, this.data.yasf.textures[key]);
    }

    /**
     *
     * Creates video texture and saves it in dataTextures
     *
     * @param {String} name name of texture
     * @param {Object} data object corresponding to the texture block
     * @returns
     */
    getVideoTexture(name, data) {
        const video = document.createElement("video");
        video.style.display = "none";
        video.id = name;
        video.muted = true;
        video.preload = "auto";
        video.setAttribute("loop", true);
        video.setAttribute("autoplay", true);

        const source = document.createElement("source");
        source.src = data.filepath;
        source.type = "video/mp4";

        video.appendChild(source);
        document.body.appendChild(video);

        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;

        this.dataTextures[name] = texture;
    }

    /**
     *
     * Creates texture and saves it in dataTextures
     *
     * @param {String} name name of texture
     * @param {Object} data object corresponding to the texture block
     * @returns
     */
    async getTexture(name, data) {
        if (!data.filepath) {
            console.error(
                "Error in MyParser.getTexture : component filepath is undefined in texture " +
                    name
            );
            return;
        }
        if (typeof data.filepath !== "string") {
            console.error(
                "Error in MyParser.getTexture : component filepath is not string in texture " +
                    name
            );
            return;
        }

        if (data.isVideo === undefined) {
            console.error(
                "Error in MyParser.getTexture : component isVideo is undefined in texture " +
                    name
            );
            return;
        }

        if (data.isVideo) {
            this.getVideoTexture(name, data);
            return;
        }

        const texture = new THREE.TextureLoader().load(data.filepath);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        if (data["mipmap0"]) {
            texture.generateMipmaps = false;
            for (let i = 0; i < 8; i++) {
                if (!data["mipmap" + i]) break;
                await this.loadMipmap(texture, i, data["mipmap" + i]);
            }
            texture.needsUpdate = true;
            this.dataTextures[name] = texture;
        } else {
            texture.generateMipmaps = true;
            this.dataTextures[name] = texture;
        }
    }

    /**
     *
     * Parse the materials block, saving the information in an dictionary.
     * The key is the name of the material and value is another dictionary.
     * The value's the keys are the attributes, texlength_s, texlength_t, textureref, specularref.
     *
     * @param {String} name name of the material
     * @param {Object} data object corresponding to the material block
     * @returns
     */
    getMaterial(name, data) {
        // check for errors
        if (
            ![
                data.color,
                data.specular,
                data.shininess,
                data.emissive,
                data.transparent,
                data.opacity,
            ].every((value) => value !== undefined)
        ) {
            console.error(
                "Error in MyParser.getMaterial : missing attributes in material " +
                    name
            );
            return;
        }

        // define attributes
        let attributes = {};
        const color = [data.color.r, data.color.g, data.color.b];
        const specular = [data.specular.r, data.specular.g, data.specular.b];
        const emissive = [data.emissive.r, data.emissive.g, data.emissive.b];

        // check for errors
        if (
            [...color, ...specular, ...emissive].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.getMaterial: invalid or undefined values in material " +
                    name
            );
            return;
        }

        // define attributes
        attributes.color = new THREE.Color().setRGB(...color);
        attributes.specular = new THREE.Color().setRGB(...specular);
        attributes.emissive = new THREE.Color().setRGB(...emissive);
        attributes.transparent = data.transparent;
        attributes.shininess = data.shininess;
        attributes.opacity = data.opacity;
        attributes.wireframe = data.wireframe ? data.wireframe : false;
        attributes.bumpScale = data.bumpscale ? data.bumpscale : 1;
        if (data.shading) {
            if (typeof data.shading !== "boolean") {
                console.error(
                    "Error in MyParser.getMaterial : invalid or undefined values in material " +
                        name
                );
                return;
            }
            attributes.flatShading = true;
        }
        if (data.twosided) {
            if (typeof data.twosided !== "boolean") {
                console.error(
                    "Error in MyParser.getMaterial : invalid or undefined values in material " +
                        name
                );
                return;
            }
            attributes["side"] = THREE.DoubleSide;
        }
        const texlength_s = data.texlength_s ? data.texlength_s : 1;
        const texlength_t = data.texlength_t ? data.texlength_t : 1;
        const textureref = data.textureref ? data.textureref : null;
        const bumpref = data.bumpref ? data.bumpref : null;
        const specularref = data.specularref ? data.specularref : null;
        this.dataMaterials[name] = {
            attributes: attributes,
            texlength_s: texlength_s,
            texlength_t: texlength_t,
            textureref: textureref,
            bumpref: bumpref,
            specularref: specularref,
        };
    }

    /**
     *
     * Creates material for mesh of object of type rectangle, acording with specific texlength_s and texlength_t of the material.
     *
     * @param {Object} material object with the attributes of the material
     * @param {Number} width width of the rectangle
     * @param {Number} height height of the rectangle
     * @returns material of type MeshPhongMaterial
     */
    getMaterialRectangle(material, width, height) {
        let material_attributes = material.attributes;
        if (material.textureref && material.textureref !== "null") {
            const texture = this.dataTextures[material.textureref].clone();
            texture.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes.map = texture;
        }
        if (material.bumpref && material.bumpref !== "null") {
            const texture = this.dataTextures[material.bumpref].clone();
            texture.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes.bumpMap = texture;
        }
        if (material.specularref && material.specularref !== "null") {
            const texture = this.dataTextures[material.specularref].clone();
            texture.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes.specularMap = texture;
        }
        return new THREE.MeshPhongMaterial(material_attributes);
    }

    /**
     *
     * Creates material for mesh of object of type box, acording with specific texlength_s and texlength_t of the material.
     *
     * @param {Object} material object with the attributes of the material
     * @param {Number} width width of the box
     * @param {Number} height height of the box
     * @param {Number} depth depth of the box
     * @returns material of type MeshPhongMaterial
     */
    getMaterialBox(material, width, height, depth) {
        let material_attributes_x = material.attributes;
        let material_attributes_y = material.attributes;
        let material_attributes_z = material.attributes;
        if (material.textureref && material.textureref !== "null") {
            const texture_x = this.dataTextures[material.textureref].clone();
            const texture_y = this.dataTextures[material.textureref].clone();
            const texture_z = this.dataTextures[material.textureref].clone();
            texture_x.repeat.set(
                depth / material.texlength_s,
                height / material.texlength_t
            );
            texture_y.repeat.set(
                width / material.texlength_s,
                depth / material.texlength_t
            );
            texture_z.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_x.map = texture_x;
            material_attributes_y.map = texture_y;
            material_attributes_z.map = texture_z;
        }
        if (material.bumpref && material.bumpref !== "null") {
            const texture_x = this.dataTextures[material.bumpref].clone();
            const texture_y = this.dataTextures[material.bumpref].clone();
            const texture_z = this.dataTextures[material.bumpref].clone();
            texture_x.repeat.set(
                depth / material.texlength_s,
                height / material.texlength_t
            );
            texture_y.repeat.set(
                width / material.texlength_s,
                depth / material.texlength_t
            );
            texture_z.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_x.bumpMap = texture_x;
            material_attributes_y.bumpMap = texture_y;
            material_attributes_z.bumpMap = texture_z;
        }
        if (material.specularref && material.specularref !== "null") {
            const texture_x = this.dataTextures[material.specularref].clone();
            const texture_y = this.dataTextures[material.specularref].clone();
            const texture_z = this.dataTextures[material.specularref].clone();
            texture_x.repeat.set(
                depth / material.texlength_s,
                height / material.texlength_t
            );
            texture_y.repeat.set(
                width / material.texlength_s,
                depth / material.texlength_t
            );
            texture_z.repeat.set(
                width / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_x.specularMap = texture_x;
            material_attributes_y.specularMap = texture_y;
            material_attributes_z.specularMap = texture_z;
        }
        const material_mesh_x = new THREE.MeshPhongMaterial(
            material_attributes_x
        );
        const material_mesh_y = new THREE.MeshPhongMaterial(
            material_attributes_y
        );
        const material_mesh_z = new THREE.MeshPhongMaterial(
            material_attributes_z
        );
        return [
            material_mesh_x,
            material_mesh_x,
            material_mesh_y,
            material_mesh_y,
            material_mesh_z,
            material_mesh_z,
        ];
    }

    /**
     *
     * Creates material for mesh of object of type cylinder, acording with specific texlength_s and texlength_t of the material.
     *
     * @param {Object} material object with the attributes of the material
     * @param {Number} base radius of the base of the cylinder
     * @param {Number} top radius of the top base of the cylinder
     * @param {Number} height height of the cylinder
     * @returns material of type MeshPhongMaterial
     */
    getMaterialCylinder(material, base, top, height) {
        let material_attributes_base = material.attributes;
        let material_attributes_top = material.attributes;
        let material_attributes_height = material.attributes;
        const radius_origin = base + (top - base) / 2;
        if (material.textureref && material.textureref !== "null") {
            const texture_base = this.dataTextures[material.textureref].clone();
            const texture_top = this.dataTextures[material.textureref].clone();
            const texture_height =
                this.dataTextures[material.textureref].clone();
            texture_base.repeat.set(
                (base * 2) / material.texlength_s,
                (base * 2) / material.texlength_t
            );
            texture_top.repeat.set(
                (top * 2) / material.texlength_s,
                (top * 2) / material.texlength_t
            );
            texture_height.repeat.set(
                (2 * Math.PI * radius_origin) / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_base.map = texture_base;
            material_attributes_top.map = texture_top;
            material_attributes_height.map = texture_height;
        }
        if (material.bumpref && material.bumpref !== "null") {
            const texture_base = this.dataTextures[material.bumpref].clone();
            const texture_top = this.dataTextures[material.bumpref].clone();
            const texture_height = this.dataTextures[material.bumpref].clone();
            texture_base.repeat.set(
                (base * 2) / material.texlength_s,
                (base * 2) / material.texlength_t
            );
            texture_top.repeat.set(
                (top * 2) / material.texlength_s,
                (top * 2) / material.texlength_t
            );
            texture_height.repeat.set(
                (2 * Math.PI * radius_origin) / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_base.bumpMap = texture_base;
            material_attributes_top.bumpMap = texture_top;
            material_attributes_height.bumpMap = texture_base;
        }
        if (material.specularref && material.specularref !== "null") {
            const texture_base =
                this.dataTextures[material.specularref].clone();
            const texture_top = this.dataTextures[material.specularref].clone();
            const texture_height =
                this.dataTextures[material.specularref].clone();
            texture_base.repeat.set(
                (base * 2) / material.texlength_s,
                (base * 2) / material.texlength_t
            );
            texture_top.repeat.set(
                (top * 2) / material.texlength_s,
                (top * 2) / material.texlength_t
            );
            texture_height.repeat.set(
                (2 * Math.PI * radius_origin) / material.texlength_s,
                height / material.texlength_t
            );
            material_attributes_base.specularMap = texture_base;
            material_attributes_top.specularMap = texture_top;
            material_attributes_height.specularMap = texture_height;
        }
        const material_mesh_base = new THREE.MeshPhongMaterial(
            material_attributes_base
        );
        const material_mesh_top = new THREE.MeshPhongMaterial(
            material_attributes_top
        );
        const material_mesh_height = new THREE.MeshPhongMaterial(
            material_attributes_height
        );
        return [material_mesh_height, material_mesh_top, material_mesh_base];
    }

    /**
     *
     * Creates material for mesh of object of type sphere, acording with specific texlength_s and texlength_t of the material.
     *
     * @param {Object} material object with the attributes of the material
     * @param {Number} radius radius of the sphere
     * @returns material of type MeshPhongMaterial
     */
    getMaterialSphere(material, radius) {
        let material_attributes = material.attributes;
        if (material.textureref && material.textureref !== "null") {
            const texture = this.dataTextures[material.textureref].clone();
            texture.repeat.set(
                (radius * 2) / material.texlength_s,
                (radius * 2) / material.texlength_t
            );
            material_attributes.map = texture;
        }
        if (material.bumpref && material.bumpref !== "null") {
            const texture = this.dataTextures[material.bumpref].clone();
            texture.repeat.set(
                (radius * 2) / material.texlength_s,
                (radius * 2) / material.texlength_t
            );
            material_attributes.bumpMap = texture;
        }
        if (material.specularref && material.specularref !== "null") {
            const texture = this.dataTextures[material.specularref].clone();
            texture.repeat.set(
                (radius * 2) / material.texlength_s,
                (radius * 2) / material.texlength_t
            );
            material_attributes.specularMap = texture;
        }
        return new THREE.MeshPhongMaterial(material_attributes);
    }

    /**
     *
     * Creates a light of type PointLight.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @returns object of type PointLight or nothing if error
     */
    parsePointlight(prim) {
        // check for errors
        if (
            ![prim.color, prim.position].every((value) => value !== undefined)
        ) {
            console.error(
                "Error in MyParser.parsePointlight : missing attributes"
            );
            return;
        }

        // define attributes
        const enabled = prim.enabled ? prim.enabled : true;
        const position = [prim.position.x, prim.position.y, prim.position.z];
        const color = [prim.color.r, prim.color.g, prim.color.b];
        const intensity = prim.intensity ? prim.intensity : 1;
        const distance = prim.distance ? prim.distance : 2000;
        const decay = prim.decay ? prim.decay : 2;
        const shadowfar = prim.shadowfar ? prim.shadowfar : 500;
        const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512;
        const castshadow = prim.castshadow ? prim.castshadow : false;
        if (
            [
                ...position,
                ...color,
                intensity,
                distance,
                decay,
                shadowfar,
                shadowmapsize,
            ].some((val) => val === undefined || typeof val !== "number")
        ) {
            console.error(
                "Error in MyParser.parsePointlight: invalid or undefined values"
            );
            return;
        }

        // construct light
        const light = new THREE.PointLight(
            new THREE.Color().setRGB(...color),
            intensity,
            distance,
            decay
        );
        light.position.set(...position);
        light.castShadow = castshadow;
        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowmapsize;
        light.shadow.mapSize.height = shadowmapsize;
        light.visible = enabled;
        this.dataLights.push(light);
        return light;
    }

    /**
     *
     * Creates a light of type SpotLight.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @returns object of type SpotLight or nothing if error
     */
    parseSpotlight(prim) {
        // check for errors
        if (
            ![prim.color, prim.angle, prim.position, prim.target].every(
                (value) => value !== undefined
            )
        ) {
            console.error(
                "Error in MyParser.parseSpotlight : missing attributes"
            );
            return;
        }

        const enabled = prim.enabled ? prim.enabled : true;

        // define attributes
        const position = [prim.position.x, prim.position.y, prim.position.z];
        const target = [prim.target.x, prim.target.y, prim.target.z];
        const color = [prim.color.r, prim.color.g, prim.color.b];
        const intensity = prim.intensity ? prim.intensity : 1;
        const distance = prim.distance ? prim.distance : 2000;
        const angle = (prim.angle * Math.PI) / 180;
        const decay = prim.decay ? prim.decay : 2;
        const penumbra = prim.penumbra ? prim.penumbra : 1;
        const shadowfar = prim.shadowfar ? prim.shadowfar : 500;
        const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512;
        const castshadow = prim.castshadow ? prim.castshadow : false;
        const all = [
            ...position,
            ...target,
            ...color,
            intensity,
            distance,
            angle,
            decay,
            penumbra,
            shadowfar,
            shadowmapsize,
        ];
        if (all.some((val) => val === undefined || typeof val !== "number")) {
            console.error(
                "Error in MyParser.parseSpotlight: invalid or undefined values"
            );
            return;
        }

        // construct light
        const light = new THREE.SpotLight(
            new THREE.Color().setRGB(...color),
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );
        light.position.set(...position);
        light.target.position.set(...target);
        light.castShadow = castshadow;
        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowmapsize;
        light.shadow.mapSize.height = shadowmapsize;
        light.visible = enabled;
        this.dataLights.push(light);
        return light;
    }

    /**
     *
     * Creates a light of type DirectionalLight.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @returns object of type DirectionalLight or nothing if error
     */
    parseDirectionalLight(prim) {
        // check for errors
        if (
            ![prim.color, prim.position].every((value) => value !== undefined)
        ) {
            console.error(
                "Error in MyParser.parseDirectionalLight : missing attributes"
            );
            return;
        }

        const enabled = prim.enabled ? prim.enabled : true;
        // define attributes
        const position = [prim.position.x, prim.position.y, prim.position.z];
        const color = [prim.color.r, prim.color.g, prim.color.b];
        const intensity = prim.intensity ? prim.intensity : 1;
        const shadowleft = prim.shadowleft ? prim.shadowleft : -5;
        const shadowright = prim.shadowright ? prim.shadowright : 5;
        const shadowbottom = prim.shadowbottom ? prim.shadowbottom : -5;
        const shadowtop = prim.shadowtop ? prim.shadowtop : 5;
        const shadowfar = prim.shadowfar ? prim.shadowfar : 500;
        const shadowmapsize = prim.shadowmapsize ? prim.shadowmapsize : 512;
        const castshadow = prim.castshadow ? prim.castshadow : false;
        const all = [
            ...position,
            ...color,
            intensity,
            shadowleft,
            shadowright,
            shadowbottom,
            shadowtop,
            shadowfar,
            shadowmapsize,
        ];
        if (all.some((val) => val === undefined || typeof val !== "number")) {
            console.error(
                "Error in MyParser.parseSpotlight: invalid or undefined values"
            );
            return;
        }

        // construct light
        const light = new THREE.DirectionalLight(
            new THREE.Color().setRGB(...color),
            intensity
        );
        light.position.set(...position);
        light.castShadow = castshadow;
        light.shadow.camera.left = shadowleft;
        light.shadow.camera.right = shadowright;
        light.shadow.camera.top = shadowtop;
        light.shadow.camera.bottom = shadowbottom;
        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowmapsize;
        light.shadow.mapSize.height = shadowmapsize;

        this.dataLights.push(light);
        return light;
    }

    /**
     *
     * Creates a mesh with an object of type rectangle.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type PlaneGeometry or nothing if error
     */
    parseRectangle(prim, material) {
        // check for errors
        if (material === null) {
            console.error(
                "Error in MyParser.parseRectangle: undefined material"
            );
            return;
        }
        if (![prim.xy1, prim.xy2].every((value) => value !== undefined)) {
            console.error(
                "Error in MyParser.parseRectangle : missing attributes"
            );
            return;
        }
        if (
            [prim.xy1.x, prim.xy1.y, prim.xy2.x, prim.xy2.y].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.parseRectangle: invalid or undefined values"
            );
            return;
        }

        // define attributes
        const width = Math.abs(prim.xy2.x - prim.xy1.x);
        const height = Math.abs(prim.xy2.y - prim.xy1.y);
        const parts_x = prim.parts_x ? prim.parts_x : 1;
        const parts_y = prim.parts_y ? prim.parts_y : 1;

        // construct object and mesh
        const object = new THREE.PlaneGeometry(width, height, parts_x, parts_y);
        const mesh = new THREE.Mesh(
            object,
            this.getMaterialRectangle(material, width, height)
        );
        mesh.position.set(
            (prim.xy1.x + prim.xy2.x) / 2,
            (prim.xy1.y + prim.xy2.y) / 2,
            0
        );
        return mesh;
    }

    /**
     *
     * Creates a mesh with an object of type triangle.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type Triangle or nothing if error
     */
    parseTriangle(prim, material) {
        // check for errors
        if (material === null) {
            console.error(
                "Error in MyParser.parseTriangle: undefined material"
            );
            return;
        }
        if (
            ![prim.xyz1, prim.xyz2, prim.xyz3].every(
                (value) => value !== undefined
            )
        ) {
            console.error(
                "Error in MyParser.parseTriangle : missing attributes"
            );
            return;
        }

        // define attributes
        const position1 = [prim.xyz1.x, prim.xyz1.y, prim.xyz1.z];
        const position2 = [prim.xyz2.x, prim.xyz2.y, prim.xyz2.z];
        const position3 = [prim.xyz3.x, prim.xyz3.y, prim.xyz3.z];
        if (
            [...position1, ...position2, ...position3].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.parseTriangle: invalid or undefined values"
            );
            return;
        }

        // construct object and mesh
        const material_attributes = material.attributes;
        if (material.textureref && material.textureref !== "null")
            material_attributes.map =
                this.dataTextures[material.textureref].clone();
        if (material.bumpref && material.bumpref !== "null")
            material_attributes.bumpMap =
                this.dataTextures[material.bumpref].clone();
        if (material.specularMap && material.specularref !== "null")
            material_attributes.specularMap =
                this.dataTextures[material.specularref].clone();

        const object_material = new THREE.MeshPhongMaterial(
            material_attributes
        );
        const object = new MyTriangle(
            ...position1,
            ...position2,
            ...position3,
            material.texlength_s,
            material.texlength_t
        );
        const mesh = new THREE.Mesh(object, object_material);
        //mesh.position.set((prim.xyz1.x + prim.xyz2.x + prim.xyz3.x) / 3, (prim.xyz1.y + prim.xyz2.y + prim.xyz3.y) / 3, 0)
        return mesh;
    }

    /**
     *
     * Creates a mesh with an object of type box.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type BoxGeometry or nothing if error
     */
    parseBox(prim, material) {
        // check for errors
        if (material === null) {
            console.error("Error in MyParser.parseBox: undefined material");
            return;
        }
        if (![prim.xyz1, prim.xyz2].every((value) => value !== undefined)) {
            console.error("Error in MyParser.parseBox : missing attributes");
            return;
        }
        if (
            [
                prim.xyz1.x,
                prim.xyz1.y,
                prim.xyz1.z,
                prim.xyz2.x,
                prim.xyz2.y,
                prim.xyz2.z,
            ].some((val) => val === undefined || typeof val !== "number")
        ) {
            console.error(
                "Error in MyParser.parseBox: invalid or undefined values"
            );
            return;
        }

        // define attributes
        const width = Math.abs(prim.xyz2.x - prim.xyz1.x);
        const height = Math.abs(prim.xyz2.y - prim.xyz1.y);
        const depth = Math.abs(prim.xyz2.z - prim.xyz1.z);
        const parts_x = prim.parts_x ? prim.parts_x : 1;
        const parts_y = prim.parts_y ? prim.parts_y : 1;
        const parts_z = prim.parts_z ? prim.parts_z : 1;

        // construct object and mesh
        const object = new THREE.BoxGeometry(
            width,
            height,
            depth,
            parts_x,
            parts_y,
            parts_z
        );
        const mesh = new THREE.Mesh(
            object,
            this.getMaterialBox(material, width, height, depth)
        );
        mesh.position.set(
            (prim.xyz1.x + prim.xyz2.x) / 2,
            (prim.xyz1.y + prim.xyz2.y) / 2,
            (prim.xyz1.z + prim.xyz2.z) / 2
        );
        return mesh;
    }

    /**
     *
     * Creates a mesh with an object of type cylinder.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type CylinderGeometry or nothing if error
     */
    parseCylinder(prim, material) {
        // check for errors
        if (material === null) {
            console.error(
                "Error in MyParser.parseCylinder: undefined material"
            );
            return;
        }
        if (
            ![prim.base, prim.top, prim.height, prim.slices, prim.stacks].every(
                (value) => value !== undefined
            )
        ) {
            console.error(
                "Error in MyParser.parseCylinder : missing attributes"
            );
            return;
        }

        // define attributes
        const thetastart = prim.thetastart
            ? (prim.thetastart * Math.PI) / 180
            : 0;
        const thetalength = prim.thetalength
            ? (prim.thetalength * Math.PI) / 180
            : 2 * Math.PI;
        const capsclose = prim.capsclose ? prim.capsclose : false;
        if (
            [thetastart, thetalength].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.parseCylinder: invalid or undefined values"
            );
            return;
        }

        // construct object and mesh
        const object = new THREE.CylinderGeometry(
            prim.top,
            prim.base,
            prim.height,
            prim.slices,
            prim.stacks,
            !capsclose,
            thetastart,
            thetalength
        );
        return new THREE.Mesh(
            object,
            this.getMaterialCylinder(material, prim.base, prim.top, prim.height)
        );
    }

    /**
     *
     * Creates a mesh with an object of type sphere.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type SphereGeometry or nothing if error
     */
    parseSphere(prim, material) {
        // check for errors
        if (material === null) {
            console.error("Error in MyParser.parseSphere: undefined material");
            return;
        }
        if (
            ![prim.radius, prim.slices, prim.stacks].every(
                (value) => value !== undefined
            )
        ) {
            console.error("Error in MyParser.parseSphere : missing attributes");
            return;
        }

        // define attributes
        const thetastart = prim.thetastart
            ? (prim.thetastart * Math.PI) / 180
            : 0;
        const thetalength = prim.thetalength
            ? (prim.thetalength * Math.PI) / 180
            : Math.PI;
        const phistart = prim.phistart ? (prim.phistart * Math.PI) / 180 : 0;
        const philength = prim.philength
            ? (prim.philength * Math.PI) / 180
            : 2 * Math.PI;
        if (
            [thetastart, thetalength, phistart, philength].some(
                (val) => val === undefined || typeof val !== "number"
            )
        ) {
            console.error(
                "Error in MyParser.parseSphere: invalid or undefined values"
            );
            return;
        }

        // construct object and mesh
        const object = new THREE.SphereGeometry(
            prim.radius,
            prim.slices,
            prim.stacks,
            phistart,
            philength,
            thetastart,
            thetalength
        );
        return new THREE.Mesh(
            object,
            this.getMaterialSphere(material, prim.radius)
        );
    }

    /**
     *
     * Get length_s and length_t proximate nurbs to a rectangle.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @returns pair(length_s, length_t)
     */
    getDistanceNurb(prim) {
        const lenghtRow = prim.degree_v + 1;
        const nPoints = prim.controlpoints.length;
        const firstRowfirstPoint = new THREE.Vector3(
            prim.controlpoints[0].x,
            prim.controlpoints[0].y,
            prim.controlpoints[0].z
        );
        const firstRowlastPoint = new THREE.Vector3(
            prim.controlpoints[lenghtRow - 1].x,
            prim.controlpoints[lenghtRow - 1].y,
            prim.controlpoints[lenghtRow - 1].z
        );
        const LastRowLastPoint = new THREE.Vector3(
            prim.controlpoints[nPoints - 1].x,
            prim.controlpoints[nPoints - 1].y,
            prim.controlpoints[nPoints - 1].z
        );

        const length_t = firstRowfirstPoint.distanceTo(firstRowlastPoint);
        const length_s = firstRowlastPoint.distanceTo(LastRowLastPoint);

        return [length_s, length_t];
    }

    /**
     *
     * Creates a mesh with an object of type nurbs.
     *
     * @param {Object} prim object corresponding to the primitive block
     * @param {object} material object with the attributes of the material
     * @returns object of type Nurbs or nothing if error
     */
    parseNurbs(prim, material) {
        // check for errors
        if (material === null) {
            console.error("Error in MyParser.parseNurbs: undefined material");
            return;
        }
        if (
            ![
                prim.degree_u,
                prim.degree_v,
                prim.parts_u,
                prim.parts_v,
                ...prim.controlpoints,
            ].every((value) => value !== undefined)
        ) {
            console.error("Error in MyParser.parseNurbs : missing attributes");
            return;
        }
        if (
            ![prim.degree_u, prim.degree_v, prim.parts_u, prim.parts_v].every(
                (value) => value > 0
            )
        ) {
            console.error(
                "Error in MyParser.parseNurbs : attributes are not positives"
            );
            return;
        }
        if (
            prim.controlpoints.length !==
            (prim.degree_u + 1) * (prim.degree_v + 1)
        ) {
            console.error(
                "Error in MyParser.parseNurbs : number of controlpoints are incorrect"
            );
            return;
        }

        // construct object and mesh
        let points = [];
        let row = [];
        for (let i = 0; i < prim.controlpoints.length; i++) {
            let x = prim.controlpoints[i].x;
            let y = prim.controlpoints[i].y;
            let z = prim.controlpoints[i].z;
            let positions = [x, y, z];
            if (
                positions.some(
                    (val) => val === undefined || typeof val !== "number"
                )
            ) {
                console.error(
                    "Error in MyParser.parseNurbs: invalid or undefined values in points coordinates"
                );
                return;
            }
            row.push([x, y, z, 1]);
            if ((i + 1) % (prim.degree_v + 1) === 0) {
                points.push(row);
                row = [];
            }
        }

        const object = this.buider.build(
            points,
            prim.degree_u,
            prim.degree_v,
            prim.parts_u,
            prim.parts_v,
            null
        );

        const lengths = this.getDistanceNurb(prim);

        const mat = this.getMaterialRectangle(material, lengths[0], lengths[1]);

        return new THREE.Mesh(object, mat);
    }

    /**
     *
     * @param {*} data
     * @param {*} name
     * @param {*} parent_material
     * @param {*} parent_castshadows
     * @param {*} parent_receiveshadows
     * @returns
     */
    parseLod(
        data,
        name,
        parent_material,
        parent_castshadows,
        parent_receiveshadows
    ) {
        const lod = data[name];

        if (lod === undefined) {
            console.error(
                `Error in MyParser.parseLod: lod "${name}" don't exist`
            );
            return;
        }

        if (lod.type !== "lod") {
            console.error(
                `Error in MyParser.parseLod at lod "${name}": invalid or undefined type`
            );
            return;
        }
        const lodNodes = lod.lodNodes;
        if (lodNodes.length <= 1) {
            console.error(
                `Error in MyParser.parseLod at lod "${name}": declare less that one descendents (representations)`
            );
        }

        const lodStruct = new THREE.LOD();

        const distSet = new Set();

        for (let i = 0; i < lodNodes.length; i++) {
            const nodeId = lodNodes[i].nodeId;

            const mindist = lodNodes[i].mindist;

            if (
                mindist === undefined ||
                typeof mindist !== "number" ||
                distSet.has(mindist)
            ) {
                console.error(
                    `Error in MyParser.parseLod at lod "${name}": invalid, undefined or repeted mindist values`
                );
                return;
            }
            const node = this.parse(
                data,
                nodeId,
                parent_material,
                parent_castshadows,
                parent_receiveshadows
            );

            if (node === undefined) return;

            lodStruct.addLevel(node, mindist);

            distSet.add(mindist);
        }
        return lodStruct;
    }

    /**
     *
     * Creates a mesh with an object of type polygon.
     *
     * @param {*} prim object corresponding to the primitive block
     * @param {*} material object with the attributes of the material
     * @returns object of type BufferGeometry or nothing if error
     */
    parsePolygon(prim, material) {
        // Check for errors
        if (
            ![
                prim.radius,
                prim.stacks,
                prim.slices,
                prim.color_c,
                prim.color_p,
            ].every((value) => value !== undefined)
        ) {
            console.error("Error in MyParser.parsePolygon: missing attributes");
            return;
        }

        let vertices = [];
        let indices = [];
        let normals = [];
        let colors = [];

        // Add center vertex
        vertices.push(0, 0, 0);
        normals.push(0, 0, 1);
        colors.push(prim.color_c.r, prim.color_c.g, prim.color_c.b);

        let angleInterval = (2 * Math.PI) / prim.slices;
        let radiusInterval = prim.radius / prim.stacks;

        const color_c = new THREE.Color().setRGB(
            prim.color_c.r,
            prim.color_c.g,
            prim.color_c.b
        );
        const color_p = new THREE.Color().setRGB(
            prim.color_p.r,
            prim.color_p.g,
            prim.color_p.b
        );

        // Create vertices
        for (let i = 0; i <= prim.slices; i++) {
            let angle = i * angleInterval;
            for (let j = 1; j <= prim.stacks; j++) {
                let radius = j * radiusInterval;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                vertices.push(x, y, 0);
                normals.push(0, 0, 1);
                const color = new THREE.Color().lerpColors(
                    color_c,
                    color_p,
                    j / prim.stacks
                );
                colors.push(color.r, color.g, color.b);
            }
        }

        // triangles in the center
        for (let i = 0; i < prim.slices; i++) {
            const vertice1Index = 1 + i * prim.stacks;
            const vertice2Index = 1 + ((i + 1) % prim.slices) * prim.stacks;
            indices.push(0, vertice1Index, vertice2Index);
        }

        // triangles between stacks
        for (let i = 0; i < prim.slices; i++) {
            for (let j = 0; j < prim.stacks - 1; j++) {
                const current = 1 + i * prim.stacks + j;
                const next = 1 + ((i + 1) % prim.slices) * prim.stacks + j;
                indices.push(current, current + 1, next + 1);
                indices.push(current, next + 1, next);
            }
        }

        const material_polygon = new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute(
            "normal",
            new THREE.Float32BufferAttribute(normals, 3)
        );
        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        );
        geometry.setIndex(indices);
        const mesh = new THREE.Mesh(geometry, material_polygon);

        return mesh;
    }

    /**
     *
     * Parse the tree nodes, creating a "graph" composed of groups of nodes.
     *
     * @param {Object} data object corresponding to the graph block
     * @param {String} name name of the node
     * @param {Object} material object with the attributes of the material
     * @param {Boolean} castshadows true if object casts shadows and false if not
     * @param {Boolean} receiveshadows true if object receives shadows and false if not
     * @returns
     */
    parse(data, name, material, castshadows, receiveshadows) {
        // variables
        const parent = data[name];
        const parent_material = parent.materialref
            ? this.dataMaterials[parent.materialref.materialId]
            : material;

        const parent_castshadows = parent.castshadows
            ? parent.castshadows
            : castshadows;
        const parent_receiveshadows = parent.receiveshadows
            ? parent.receiveshadows
            : receiveshadows;
        const list_children = data[name].children ? data[name].children : {};

        // check for errors
        if (parent.type !== "node") {
            console.error(
                "Error in MyParser.parse: invalid or undefined parent type in node " +
                    name
            );
            return;
        }
        if (name !== name.toLowerCase()) {
            console.error(
                "Error in MyParser.parse: node name is not in lowercase in node " +
                    name
            );
            return;
        }

        // parse tree
        let group = new THREE.Group();

        // if node was already parsed
        if (this.dataNodes[name]) {
            this.dataNodes[name].updateMatrix();
            group = this.dataNodes[name].clone();
            group.matrix = this.dataNodes[name].matrix.clone();
            group.matrixAutoUpdate = false;
            group.name = name;
            group.children.forEach((child) => {
                this.changeMaterialShadows(
                    data,
                    child,
                    parent_material,
                    parent_castshadows,
                    parent_receiveshadows
                );
            });
        }

        // if node was not parsed
        else {
            for (let i = 0; i < Object.keys(list_children).length; i++) {
                const child_name = Object.keys(list_children)[i];
                const child_node = parent["children"][child_name];
                const child_material = parent_material
                    ? parent_material
                    : new THREE.MeshPhongMaterial({
                          color: "#ffffff",
                          specular: "#ffffff",
                      });

                // if node is of a list of nodes
                if (child_name === "nodesList") {
                    for (const node of child_node) {
                        const group_node = this.parse(
                            data,
                            node,
                            parent_material,
                            parent_castshadows,
                            parent_receiveshadows
                        );
                        group_node.name = node;
                        group.add(group_node);
                    }
                    continue;
                }

                // if node is of a list of lods
                if (child_name === "lodsList") {
                    for (const lod of child_node) {
                        const group_lod = this.parseLod(
                            data,
                            lod,
                            parent_material,
                            parent_castshadows,
                            parent_receiveshadows
                        );
                        group_lod.name = lod;
                        group.add(group_lod);
                    }
                    continue;
                }

                // if node is of type light
                if (child_node.type === "pointlight") {
                    const light = this.parsePointlight(child_node);
                    light.name = child_name;
                    group.add(light);
                    continue;
                }
                if (child_node.type === "spotlight") {
                    const light = this.parseSpotlight(child_node);
                    light.name = child_name;
                    group.add(light);
                    continue;
                }
                if (child_node.type === "directionallight") {
                    const light = this.parseDirectionalLight(child_node);
                    light.name = child_name;
                    group.add(light);
                    continue;
                }
                // if node is a primitive
                let mesh = null;
                if (child_node.type === "rectangle")
                    mesh = this.parseRectangle(child_node, child_material);
                if (child_node.type === "triangle") {
                    mesh = this.parseTriangle(child_node, child_material);
                }
                if (child_node.type === "box")
                    mesh = this.parseBox(child_node, child_material);
                if (child_node.type === "cylinder")
                    mesh = this.parseCylinder(child_node, child_material);
                if (child_node.type === "sphere")
                    mesh = this.parseSphere(child_node, child_material);
                if (child_node.type === "nurbs")
                    mesh = this.parseNurbs(child_node, child_material);
                if (child_node.type === "polygon")
                    mesh = this.parsePolygon(child_node, child_material);
                mesh.name = child_name;
                mesh.castShadow = parent_castshadows;
                mesh.receiveShadow = parent_receiveshadows;
                group.add(mesh);
            }

            group.name = name;
        }

        // apply the transformations
        if (parent.transforms) {
            for (let i = 0; i < parent.transforms.length; i++) {
                const transformation = parent.transforms[i];
                const x = transformation.amount.x;
                const y = transformation.amount.y;
                const z = transformation.amount.z;
                if (
                    [x, y, z].some(
                        (val) => val === undefined || typeof val !== "number"
                    )
                ) {
                    console.error(
                        "Error in MyParser.parse: invalid or undefined values in node " +
                            name
                    );
                    return;
                }
                if (transformation.type === "translate") {
                    group.position.set(x, y, z);
                }
                if (transformation.type === "rotate") {
                    group.rotateX((x * Math.PI) / 180);
                    group.rotateY((y * Math.PI) / 180);
                    group.rotateZ((z * Math.PI) / 180);
                }
                if (transformation.type === "scale") {
                    group.scale.set(x, y, z);
                }
            }
        }
        this.dataNodes[name] = group;
        return group;
    }

    /**
     *
     * Changes the proprieties material, castshadows and receiveshadows of the node.
     * Used after cloning a node, because this proporties may have to change.
     *
     * @param {Object} data object corresponding to the graph block
     * @param {Object} node node that is being changed
     * @param {Object} material object with the attributes of the material
     * @param {Boolean} castshadows true if object casts shadows and false if not
     * @param {Boolean} receiveshadows true if object receives shadows and false if not
     */
    changeMaterialShadows(data, node, material, castshadows, receiveshadows) {
        if (node.isGroup) {
            if (data[node.name]["materialref"]) {
                node.children.forEach((child) => {
                    this.changeShadows(
                        data,
                        child,
                        castshadows,
                        receiveshadows
                    );
                });
            } else {
                node.children.forEach((child) => {
                    this.changeMaterialShadows(
                        data,
                        child,
                        material,
                        castshadows,
                        receiveshadows
                    );
                });
            }
        } else {
            if (node instanceof THREE.Mesh) {
                const parameters = node.geometry.parameters;
                if (node.geometry instanceof THREE.PlaneGeometry)
                    node.material = this.getMaterialRectangle(
                        material,
                        parameters.width,
                        parameters.height
                    );
                if (node.geometry instanceof THREE.BoxGeometry)
                    node.material = this.getMaterialBox(
                        material,
                        parameters.width,
                        parameters.height,
                        parameters.depth
                    );
                if (node.geometry instanceof THREE.CylinderGeometry)
                    node.material = this.getMaterialCylinder(
                        material,
                        parameters.radiusTop,
                        parameters.radiusBottom,
                        parameters.height
                    );
                if (node.geometry instanceof THREE.SphereGeometry)
                    node.material = this.getMaterialSphere(
                        material,
                        parameters.radius
                    );
                if (node.geometry instanceof MyTriangle)
                    node.geometry.update_uv(
                        material.texlength_s,
                        material.texlength_t
                    );
                node.material.needsUpdate = true;
                node.castShadow = castshadows;
                node.receiveshadows = receiveshadows;
            }
            if (node instanceof THREE.SpotLight) this.dataLights.push(node);
            if (node instanceof THREE.PointLight) this.dataLights.push(node);
        }
    }

    /**
     *
     * Changes the proprieties castshadows and receiveshadows of the node.
     * Used after cloning a node, because this proporties may have to change.
     *
     * @param {Object} data object corresponding to the graph block
     * @param {Object} node node that is being changed
     * @param {Boolean} castshadows true if object casts shadows and false if not
     * @param {Boolean} receiveshadows true if object receives shadows and false if not
     */
    changeShadows(data, node, castshadows, receiveshadows) {
        if (node.isGroup) {
            node.children.forEach((child) => {
                this.changeShadows(data, child, castshadows, receiveshadows);
            });
        } else {
            node.castShadow = castshadows;
            node.receiveshadows = receiveshadows;
            if (node instanceof THREE.SpotLight) this.dataLights.push(node);
            if (node instanceof THREE.PointLight) this.dataLights.push(node);
        }
    }

    /**
     * Load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture.
     * 
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
    // * @param {*} size if size not null inscribe the value in the mipmap. null by default
    // * @param {*} color a color to be used for demo
     */
    loadMipmap(parentTexture, level, path) {
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(
                path,
                (mipmapTexture) => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = mipmapTexture.image;
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    parentTexture.mipmaps[level] = canvas;
                    resolve();
                },
                undefined,
                (err) => {
                    console.error(
                        "Unable to load the image " +
                            path +
                            " as mipmap level " +
                            level +
                            ".",
                        err
                    );
                    reject(err);
                }
            );
        });
    }
}

export { MyParser };
