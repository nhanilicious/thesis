import * as Three from 'three';

export default class Graphics3D {

    // dimensions
    canvasWidth = 0.0;
    canvasHeight = 0.0;
    nodeSize = 0.0;
    pipeSize = 0.0;
    elemSize = null;

    // coords
    nodePos = null;
    pipePos = null;
    elemPos = null;

    // objects
    camera = null;
    scene = null;
    renderer = null;
    nodes = null;
    pipes = null;
    elems = null;

    constructor(canvasWidth, canvasHeight) {

        [this.canvasWidth, this.canvasHeight] = [canvasWidth, canvasHeight];

        this.camera = new Three.PerspectiveCamera(50, this.canvasWidth / this.canvasHeight, 0.01, 10);
        this.camera.position.z = 1.5;
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
            this._initPipes(grid);
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

        if (this.pipes) {
            for (let i = 0; i < this.pipes.length; ++i)
                for (let j = 0; j < this.pipes[i].length; ++j)
                    for (let k = 0; k < this.pipes[i][j].length; ++k) {
                        this.pipes[i][j][k].geometry.dispose();
                        this.pipes[i][j][k].material.dispose();
                    }
        }

        if (this.elems) {
            for (let i = 0; i < this.elems.length; ++i) {
                this.elems[i].geometry.dispose();
                this.elems[i].material.dispose();
            }
        }

        this.nodes = null;
        this.pipes = null;
        this.elems = null;

    }

    _initNodes(grid) {

        let [w, h] = [grid.width, grid.height];

        // node size
        this.nodeSize = Math.min(1.0 / (2 * w - 1), 1.0 / (2 * h - 1));
        let [s, positions] = [this.nodeSize, []];

        // node positions
        for (let i = 0; i < h; ++i) {
            positions.push([]);
            for (let j = 0; j < w; ++j)
                positions[i].push([(2 * j - w + 1) * s, -(2 * i - h + 1) * s]);
        }

        [this.nodePos, this.nodes] = [positions, []];

        // nodes
        for (let i = 0; i < h; ++i) {

            this.nodes.push([]);

            for (let j = 0; j < w; ++j) {

                /*let geometry = new Three.BoxGeometry(this.nodeSize, this.nodeSize, this.nodeSize / 2);
                let edges = new Three.EdgesGeometry(geometry);
                let node = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0x333333}));
                [node.position.x, node.position.y] = [this.nodePos[i][j][0], this.nodePos[i][j][1]];*/

                let node = Factory.createNode(this.nodeSize, {color: 0x333333}, [this.nodePos[i][j][0], this.nodePos[i][j][1], 0]);

                this.nodes[i].push(node);
                this.scene.add(this.nodes[i][j]);

            }
        }

    }

    _initPipes(grid) {

        let [w, h, s, positions] = [grid.width, grid.height, this.nodeSize, [[], []]];

        // pipe width
        this.pipeSize = this.nodeSize;

        // pipe positions
        for (let i = 0; i < h; ++i) {
            positions[0].push([]);
            for (let j = 0; j < w - 1; ++j)
                positions[0][i].push([this.nodePos[i][j][0] + s, this.nodePos[i][j][1]]);
        }
        for (let i = 0; i < h - 1; ++i) {
            positions[1].push([]);
            for (let j = 0; j < w; ++j)
                positions[1][i].push([this.nodePos[i][j][0], this.nodePos[i][j][1] - s]);
        }

        [this.pipePos, this.pipes] = [positions, [[], []]];

        // horizontal pipes
        for (let i = 0; i < h; ++i) {

            this.pipes[0].push([]);

            for (let j = 0; j < w - 1; ++j) {

                let geometry = new Three.BufferGeometry().setFromPoints([
                    new Three.Vector3(-0.5 * this.nodeSize, 0, 0),
                    new Three.Vector3(0.5 * this.nodeSize, 0, 0)
                ]);
                let pipe = new Three.LineSegments(geometry, new Three.LineBasicMaterial({color: 0x222222}));
                [pipe.position.x, pipe.position.y] = [this.pipePos[0][i][j][0], this.pipePos[0][i][j][1]];

                this.pipes[0][i].push(pipe);
                this.scene.add(this.pipes[0][i][j]);

            }
        }

        // vertical pipes
        for (let i = 0; i < h - 1; ++i) {

            this.pipes[1].push([]);

            for (let j = 0; j < w; ++j) {

                let geometry = new Three.BufferGeometry().setFromPoints([
                    new Three.Vector3(0, -0.5 * this.nodeSize, 0),
                    new Three.Vector3(0, 0.5 * this.nodeSize, 0)
                ]);
                let pipe = new Three.LineSegments(geometry, new Three.LineBasicMaterial({color: 0x222222}));
                [pipe.position.x, pipe.position.y] = [this.pipePos[1][i][j][0], this.pipePos[1][i][j][1]];

                this.pipes[1][i].push(pipe);
                this.scene.add(this.pipes[1][i][j]);

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

            let canvas = document.createElement("canvas");
            [canvas.width, canvas.height] = [40, 40];
            let context = canvas.getContext("2d");

            context.font = "14pt Arial";

            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "black";
            context.fillText(i + 1, canvas.width / 2, canvas.height / 2);

            let texture = new Three.Texture(canvas);
            texture.needsUpdate = true;
            let material = new Three.MeshBasicMaterial({map: texture});
            let elem = new Three.Mesh(new Three.CircleGeometry(1.0, 20), material);
            [elem.overdraw, elem.position.x, elem.position.y] = [true, this.elemPos[0][i][0], this.elemPos[0][i][1]];
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
                        let s = 0.4 * this.nodeSize / Math.ceil(Math.sqrt(grid.values[i][j].length));
                        sizes[grid.values[i][j][k] - 1] = Math.min(s, this.nodeSize * 0.25);
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

        if (this.nodes && this.pipes) {

            for (let i = 0; i < this.nodes.length; ++i)
                for (let j = 0; j < this.nodes[i].length; ++j)
                    this.nodes[i][j].material.color.setHex(0x333333);

            for (let d = 0; d < this.pipes.length; ++d)
                for (let i = 0; i < this.pipes[d].length; ++i)
                    for (let j = 0; j < this.pipes[d][i].length; ++j)
                        this.pipes[d][i][j].material.color.setHex(0x222222);

            if (highlights) {

                for (let idx in highlights) {

                    let highlight = highlights[idx];
                    let [x0, y0] = highlight.topLeft;
                    let [x1, y1] = highlight.bottomRight;

                    for (let i = x0; i <= x1; ++i)
                        for (let j = y0; j <= y1; ++j) {

                            if (j < y1) this.pipes[0][i][j].material.color.setHex(0xffffff);
                            if (i < x1) this.pipes[1][i][j].material.color.setHex(0xffffff);
                            this.nodes[i][j].material.color.setHex(0xffffff);

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

    static createNode(size, params, coords) {

        let geometry = new Three.BoxGeometry(size, size, size / 2);
        let edges = new Three.EdgesGeometry(geometry);
        let node = new Three.LineSegments(edges, new Three.LineBasicMaterial(params));

        [node.position.x, node.position.y, node.position.z] = coords;

        return node;

    }

}