import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        a: 4, // width
        b: 4, // height
        n: 16, // number of nodes
        values: [
            [3, 11, 6, 16],
            [8, 1, 5, 10],
            [14, 7, 12, 2],
            [4, 13, 9, 15]
        ],
        turn: 0
    },
    mutations: {
        shearSort: (state) => {
            const [a, b] = [state.a, state.b];
            let t = state.turn % (a + b);
            if (t < a) {
                for (let i = t % 2; i < a; i += 2) {
                    for (let j = 0; j < b; j++) {
                        if ((i + 1) < a) {
                            if (((j % 2) && (state.values[j][i] < state.values[j][i + 1])) || (!(j % 2) && (state.values[j][i] > state.values[j][i + 1]))) {
                                [state.values[j][i], state.values[j][i + 1]] = [state.values[j][i + 1], state.values[j][i]]
                            }
                        }
                    }
                }
            } else {
                t -= a;
                for (let i = t % 2; i < b; i += 2) {
                    for (let j = 0; j < a; j++) {
                        if ((i + 1) < b) {
                            if (state.values[i][j] > state.values[i+1][j]) {
                                [state.values[i][j], state.values[i+1][j]] = [state.values[i+1][j], state.values[i][j]]
                            }
                        }
                    }
                }
            }
            state.turn++;
        }
    },
    actions: {},
    modules: {}
})