import * as THREE from 'three';

/**
 * This class contains the representation of the a chair
 */
class MyChair extends THREE.Object3D {

    /**
       @param {MyApp} app The application object
       @param {number} widthBottom width of the chair's bottom
       @param {number} heightBottom heigth of the chair's bottom
       @param {number} widthTop width of the chair's top
       @param {number} heightTop heigth of the chair's top
       @param {number} radiusLegs radius of the chair's leg
       @param {number} heightLegs height of the chair's leg
       @param {number} radiusBack radius of the chair's back
       @param {number} heightBack height of the chair's back
       @param {number} thickness thickness of the wood
    */ 
    constructor(widthBottom, heightBottom, widthTop, heightTop, radiusLegs, heightLegs, radiusBack, heightBack, thickness) {
        super()

        let woodenTexture = new THREE.TextureLoader().load('textures/wooden_top.jpg');
        woodenTexture.wrapS = THREE.MirroredRepeatWrapping;
        woodenTexture.wrapT = THREE.MirroredRepeatWrapping;
        const woodenMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 0, map: woodenTexture})

        const bottom = new THREE.BoxGeometry(widthBottom, heightBottom, thickness);
        const top = new THREE.BoxGeometry(widthTop, heightTop, thickness);

        const leg = new THREE.CylinderGeometry(radiusLegs,radiusLegs,heightLegs)
        const back = new THREE.CylinderGeometry(radiusBack,radiusBack,heightBack)

        const bottomMesh = new THREE.Mesh (bottom, woodenMaterial);
        bottomMesh.rotateX(Math.PI / 2)
        bottomMesh.position.y = heightLegs + thickness / 2;
        this.add(bottomMesh);

        const legMesh1 =  new THREE.Mesh (leg, woodenMaterial);
        legMesh1.position.set(widthBottom / 2 - radiusLegs ,heightLegs / 2, heightBottom / 2 - radiusLegs)
        this.add(legMesh1);

        const legMesh2 =  new THREE.Mesh (leg, woodenMaterial);
        legMesh2.position.set(-widthBottom / 2 + radiusLegs ,heightLegs / 2, heightBottom / 2 - radiusLegs)
        this.add(legMesh2);

        const legMesh3 =  new THREE.Mesh (leg, woodenMaterial);
        legMesh3.position.set(widthBottom / 2 - radiusLegs ,heightLegs / 2, -heightBottom / 2 + radiusLegs)
        this.add(legMesh3);

        const legMesh4 =  new THREE.Mesh (leg, woodenMaterial);
        legMesh4.position.set(-widthBottom / 2 + radiusLegs ,heightLegs / 2, -heightBottom / 2 + radiusLegs)
        this.add(legMesh4);

        const topMesh = new THREE.Mesh (top, woodenMaterial);
        topMesh.position.set(0, heightLegs + thickness + heightBack + heightTop / 2, heightBottom / 2 - thickness / 2);
        this.add(topMesh);

        const backMesh1 =  new THREE.Mesh (back, woodenMaterial);
        backMesh1.position.set(widthBottom / 2 - radiusLegs ,heightLegs + thickness + heightBack / 2, heightBottom / 2 - radiusLegs)
        this.add(backMesh1);

        const backMesh2 =  new THREE.Mesh (leg, woodenMaterial);
        backMesh2.position.set(-widthBottom / 2 + radiusLegs ,heightLegs + thickness + heightBack / 2, heightBottom / 2 - radiusLegs)
        this.add(backMesh2);


    }

}

export { MyChair };