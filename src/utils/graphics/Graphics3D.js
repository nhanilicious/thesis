import * as Three from 'three';

const DEFAULT_NODE_COLOR = 0x333333;
const DEFAULT_CONN_COLOR = 0x222222;
const HIGHLIGHT_COLOR = 0xffffff;

export default class Graphics3D {

    // dimensions
    canvasWidth = 0.0;
    canvasHeight = 0.0;
    nodeSize = 1.0;
    connSize = 1.0;
    elemSize = null;

    // coords
    nodePos = null;
    connPos = null;
    elemPos = null;

    // objects
    camera = null;
    scene = null;
    renderer = null;
    nodes = null;
    conns = null;
    elems = null;

    constructor(canvasWidth, canvasHeight) {

        [this.canvasWidth, this.canvasHeight] = [canvasWidth, canvasHeight];

        this.camera = new Three.PerspectiveCamera(90, this.canvasWidth / this.canvasHeight, 0.01, 100);
        this.scene = new Three.Scene();

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);

    }

    resize(canvasWidth, canvasHeight) {

        [this.canvasWidth, this.canvasHeight] = [canvasWidth, canvasHeight];

        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.render(this.scene, this.camera);

    }

    getDomElement() {
        return this.renderer.domElement;
    }

    initObjects(grid) {

        this._clearObjects();

        if (grid) {

            this._initNodes(grid);
            this._initConns(grid);
            this._initElems(grid);

        }

    }

    _clearObjects() {

        while (this.scene.children.length) this.scene.remove(this.scene.children[0]);

        if (this.nodes) {
            for (let i = 0; i < this.nodes.length; ++i)
                for (let j = 0; j < this.nodes[i].length; ++j) {
                    this.nodes[i][j].geometry.dispose();
                    this.nodes[i][j].material.dispose();
                }
        }

        if (this.conns) {
            for (let i = 0; i < this.conns.length; ++i)
                for (let j = 0; j < this.conns[i].length; ++j)
                    for (let k = 0; k < this.conns[i][j].length; ++k) {
                        this.conns[i][j][k].geometry.dispose();
                        this.conns[i][j][k].material.dispose();
                    }
        }

        if (this.elems) {
            for (let i = 0; i < this.elems.length; ++i) {
                this.elems[i].geometry.dispose();
                this.elems[i].material.dispose();
            }
        }

        this.nodes = null;
        this.conns = null;
        this.elems = null;

    }

    _initNodes(grid) {

        let [w, h, s, positions] = [grid.width, grid.height, this.nodeSize, []];

        // node positions
        for (let i = 0; i < h; ++i) {
            positions.push([]);
            for (let j = 0; j < w; ++j)
                positions[i].push([2 * j * s, -2 * i * s]);
        }

        [this.nodePos, this.nodes] = [positions, []];

        // nodes
        for (let i = 0; i < h; ++i) {

            this.nodes.push([]);

            for (let j = 0; j < w; ++j) {

                let node = Factory.createNode([this.nodePos[i][j][0], this.nodePos[i][j][1], 0]);
                node.scale.set(this.nodeSize, this.nodeSize, this.nodeSize);

                this.nodes[i].push(node);
                this.scene.add(this.nodes[i][j]);

            }
        }

        // reposition camera
        this.camera.position.x = (this.nodePos[h - 1][w - 1][0] + this.nodePos[0][0][0]) / 2;
        this.camera.position.y = (this.nodePos[h - 1][w - 1][1] + this.nodePos[0][0][1]) / 2;
        this.camera.position.z = s * 5 / 4 + Math.max(w, h);

        /*let c = Math.max(w,h) + 1.0;
        let b = c / Math.tan(this.camera.fov * Math.PI / 360);
        this.camera.position.z = s / 2 + b */

        /*[this.camera.position.x, this.camera.position.y, this.camera.position.z] = [
            (w - 1) * s, (h - 1) * s, s / 4 + Math.max(w, h) + 1.0
        ]*/

        this.camera.updateProjectionMatrix();

    }

    _initConns(grid) {

        let [w, h, s, positions] = [grid.width, grid.height, this.nodeSize, [[], []]];

        // conn width
        this.connSize = this.nodeSize;

        // conn positions
        for (let i = 0; i < h; ++i) {
            positions[0].push([]);
            for (let j = 0; j < w - 1; ++j)
                positions[0][i].push([this.nodePos[i][j][0] + s, this.nodePos[i][j][1]]);
        }
        for (let i = 0; i < h - 1; ++i) {
            positions[1].push([]);
            for (let j = 0; j < w; ++j)
                positions[1][i].push([this.nodePos[i][j][0], this.nodePos[i][j][1] + s]);
        }

        [this.connPos, this.conns] = [positions, [[], []]];

        // horizontal conns
        for (let i = 0; i < h; ++i) {

            this.conns[0].push([]);

            for (let j = 0; j < w - 1; ++j) {

                let conn = Factory.createHorizontalConn([this.connPos[0][i][j][0], this.connPos[0][i][j][1], 0]);
                conn.scale.set(this.nodeSize, this.nodeSize, this.nodeSize);

                this.conns[0][i].push(conn);
                this.scene.add(this.conns[0][i][j]);

            }
        }

        // vertical conns
        for (let i = 0; i < h - 1; ++i) {

            this.conns[1].push([]);

            for (let j = 0; j < w; ++j) {

                let conn = Factory.createVerticalConn([this.connPos[1][i][j][0], this.connPos[1][i][j][1], 0]);
                conn.scale.set(this.nodeSize, this.nodeSize, this.nodeSize);

                this.conns[1][i].push(conn);
                this.scene.add(this.conns[1][i][j]);

            }
        }

    }

    _initElems(grid) {

        // elem width and positions
        this.updateObjects(grid, null);

        let n = grid.elems;
        this.elems = [];

        // elems
        for (let i = 0; i < n; ++i) {

            let elem = Factory.createElem(i + 1, [this.elemPos[0][i][0], this.elemPos[0][i][1], 0])
            elem.scale.set(this.elemSize[0][i], this.elemSize[0][i], 1.0);

            this.elems.push(elem);
            this.scene.add(this.elems[i]);

        }

    }

    updateObjects(grid0, grid1) {

        let [elemPos0, elemPos1] = [this._calcElemPos(grid0), this._calcElemPos(grid1)];
        let [elemSize0, elemSize1] = [this._calcElemSize(grid0), this._calcElemSize(grid1)];

        if (elemPos0) {
            if (elemPos1) {
                this.elemPos = [elemPos0, elemPos1];
                this.elemSize = [elemSize0, elemSize1];
            } else {
                this.elemPos = [elemPos0, JSON.parse(JSON.stringify(elemPos0))];
                this.elemSize = [elemSize0, JSON.parse(JSON.stringify(elemSize0))];
            }
        } else {
            this.elemPos = [[], []];
            this.elemSize = [[], []];
        }

    }

    _calcElemSize(grid) {

        if (grid) {

            let [w, h, n, sizes] = [grid.width, grid.height, grid.elems, []];

            for (let i = 0; i < n; ++i) sizes.push([]);

            for (let i = 0; i < h; ++i) {
                for (let j = 0; j < w; ++j)
                    for (let k = 0; k < grid.values[i][j].length; ++k) {
                        let s = 0.8 * this.nodeSize / Math.ceil(Math.sqrt(grid.values[i][j].length));
                        sizes[grid.values[i][j][k] - 1] = Math.min(s, this.nodeSize * 0.5);
                    }
            }

            return sizes;

        } else {

            return null;

        }

    }

    _calcElemPos(grid) {

        if (grid) {

            let [w, h, n, positions] = [grid.width, grid.height, grid.elems, []];

            for (let i = 0; i < n; ++i) positions.push([]);

            for (let i = 0; i < h; ++i) {
                for (let j = 0; j < w; ++j)
                    for (let k = 0; k < grid.values[i][j].length; ++k) {

                        let nw = Math.ceil(Math.sqrt(grid.values[i][j].length));
                        let [ns, nh] = [this.nodeSize / nw, (grid.values[i][j].length > (nw * (nw - 1))) ? nw : (nw - 1)];

                        positions[grid.values[i][j][k] - 1] = [
                            this.nodePos[i][j][0] + ((k % nw) - 0.5 * (nw - 1)) * ns,
                            this.nodePos[i][j][1] + (nh - Math.floor(k / nw) - 0.5 * (nh + 1)) * ns
                        ];

                    }
            }

            return positions;

        } else {

            return null;

        }

    }

    highlight(highlights) {

        if (this.nodes && this.conns) {

            for (let i = 0; i < this.nodes.length; ++i)
                for (let j = 0; j < this.nodes[i].length; ++j)
                    this.nodes[i][j].material.color.setHex(DEFAULT_NODE_COLOR);

            for (let d = 0; d < this.conns.length; ++d)
                for (let i = 0; i < this.conns[d].length; ++i)
                    for (let j = 0; j < this.conns[d][i].length; ++j)
                        this.conns[d][i][j].material.color.setHex(DEFAULT_CONN_COLOR);

            if (highlights) {

                for (let idx in highlights) {

                    let highlight = highlights[idx];
                    let [x0, y0] = highlight.topLeft;
                    let [x1, y1] = highlight.bottomRight;

                    for (let i = x0; i <= x1; ++i)
                        for (let j = y0; j <= y1; ++j) {

                            if (j < y1) this.conns[0][i][j].material.color.setHex(HIGHLIGHT_COLOR);
                            if (i < x1) this.conns[1][i][j].material.color.setHex(HIGHLIGHT_COLOR);
                            this.nodes[i][j].material.color.setHex(HIGHLIGHT_COLOR);

                        }

                }

            }

        }

    }

    animate(delta) {

        if (this.elems) {

            for (let i = 0; i < this.elems.length; ++i) {

                let [x0, y0] = [this.elemPos[0][i][0], this.elemPos[0][i][1]];
                let [x1, y1] = [this.elemPos[1][i][0], this.elemPos[1][i][1]];
                let [s0, s1] = [this.elemSize[0][i], this.elemSize[1][i]];

                let delayed = delta * 2.0 - 0.5;

                if (delayed > 1.0) {
                    this.elems[i].position.x = x1;
                    this.elems[i].position.y = y1;
                    this.elems[i].scale.set(s1, s1, 1.0);
                } else if (delayed > 0.0) {
                    let [dx, dy, ds] = [(x1 - x0) * delayed, (y1 - y0) * delayed, (s1 - s0) * delayed];
                    this.elems[i].position.x = x0 + dx;
                    this.elems[i].position.y = y0 + dy;
                    this.elems[i].scale.set(s0 + ds, s0 + ds, 1.0);
                } else {
                    this.elems[i].position.x = x0;
                    this.elems[i].position.y = y0;
                    this.elems[i].scale.set(s0, s0, 1.0);
                }

            }

        }

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

}

