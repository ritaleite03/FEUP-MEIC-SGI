import * as THREE from "three";

class MyBallon extends THREE.Object3D {
    /**
     *
     * @param {*} app
     * @param {*} name
     * @param {*} route
     */
    constructor(app, name, route) {
        // variables
        super();
        this.app = app;
        this.vouchers = 0;
        this.route = route;
        this.shadow = null;

        // materials
        const blue_material = new THREE.MeshLambertMaterial({
            color: "#0000ff",
        });

        // base
        const base = new THREE.BoxGeometry(1, 1, 1);
        const mesh_base = new THREE.Mesh(base, blue_material);
        mesh_base.position.set(0, 0.5, 0);
        mesh_base.name = name;

        // top
        const top = new THREE.SphereGeometry(2);
        const mesh_top = new THREE.Mesh(top, blue_material);
        mesh_top.position.set(0, 3, 0);
        mesh_top.name = name;

        // combine objects
        const group = new THREE.Group();
        group.add(mesh_base);
        group.add(mesh_top);
        group.position.set(0, -1.5, 0);
        this.add(group);
    }

    /**
     * Called to move shadow of the ballon
     */
    moveShadowBallon() {
        if (this.shadow !== null && this.shadow !== undefined) {
            this.app.scene.remove(this.shadow);
        }

        const white_material = new THREE.MeshLambertMaterial({
            color: "#ffffff",
        });
        const geometryS = new THREE.CylinderGeometry(2, 2, 1);
        this.shadow = new THREE.Mesh(geometryS, white_material);
        this.shadow.position.set(this.position.x, 0.5, this.position.z);
        this.app.scene.add(this.shadow);
    }

    /**
     * Called to move the ballon up
     */
    moveUp() {
        this.position.y += 1;
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
        if (posY > 10 && posY <= 20) this.position.z -= 1 * n; // layer 1 - North
        if (posY > 20 && posY <= 30) this.position.z += 1 * s; // layer 2 - South
        if (posY > 30 && posY <= 40) this.position.x += 1 * e; // layer 3 - East
        if (posY > 40 && posY <= 50) this.position.x -= 1 * w; // layer 4 - West
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
        newBallon.route = this.route;
        newBallon.shadow = this.shadow;
        return newBallon;
    }
}

export { MyBallon };
