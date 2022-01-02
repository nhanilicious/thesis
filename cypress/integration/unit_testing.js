import Grid from "/src/utils/Grid";
import OddEvenSort from "../../src/utils/algorithms/OddEvenSort";
import ShearSort from "../../src/utils/algorithms/ShearSort";


describe('Unit Test Application Code', function () {

    it('Unit Test Grid', function () {

        for (let w = 1; w <= 5; ++w)
            for (let h = 1; h <= 5; ++h)
                for (let e = 20; e <= 100; e += 20) {

                    let grid = Grid.generateGrid(w, h, e);

                    let values = grid.values.reduce((a, v) => a.concat(v.reduce((a, v) => a.concat(v), [])), []);
                    expect(values.length).to.eq(e);

                    let distinct = values.filter((val, idx, self) => {
                        return self.indexOf(val) === idx;
                    })
                    expect(distinct.length).to.eq(values.length);

                    let counts = grid.values.map((a) => a.map((a) => a.length));
                    let min = Math.min.apply(null, counts.map(function (row) {
                        return Math.min.apply(Math, row);
                    }));
                    expect(min).to.eq(Math.floor(e / (w * h)));

                    let max = Math.max.apply(null, counts.map(function (row) {
                        return Math.max.apply(Math, row);
                    }));
                    expect(max).to.eq(Math.ceil(e / (w * h)));

                }

    })

    it('Unit Test Even Odd Sort', function () {

        const sorted = [[
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10, 11, 12],
            [13, 14, 15, 16, 17, 18],
            [19, 20, 21, 22, 23, 24],
            [25, 26, 27, 28, 29, 30]
        ]];

        for (let iter = 0; iter < 10; ++iter) {

            let grid = Grid.generateGrid(5, 1, 30);
            let next = OddEvenSort.initStep(grid);
            let step = next;

            assert.isNotNull(next, 'is not null');
            assert.isNotNull(step, 'is not null');

            while (next) {

                step = next;
                next = OddEvenSort.nextStep(step);

            }

            expect(step.grid.values).to.deep.eq(sorted);

        }

    })

    it('Unit Test Shear Sort', function () {

        const sorted = [
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ], [
                [16, 17, 18],
                [13, 14, 15],
                [10, 11, 12]
            ], [
                [19, 20, 21],
                [22, 23],
                [24, 25]
            ],
        ];

        for (let iter = 0; iter < 10; ++iter) {

            let grid = Grid.generateGrid(3, 3, 25);
            let next = ShearSort.initStep(grid);
            let step = next;

            assert.isNotNull(next, 'is not null');
            assert.isNotNull(step, 'is not null');

            while (next) {

                step = next;
                next = ShearSort.nextStep(step);

            }

            expect(step.grid.values).to.deep.eq(sorted);

        }

    })

})