export default class Step {

    grid = null; // grid
    phase = undefined; // phase
    turn = 0; // turn

    highlights = []; // areas to highlight

    constructor(grid, phase = undefined, turn = 0, highlights = []) {

        this.grid = grid;
        this.phase = phase;
        this.turn = turn;
        this.highlights = highlights;

    }

}