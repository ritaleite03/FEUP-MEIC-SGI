import * as THREE from "three";

class MyFont {
    /**
     * Constructs the object.
     */
    constructor() {
        //this.charMap = {
        //    // third line
        //    " ": { x: 0, y: 2 },
        //    "!": { x: 1, y: 2 },
        //    '"': { x: 2, y: 2 },
        //    "#": { x: 3, y: 2 },
        //    $: { x: 4, y: 2 },
        //    "%": { x: 5, y: 2 },
        //    "&": { x: 6, y: 2 },
        //    "'": { x: 7, y: 2 },
        //    "(": { x: 8, y: 2 },
        //    ")": { x: 9, y: 2 },
        //    "*": { x: 10, y: 2 },
        //    "+": { x: 11, y: 2 },
        //    ",": { x: 12, y: 2 },
        //    "-": { x: 13, y: 2 },
        //    ".": { x: 14, y: 2 },
        //    "/": { x: 15, y: 2 },
        //
        //    // fourth line
        //    0: { x: 0, y: 3 },
        //    1: { x: 1, y: 3 },
        //    2: { x: 2, y: 3 },
        //    3: { x: 3, y: 3 },
        //    4: { x: 4, y: 3 },
        //    5: { x: 5, y: 3 },
        //    6: { x: 6, y: 3 },
        //    7: { x: 7, y: 3 },
        //    8: { x: 8, y: 3 },
        //    9: { x: 9, y: 3 },
        //    ":": { x: 10, y: 3 },
        //    ";": { x: 11, y: 3 },
        //    "<": { x: 12, y: 3 },
        //    "=": { x: 13, y: 3 },
        //    ">": { x: 14, y: 3 },
        //    "?": { x: 15, y: 3 },
        //
        //    // fifth line
        //    "@": { x: 0, y: 4 },
        //    A: { x: 1, y: 4 },
        //    B: { x: 2, y: 4 },
        //    C: { x: 3, y: 4 },
        //    D: { x: 4, y: 4 },
        //    E: { x: 5, y: 4 },
        //    F: { x: 6, y: 4 },
        //    G: { x: 7, y: 4 },
        //    H: { x: 8, y: 4 },
        //    I: { x: 9, y: 4 },
        //    J: { x: 10, y: 4 },
        //    K: { x: 11, y: 4 },
        //    L: { x: 12, y: 4 },
        //    M: { x: 13, y: 4 },
        //    N: { x: 14, y: 4 },
        //    O: { x: 15, y: 4 },
        //
        //    // sixth line
        //    P: { x: 0, y: 5 },
        //    Q: { x: 1, y: 5 },
        //    R: { x: 2, y: 5 },
        //    S: { x: 3, y: 5 },
        //    T: { x: 4, y: 5 },
        //    U: { x: 5, y: 5 },
        //    V: { x: 6, y: 5 },
        //    W: { x: 7, y: 5 },
        //    X: { x: 8, y: 5 },
        //    Y: { x: 9, y: 5 },
        //    Z: { x: 10, y: 5 },
        //    "[": { x: 11, y: 5 },
        //    "\\": { x: 12, y: 5 },
        //    "]": { x: 13, y: 5 },
        //    "^": { x: 14, y: 5 },
        //    "-": { x: 15, y: 5 },
        //
        //    // seventh line
        //    "`": { x: 0, y: 6 },
        //    a: { x: 1, y: 6 },
        //    b: { x: 2, y: 6 },
        //    c: { x: 3, y: 6 },
        //    d: { x: 4, y: 6 },
        //    e: { x: 5, y: 6 },
        //    f: { x: 6, y: 6 },
        //    g: { x: 7, y: 6 },
        //    h: { x: 8, y: 6 },
        //    i: { x: 9, y: 6 },
        //    j: { x: 10, y: 6 },
        //    k: { x: 11, y: 6 },
        //    l: { x: 12, y: 6 },
        //    m: { x: 13, y: 6 },
        //    n: { x: 14, y: 6 },
        //    o: { x: 15, y: 6 },
        //
        //    // eigth line
        //    p: { x: 0, y: 7 },
        //    q: { x: 1, y: 7 },
        //    r: { x: 2, y: 7 },
        //    s: { x: 3, y: 7 },
        //    t: { x: 4, y: 7 },
        //    u: { x: 5, y: 7 },
        //    v: { x: 6, y: 7 },
        //    w: { x: 7, y: 7 },
        //    x: { x: 8, y: 7 },
        //    y: { x: 9, y: 7 },
        //    z: { x: 10, y: 7 },
        //    "{": { x: 11, y: 7 },
        //    "|": { x: 12, y: 7 },
        //    "}": { x: 13, y: 7 },
        //    "~": { x: 14, y: 7 },
        //};

        this.charMap = {
            A: { x: 1, y: 0 },
            B: { x: 2, y: 0 },
            C: { x: 3, y: 0 },
            D: { x: 4, y: 0 },
            E: { x: 5, y: 0 },
            F: { x: 6, y: 0 },
            G: { x: 7, y: 0 },
            H: { x: 8, y: 0 },
            I: { x: 9, y: 0 },
            J: { x: 10, y: 0 },
            K: { x: 11, y: 0 },
            L: { x: 12, y: 0 },
            M: { x: 13, y: 0 },
            N: { x: 14, y: 0 },
            O: { x: 15, y: 0 },

            P: { x: 0, y: 1 },
            Q: { x: 1, y: 1 },
            R: { x: 2, y: 1 },
            S: { x: 3, y: 1 },
            T: { x: 4, y: 1 },
            U: { x: 5, y: 1 },
            V: { x: 6, y: 1 },
            W: { x: 7, y: 1 },
            X: { x: 8, y: 1 },
            Y: { x: 9, y: 1 },
            Z: { x: 10, y: 1 },
            "[": { x: 11, y: 1 },
            "£": { x: 12, y: 1 },
            "]": { x: 13, y: 1 },

            " ": { x: 0, y: 2 },
            "!": { x: 1, y: 2 },
            '"': { x: 2, y: 2 },
            "#": { x: 3, y: 2 },
            $: { x: 4, y: 2 },
            "%": { x: 5, y: 2 },
            "&": { x: 6, y: 2 },
            "'": { x: 7, y: 2 },
            "(": { x: 8, y: 2 },
            ")": { x: 9, y: 2 },
            "*": { x: 10, y: 2 },
            "+": { x: 11, y: 2 },
            ",": { x: 12, y: 2 },
            "-": { x: 13, y: 2 },
            ".": { x: 14, y: 2 },
            "/": { x: 15, y: 2 },

            0: { x: 0, y: 3 },
            1: { x: 1, y: 3 },
            2: { x: 2, y: 3 },
            3: { x: 3, y: 3 },
            4: { x: 4, y: 3 },
            5: { x: 5, y: 3 },
            6: { x: 6, y: 3 },
            7: { x: 7, y: 3 },
            8: { x: 8, y: 3 },
            9: { x: 9, y: 3 },
            ":": { x: 10, y: 3 },
            ";": { x: 11, y: 3 },
            "<": { x: 12, y: 3 },
            "=": { x: 13, y: 3 },
            ">": { x: 14, y: 3 },
            "?": { x: 15, y: 3 },
        };

        const loader = new THREE.TextureLoader();
        this.texture = loader.load("./image/font6r.png");
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.gridSize = { cols: 16, rows: 8 };
        this.cellWidth = 1 / 16;
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
