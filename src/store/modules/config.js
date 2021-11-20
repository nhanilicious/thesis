import algorithms from '@/utils/algorithms'
import BaseSort from "@/utils/BaseSort";

export default {

    namespaced: true,

    state: {
        algorithm: undefined,
        width: undefined,
        height: undefined,
        elems: undefined
    },

    getters: {
        algorithms: () => {
            let items = [];
            for (let prop in algorithms) {
                items.push({
                    text: algorithms[prop].name,
                    value: algorithms[prop],
                    disabled: false
                })
            }
            return items;
        }
    },

    mutations: {
        setAlgorithm(state, value) {
            if (value.prototype instanceof BaseSort) {
                state.algorithm = value;
                state.width = 1;
                state.height = 1;
                state.elems = 1;
            }
        },
        setWidth(state, value) {
            if (state.algorithm && Number.isInteger(value) && value > 0)
                state.width = value;
        },
        setHeight(state, value) {
            if (state.algorithm && state.algorithm.dimension > 1 && Number.isInteger(value) && value > 0)
                state.height = value;
        },
        setElems(state, value) {
            if (state.algorithm && Number.isInteger(value) && value > 0)
                state.elems = value;
        }
    },

    actions: {
        setConfig({commit}, config) {
            commit('setAlgorithm', config.algorithm);
            commit('setWidth', config.width);
            commit('setHeight', config.height);
            commit('setElems', config.elems);
        }
    }

}