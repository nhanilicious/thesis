export default class Grid {

    width = -1; // width
    height = -1; // height
    elems = -1; // n
    values = []; // values

    constructor(width, height, elems, values) {
        this.width = width;
        this.height = height;
        this.elems = elems;
        this.values = JSON.parse(JSON.stringify(values));
    }

    static generateGrid(width, height, elems) {

        let size = width * height;
        if (elems === undefined) elems = size;
        let vs = Array.from({length: elems}, (_, i) => i + 1);

        // Fisher-Yates (aka Knuth) Shuffle
        for (let idx = vs.length; idx > 0;) {
            let rnd = Math.floor(Math.random() * idx--);
            [vs[idx], vs[rnd]] = [vs[rnd], vs[idx]];
        }

        if (elems >= size) {
            let [tvs, d0, d1, r] = [[], Math.floor(elems / size), Math.ceil(elems / size), elems % size];
            for (let i = 0; i < r; ++i) tvs.push(vs.splice(0, d1));
            for (let i = r; i < size; ++i) tvs.push(vs.length ? vs.splice(0, d0) : []);
            vs = tvs;
        } else {
            let tvs = Array.from(vs, (x) => [x]);
            for (let i = tvs.length; i < size; ++i) tvs.push([]);
            vs = tvs;
        }

        {
            let tvs = [];
            while (vs.length) tvs.push(vs.splice(0, width));
            vs = tvs;
        }

        return new Grid(width, height, elems, vs);

    }

    static cloneDeep(grid) {

        return new Grid(grid.width, grid.height, grid.elems, grid.values);

    }

}