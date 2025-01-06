import * as THREE from "three";

/**
 * This class contains the representation of a ballon
 */
class MyBallon extends THREE.Object3D {
    /**
     *
     * @param {MyApp} app application object
     * @param {String} name name indicating if ballons is from player or oponent
     * @param {String} color color of the ballon
     * @param {Number} velocity velocity of the ballon (only used in the ballons of the oponent)
     * @param {Array<THREE.Vector3>} route list of the positions in the path of the ballon (only used in the ballons of the oponent)
     */
    constructor(app, name, color, velocity, route) {
        // variables
        super();
        this.app = app;
        this.height = 12;
        this.vouchers = 0;
        this.laps = 0;
        this.color = color;
        this.object = null;
        this.billboard = null;

        // variables used in player ballon
        this.shadow = null;
        this.penalty = false;

        // variables used in oponent ballon
        this.velocity = velocity;
        this.route = route;
        this.clock = new THREE.Clock();
        this.mixerTime = 0;
        this.mixerPause = false;

        if (this.color === undefined) this.color = "#ffffff";

        // materials
        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
        });

        this.buildObject(name);
        this.buildBillboard(name);

        this.lod = new THREE.LOD();
        this.lod.addLevel(this.object, 50);
        this.lod.addLevel(this.billboard, 100);
        this.add(this.lod);

        // bounding box
        const boundingB = new THREE.Box3();
        const center = new THREE.Vector3();
        boundingB.setFromObject(this.object);
        boundingB.getCenter(center);

        // bounding sphere
        const sizeX = Math.abs(boundingB.max.x) + Math.abs(boundingB.min.x);
        const sizeY = Math.abs(boundingB.max.y) + Math.abs(boundingB.min.y);
        const sizeZ = Math.abs(boundingB.max.z) + Math.abs(boundingB.min.z);
        this.boundingBox = [sizeX, sizeY, sizeZ];

        // build wind indication
        const materialWind = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const cylinder = new THREE.CylinderGeometry(0.25, 0.25, 1);
        const cylinderMesh = new THREE.Mesh(cylinder, materialWind);
        cylinderMesh.rotateX(Math.PI / 2);
        cylinderMesh.position.set(0, -1, 1);

        const cone = new THREE.ConeGeometry(0.5, 1);
        const coneMesh = new THREE.Mesh(cone, materialWind);
        coneMesh.rotateX(Math.PI / 2);
        coneMesh.position.set(0, -1, 2);

        this.groupSouth = new THREE.Group();
        this.groupSouth.add(cylinderMesh);
        this.groupSouth.add(coneMesh);

        this.groupWest = this.groupSouth.clone();
        this.groupWest.rotateY(-Math.PI / 2);

        this.groupNorth = this.groupWest.clone();
        this.groupNorth.rotateY(-Math.PI / 2);

        this.groupEast = this.groupNorth.clone();
        this.groupEast.rotateY(-Math.PI / 2);

        this.groupWind = this.groupNorth.clone();
    }

    /**
     * Called to build ballon's object
     * @param {String} name name of the ballon
     */
    buildObject(name) {
        // base
        const base = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const mesh_base = new THREE.Mesh(base, this.material);
        mesh_base.position.set(0, 0.25, 0);
        mesh_base.name = name;

        // top
        const top = new THREE.SphereGeometry(2, 20, 20, 0, Math.PI);
        const mesh_top = new THREE.Mesh(top, this.material);
        mesh_top.rotateX(-Math.PI / 2);
        mesh_top.position.set(0, 4, 0);
        mesh_top.name = name;

        const top1 = new THREE.CylinderGeometry(2, 0.5, 3);
        const mesh_top1 = new THREE.Mesh(top1, this.material);
        mesh_top1.position.set(0, 2.5, 0);
        mesh_top1.name = name;

        // link
        const link = new THREE.BoxGeometry(0.05, 0.5, 0.05);

        const mesh_link1 = new THREE.Mesh(link, this.material);
        const mesh_link2 = new THREE.Mesh(link, this.material);
        const mesh_link3 = new THREE.Mesh(link, this.material);
        const mesh_link4 = new THREE.Mesh(link, this.material);

        mesh_link1.position.set(-0.2, 0.75, -0.2);
        mesh_link2.position.set(0.2, 0.75, -0.2);
        mesh_link3.position.set(-0.2, 0.75, 0.2);
        mesh_link4.position.set(0.2, 0.75, 0.2);

        mesh_link1.name = name;
        mesh_link2.name = name;
        mesh_link3.name = name;
        mesh_link4.name = name;

        // combine objects
        const group = new THREE.Group();
        group.add(mesh_base);
        group.add(mesh_top);
        group.add(mesh_top1);
        group.add(mesh_link1);
        group.add(mesh_link2);
        group.add(mesh_link3);
        group.add(mesh_link4);
        group.position.set(0, -1.5, 0);
        group.scale.set(2, 2, 2);

        this.object = group;
    }

    /**
     * Called to build ballon's billboard
     * @param {String} name name of the ballon
     */
    buildBillboard(name) {
        // base plane
        const base = new THREE.PlaneGeometry(0.5, 0.5);
        const mesh_base = new THREE.Mesh(base, this.material);
        mesh_base.position.set(0, 0.25, 0);
        mesh_base.name = name;

        // top plane
        const top = new THREE.CircleGeometry(2, 20);
        const mesh_top = new THREE.Mesh(top, this.material);
        mesh_top.position.set(0, 4, 0);
        mesh_top.name = name;

        const top1 = new THREE.PlaneGeometry(4, 3);
        const mesh_top1 = new THREE.Mesh(top1, this.material);
        mesh_top1.position.set(0, 2.5, 0);
        mesh_top1.name = name;

        // link plane
        const link = new THREE.PlaneGeometry(0.05, 0.5);
        const mesh_link1 = new THREE.Mesh(link, this.material);
        const mesh_link2 = new THREE.Mesh(link, this.material);
        mesh_link1.position.set(-0.2, 0.75, 0);
        mesh_link2.position.set(0.2, 0.75, 0);
        mesh_link1.name = name;
        mesh_link2.name = name;

        // combine objects
        const group = new THREE.Group();
        group.add(mesh_base);
        group.add(mesh_top);
        group.add(mesh_top1);
        group.add(mesh_link1);
        group.add(mesh_link2);

        group.position.set(0, -1.5, 0);
        group.scale.set(2, 2, 2);
        this.billboard = group;
    }

    /**
     * Called to update arrow indicating wind direction
     * @param {String} layer name of the wind layer (it can be north, south, east or west)
     */
    updateWindIndicating(layer) {
        if (this.groupWind !== null && this.groupWind !== undefined) {
            this.remove(this.groupWind);
        }

        if (layer === "north") this.groupWind = this.groupNorth.clone();
        if (layer === "south") this.groupWind = this.groupSouth.clone();
        if (layer === "east") this.groupWind = this.groupEast.clone();
        if (layer === "west") this.groupWind = this.groupWest.clone();

        this.add(this.groupWind);
    }

    /**
     * Called to move shadow of the ballon
     */
    moveShadowBallon() {
        if (this.shadow !== null && this.shadow !== undefined) {
            this.app.scene.remove(this.shadow);
        }

        const geometryS = new THREE.CylinderGeometry(2, 2, 1);
        this.shadow = new THREE.Mesh(geometryS, this.material);
        this.shadow.position.set(this.position.x, 0.5, this.position.z);
        this.app.scene.add(this.shadow);
    }

    /**
     * Called to move the ballon up
     */
    moveUp() {
        this.position.y = this.position.y + 1 <= 25 ? this.position.y + 1 : 25;
    }

    /**
     * Called to move the ballon down
     */
    moveDown() {
        this.position.y = this.position.y - 1 > 0 ? this.position.y - 1 : 0;
    }

    /**
     * Called to move the ballon acording with the wind
     * @param {Number} n strenght of the wind when in direction north
     * @param {Number} s strenght of the wind when in direction south
     * @param {Number} e strenght of the wind when in direction east
     * @param {Number} w strenght of the wind when in direction west
     */
    moveWind(n, s, e, w) {
        const posY = this.position.y;

        // layer 1 - North
        if (posY > 5 && posY <= 10) {
            this.position.z -= 1 * n;
            this.updateWindIndicating("north");
        }
        // layer 2 - South
        if (posY > 10 && posY <= 15) {
            this.position.z += 1 * s;
            this.updateWindIndicating("south");
        }
        // layer 3 - East
        if (posY > 15 && posY <= 20) {
            this.position.x += 1 * e;
            this.updateWindIndicating("east");
        }
        // layer 4 - West
        if (posY > 20 && posY <= 25) {
            this.position.x -= 1 * w;
            this.updateWindIndicating("west");
        }

        // move shadow
        this.moveShadowBallon();
    }

    /**
     * Called to clone the ballon with its specific attributes like app, vouchers, route ans shadow
     * @param {boolean} recursive true if descendants are also to be cloned
     * @returns
     */
    clone(recursive = true) {
        // clone without lod
        const lod = this.lod;
        this.remove(this.lod);
        const newBallon = super.clone(recursive);
        this.add(lod);

        // variables
        newBallon.app = this.app;
        newBallon.vouchers = this.vouchers;
        newBallon.laps = this.laps;
        newBallon.height = this.height;
        newBallon.color = this.color;
        newBallon.material.color = this.color;

        // variables used in player ballon
        newBallon.shadow = this.shadow;

        // variables used in oponent ballon
        newBallon.route = this.route;
        newBallon.velocity = this.velocity;

        return newBallon;
    }

    /**
     * Called to define animation of the oponent ballon because it moves automatic
     */
    defineAnimation() {
        if (this.route !== null && this.route !== undefined) {
            this.spline = new THREE.CatmullRomCurve3(this.route);

            let number = [];
            const inverval = 90 / this.route.length;
            for (let i = 0; i < this.route.length; i ++){
                number.push(i * inverval);
            } 

            const posKeyFrame = new THREE.VectorKeyframeTrack(
                ".position",
                number,
                this.route.flatMap((v) => [v.x, v.y, v.z]),
                THREE.InterpolateSmooth
            );
            const posClip = new THREE.AnimationClip(
                "positionAnimation",
                90,
                [posKeyFrame]
            );

            this.mixer = new THREE.AnimationMixer(this);
            this.positionAction = this.mixer.clipAction(posClip);
        }
    }

    /**
     * Called to move oponent ballon according with the animation
     */
    moveAnimation() {
        // update mixer
        const delta = this.clock.getDelta() * this.velocity;
        this.mixer.update(delta);

        // get actions
        const actions = this.mixer._actions;

        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0];

            //if (
            //    track.name === ".position" &&
            //    this.enableAnimationPosition === false
            //) {
            //    actions[i].stop();
            //} else {

            if (!actions[i].isRunning()) {
                actions[i].play();
            }

            //}
        }
    }
}

export { MyBallon };