class Factory {

    static createNode(coords = [0, 0, 0]) {

        let geometry = new Three.BoxGeometry(1.0, 1.0, 0.5);
        let edges = new Three.EdgesGeometry(geometry);
        let node = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: DEFAULT_NODE_COLOR}));

        [node.position.x, node.position.y, node.position.z] = coords;

        return node;

    }

    static createHorizontalConn(coords = [0, 0, 0]) {

        let geometry = new Three.BufferGeometry().setFromPoints([
            new Three.Vector3(-0.5, 0, 0),
            new Three.Vector3(0.5, 0, 0)
        ]);
        let conn = new Three.LineSegments(geometry, new Three.LineBasicMaterial({color: DEFAULT_CONN_COLOR}));

        [conn.position.x, conn.position.y, conn.position.z] = coords;
        return conn;

    }

    static createVerticalConn(coords = [0, 0, 0]) {

        let geometry = new Three.BufferGeometry().setFromPoints([
            new Three.Vector3(0, -0.5, 0),
            new Three.Vector3(0, 0.5, 0)
        ]);
        let conn = new Three.LineSegments(geometry, new Three.LineBasicMaterial({color: DEFAULT_CONN_COLOR}));

        [conn.position.x, conn.position.y, conn.position.z] = coords;

        return conn;

    }

    static createElem(text, coords = [0, 0, 0]) {

        let canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [40, 40];
        let context = canvas.getContext("2d");

        context.font = "14pt Arial";

        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        let texture = new Three.Texture(canvas);
        texture.needsUpdate = true;
        let material = new Three.MeshBasicMaterial({map: texture});
        let elem = new Three.Mesh(new Three.CircleGeometry(0.5, 60), material);

        [elem.overdraw, [elem.position.x, elem.position.y, elem.position.z]] = [true, coords];

        return elem;

    }

}