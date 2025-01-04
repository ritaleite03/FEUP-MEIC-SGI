import * as THREE from "three";

class MyBallon extends THREE.Object3D {
    constructor(app, name, color, route) {
        // variables
        super();
        this.app = app;
        this.vouchers = 0;
        this.route = route;
        this.laps = 0;
        this.shadow = null;
        this.color = color;
        this.height = 12;

        if (this.color === undefined) this.color = "#ffffff";

        // materials
        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
        });

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
        this.add(group);

        // bounding box
        const boundingB = new THREE.Box3();
        const center = new THREE.Vector3();
        boundingB.setFromObject(group);
        boundingB.getCenter(center);

        // bounding sphere
        const sizeX = Math.abs(boundingB.max.x) + Math.abs(boundingB.min.x);
        const sizeY = Math.abs(boundingB.max.y) + Math.abs(boundingB.min.y);
        const sizeZ = Math.abs(boundingB.max.z) + Math.abs(boundingB.min.z);
        this.boundingBox = [sizeX, sizeY, sizeZ];
    }

    /**
     * Called to move shadow of the ballon
     */
    moveShadowBallon() {
        if (this.shadow !== null && this.shadow !== undefined) {
            this.app.scene.remove(this.shadow);
        }

        // const white_material = new THREE.MeshBasicMaterial({
        //     color: thicolor,
        // });
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
        // move ballon
        if (posY > 5 && posY <= 10) this.position.z -= 1 * n; // layer 1 - North
        if (posY > 10 && posY <= 15) this.position.z += 1 * s; // layer 2 - South
        if (posY > 15 && posY <= 20) this.position.x += 1 * e; // layer 3 - East
        if (posY > 20 && posY <= 25) this.position.x -= 1 * w; // layer 4 - West
        // move shadow
        this.moveShadowBallon();
    }

    /**
     * Called to clone the ballon with its specific attributes like app, vouchers, route ans shadow
     * @param {boolean} recursive true if descendants are also to be cloned
     * @returns
     */
    clone(recursive = true) {
        const newBallon = super.clone(recursive);
        newBallon.app = this.app;
        newBallon.vouchers = this.vouchers;
        newBallon.laps = this.laps;
        newBallon.route = this.route;
        newBallon.shadow = this.shadow;
        newBallon.height = this.height;
        newBallon.color = this.color;
        newBallon.material.color = this.color;
        return newBallon;
    }
}

export { MyBallon };
