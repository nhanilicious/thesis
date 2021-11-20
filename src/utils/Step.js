export default class Step {

    grid = null; // grid
    state = 0; // state

    highlights = []; // areas to highlight

    constructor(grid, state = 0, highlights = []) {

        this.grid = grid;
        this.state = state;
        this.highlights = highlights;

    }

}