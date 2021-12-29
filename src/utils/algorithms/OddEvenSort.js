import BaseSort from "@/utils/BaseSort"
import Grid from "@/utils/Grid"
import Highlight from "@/utils/Highlight";
import Step from "@/utils/Step"

export default class OddEvenSort extends BaseSort {

    static dimension = 1;
    static name = "Odd Even Sort";

    static initStep(grid) {

        return new Step(Grid.cloneDeep(grid), [0, 0]);

    }

    static nextStep(step) {

        let [grid, [phase, turn]] = [Grid.cloneDeep(step.grid), step.state];
        const w = grid.width;
        let highlights = [];

        switch (phase) {

            case 0:

                if (grid.values[0][0].length > 1) {

                    for (let i = 0; i < w; ++i) {
                        grid.values[0][i].sort(BaseSort.numeralCompare);
                        highlights.push(new Highlight([0, i], [0, i]));
                    }

                    return new Step(grid, [1, 0], highlights);

                } else {

                    return this.nextStep(new Step(grid, [1, 0]));

                }

            case 1:

                for (let i = turn % 2; i + 1 < w; i += 2) {

                    highlights.push(new Highlight([0, i], [0, i + 1]));

                    let arr = grid.values[0][i].concat(grid.values[0][i + 1]);
                    arr.sort(BaseSort.numeralCompare);
                    grid.values[0][i] = arr.splice(0, Math.ceil(arr.length / 2));
                    grid.values[0][i + 1] = arr;

                }

                if ((turn + 1) === w)
                    return new Step(grid, [2, 0], highlights);
                else
                    return new Step(grid, [1, turn + 1], highlights);

            case 2:
            default:

                return null;

        }

    }

}