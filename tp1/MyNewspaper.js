import * as THREE from 'three';
import { MyPage } from './MyPage.js';
import { MyApp } from './MyApp.js';

/**
 * This class contains the representation of a newspaper
 */
class MyNewspaper extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} x position in Ox of the newspaper
     * @param {number} y position in Oy of the newspaper
     * @param {number} z position in Oz of the newspaper
     * @param {number} maxArcPage top page's arc
     * @param {number} numberPages number of pages
     */
    constructor(app, x, y, z, maxArcPage, numberPages) {
        super();
        this.type = 'Group';

        const arcInterval = maxArcPage / numberPages
        let arcNow = 0
        for(let i = 0; i < numberPages; i++){
            const page = new MyPage(app, x, y, z, arcNow)
            this.add( page )
            arcNow += arcInterval
        }
    }
}

MyNewspaper.prototype.isGroup = true;

export { MyNewspaper };