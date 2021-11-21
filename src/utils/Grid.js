export default class Grid {

    width = -1; // width
    height = -1; // height
    elems = -1; // n
    values = []; // values

    constructor(width, height, values) {
        this.width = width;
        this.height = height;
        this.values = JSON.parse(JSON.stringify(values));
    }

    static generateGrid(width, height, n) {

        let size = width * height;
        if (n === undefined) n = size;
        let vs = Array.from({length: n}, (_, i) => i + 1);

        // Fisher-Yates (aka Knuth) Shuffle
        for (let idx = vs.length; idx > 0;) {
            let rnd = Math.floor(Math.random() * idx--);
            [vs[idx], vs[rnd]] = [vs[rnd], vs[idx]];
        }

        if (n >= size) {
            let [tvs, d0, d1, r] = [[], Math.floor(n / size), Math.ceil(n / size), n % size];
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

        return new Grid(width, height, vs);

    }

    static cloneDeep(grid) {

        return new Grid(grid.width, grid.height, grid.values);

    }

}