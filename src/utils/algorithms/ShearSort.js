import BaseSort from "@/utils/BaseSort"
import Grid from "@/utils/Grid"
import Highlight from "@/utils/Highlight";
import Step from "@/utils/Step"

export default class ShearSort extends BaseSort {

    static dimension = 2;
    static name = "Shear Sort";

    static initStep(grid) {

        return new Step(Grid.cloneDeep(grid), [0, 0, 0]);

    }

    static nextStep(step) {

        let [grid, [phase, iter, turn]] = [Grid.cloneDeep(step.grid), step.state];
        const [w, h] = [grid.width, grid.height];
        let highlights = [];

        switch (phase) {

            case 0:

                if (grid.values[0][0].length > 1) {

                    for (let i = 0; i < h; ++i)
                        for (let j = 0; j < w; ++j) {
                            grid.values[i][j].sort(BaseSort.numeralCompare);
                            highlights.push(new Highlight([i, j], [i, j]));
                        }

                    return new Step(grid, [1, 0, 0], highlights);

                } else {

                    return this.nextStep(new Step(grid, [1, 0, 0]));

                }

            case 1:

                for (let i = 0; i < h; ++i)
                    for (let j = turn % 2; j + 1 < w; j += 2) {

                        highlights.push(new Highlight([i, j], [i, j + 1]));

                        let arr = grid.values[i][j].concat(grid.values[i][j + 1]);
                        arr.sort(BaseSort.numeralCompare);
                        let tmp = arr.splice(0, Math.ceil(arr.length / 2));
                        [grid.values[i][j], grid.values[i][j + 1]] = (i % 2) ? [arr, tmp] : [tmp, arr];

                    }

                if ((turn + 1) == w)
                    return new Step(grid, [2, iter, 0], highlights);
                else
                    return new Step(grid, [1, iter, turn + 1], highlights);

            case 2:

                for (let i = turn % 2; i + 1 < h; i += 2)
                    for (let j = 0; j < w; j++) {

                        highlights.push(new Highlight([i, j], [i + 1, j]));

                        let arr = grid.values[i][j].concat(grid.values[i + 1][j]);
                        arr.sort(BaseSort.numeralCompare);
                        let tmp = arr.splice(Math.ceil(arr.length / 2));
                        [grid.values[i][j], grid.values[i + 1][j]] = [arr, tmp];

                    }

                if ((turn + 1) == h)
                    if ((iter + 1) === Math.max(w, h))
                        return new Step(grid, [3, 0, 0], highlights);
                    else
                        return new Step(grid, [1, iter + 1, 0], highlights);
                else
                    return new Step(grid, [2, iter, turn + 1], highlights);

            case 3:
            default:

                return null;

        }

    }

}