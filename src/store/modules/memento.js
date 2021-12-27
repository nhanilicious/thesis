import BaseSort from "@/utils/BaseSort";
import Grid from "@/utils/Grid";

export default {

    namespaced: true,

    state: {
        steps: [],
        algorithm: undefined,
        complete: true,
    },

    getters: {
        size: state => {
            return state.steps.length;
        },
        step: (state) => (index) => {
            return (Number.isInteger(index) && index >= 0 && index < state.steps.length) ? state.steps[index] : null;
        }
    },

    mutations: {
        clear(state) {
            state.algorithm = undefined;
            state.steps = [];
            state.complete = true;
        },
        init(state, {algorithm, width, height, elems}) {
            if (!state.last && algorithm.prototype instanceof BaseSort) {
                state.algorithm = algorithm;
                state.steps.push(algorithm.initStep(Grid.generateGrid(width, height, elems)));
                state.complete = false;
            }
        },
        calcNext(state) {
            if (state.algorithm && state.steps.length && !state.complete) {
                let step = state.algorithm.nextStep(state.steps[state.steps.length - 1]);
                if (step != null) state.steps.push(step);
                else state.complete = true;
            }
        }
    },

    actions: {
        init({commit, rootGetters}) {
            commit('clear');
            commit('init', rootGetters['config/config']);
        },
        calc({commit, state}) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    while (!state.complete) commit('calcNext');
                    resolve();
                }, 1000)
            })
        }
    }

}