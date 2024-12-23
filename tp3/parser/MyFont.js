import * as THREE from "three";

class MyFont {
    /**
     * Constructs the object.
     */
    constructor() {
        this.charMap = {
            // first line
            " ": { x: 0, y: 0 },
            "!": { x: 1, y: 0 },
            '"': { x: 2, y: 0 },
            "#": { x: 3, y: 0 },
            $: { x: 4, y: 0 },
            "%": { x: 5, y: 0 },
            "'": { x: 7, y: 0 },
            "(": { x: 8, y: 0 },
            ")": { x: 9, y: 0 },
            "*": { x: 10, y: 0 },
            "+": { x: 11, y: 0 },
            ",": { x: 12, y: 0 },
            "-": { x: 13, y: 0 },
            ".": { x: 14, y: 0 },

            // second line
            "/": { x: 0, y: 1 },
            0: { x: 1, y: 1 },
            1: { x: 2, y: 1 },
            2: { x: 3, y: 1 },
            3: { x: 4, y: 1 },
            4: { x: 5, y: 1 },
            5: { x: 6, y: 1 },
            6: { x: 7, y: 1 },
            7: { x: 8, y: 1 },
            8: { x: 9, y: 1 },
            9: { x: 10, y: 1 },
            ":": { x: 11, y: 1 },
            ";": { x: 12, y: 1 },
            "<": { x: 13, y: 1 },
            "=": { x: 14, y: 1 },

            // third line
            ">": { x: 0, y: 2 },
            "?": { x: 1, y: 2 },
            "@": { x: 2, y: 2 },
            A: { x: 3, y: 2 },
            B: { x: 4, y: 2 },
            C: { x: 5, y: 2 },
            D: { x: 6, y: 2 },
            E: { x: 7, y: 2 },
            F: { x: 8, y: 2 },
            G: { x: 9, y: 2 },
            H: { x: 10, y: 2 },
            I: { x: 11, y: 2 },
            J: { x: 12, y: 2 },
            K: { x: 13, y: 2 },
            L: { x: 14, y: 2 },

            // fourth line
            M: { x: 0, y: 3 },
            N: { x: 1, y: 3 },
            O: { x: 2, y: 3 },
            P: { x: 3, y: 3 },
            Q: { x: 4, y: 3 },
            R: { x: 5, y: 3 },
            S: { x: 6, y: 3 },
            T: { x: 7, y: 3 },
            U: { x: 8, y: 3 },
            V: { x: 9, y: 3 },
            W: { x: 10, y: 3 },
            X: { x: 11, y: 3 },
            Y: { x: 12, y: 3 },
            Z: { x: 13, y: 3 },
            "[": { x: 14, y: 3 },

            // fifth line
            "\\": { x: 0, y: 4 },
            "]": { x: 1, y: 4 },
            "^": { x: 2, y: 4 },
            _: { x: 3, y: 4 },
        };

        const loader = new THREE.TextureLoader();
        this.texture = loader.load("./image/font.png");
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.gridSize = { cols: 15, rows: 8 };
        this.cellWidth = 1 / 15;
        this.cellHeight = 1 / 8;
    }

    /**
     * sets the material's UVs to display a specific character
     * @param {string} char character to be displayed
     * @returns {THREE.MeshBasicMaterial} character's material
     */
    setCharacterUV(char) {
        // position of the character
        const charData = this.charMap[char];
        const offsetX = charData.x * this.cellWidth;
        const offsetY = charData.y * this.cellHeight;

        // material of the character
        const texture = this.texture.clone();
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        material.map.repeat.set(this.cellWidth, this.cellHeight);
        material.map.offset.set(offsetX, 1 - offsetY - this.cellHeight);
        return material;
    }

    /**
     * create a group of meshes representing the given text
     * @param {string} text text to be rendered
     * @param {number} charWidth width of each character
     * @param {number} charHeight height of each character
     * @returns {THREE.Group} group representing the text
     */
    createTextMesh(text, charWidth = 1, charHeight = 1) {
        const textGroup = new THREE.Group();
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charMaterial = this.setCharacterUV(char);
            if (!charMaterial) continue;
            const charGeometry = new THREE.PlaneGeometry(charWidth, charHeight);
            const charMesh = new THREE.Mesh(charGeometry, charMaterial);
            charMesh.position.x = i * charWidth;
            textGroup.add(charMesh);
        }
        return textGroup;
    }
}

export { MyFont };
