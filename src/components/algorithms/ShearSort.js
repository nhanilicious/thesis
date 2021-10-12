import BaseSort from "@/components/util/BaseSort"
import Grid from "@/components/util/Grid"
import Highlight from "@/components/util/Highlight";
import Step from "@/components/util/Step"

export default class ShearSort extends BaseSort {

    static dimension = 2;
    static id = "shear_sort";
    static name = "Shear Sort";

    static initStep(grid) {

        return new Step(Grid.cloneDeep(grid), [0, 0], 0, []);

    }

    static nextStep(step) {

        let [grid, [phase, iter], turn] = [Grid.cloneDeep(step.grid), step.phase, step.turn];
        const [w, h] = [grid.width, grid.height];
        let highlights = [];

        switch (phase) {

            case 0:
            case 1:

                for (let i = turn % 2; i < w; i += 2)
                    for (let j = 0; j < h; j++) {

                        highlights.push(new Highlight([j, i], [j, i + 1]));

                        if ((i + 1) < w)
                            if (((j % 2) && (grid.values[j][i] < grid.values[j][i + 1])) || (!(j % 2) && (grid.values[j][i] > grid.values[j][i + 1])))
                                [grid.values[j][i], grid.values[j][i + 1]] = [grid.values[j][i + 1], grid.values[j][i]];

                    }

                if ((turn + 1) === w)
                    return new Step(grid, [2, iter], 0, highlights);
                else
                    return new Step(grid, [1, iter], turn + 1, highlights);

            case 2:

                for (let i = turn % 2; i < h; i += 2)
                    for (let j = 0; j < w; j++) {

                        highlights.push(new Highlight([i, j], [i + 1, j]));

                        if ((i + 1) < h)
                            if (grid.values[i][j] > grid.values[i + 1][j])
                                [grid.values[i][j], grid.values[i + 1][j]] = [grid.values[i + 1][j], grid.values[i][j]]

                    }

                if ((turn + 1) === h)
                    if ((iter + 1) === Math.max(w, h))
                        return new Step(grid, [3, 0], 0, highlights);
                    else
                        return new Step(grid, [1, iter + 1], 0, highlights);
                else
                    return new Step(grid, [1, iter], turn + 1, highlights);

            case 3:
            default:

                return null;

        }

    }

}