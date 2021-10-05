import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        a: 4, // width
        b: 4, // height
        n: 16, // number of nodes
        grid: [
            [3, 11, 6, 16],
            [8, 1, 5, 10],
            [14, 7, 12, 2],
            [4, 13, 9, 15]
        ],
        turn: 0
    },
    mutations: {},
    actions: {},
    modules: {}
})