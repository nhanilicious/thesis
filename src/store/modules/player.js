export default {

    namespaced: true,

    state: {
        enabled: false,
        paused: true,
        turn: 1,
        minTurn: 1,
        maxTurn: 1
    },

    getters: {
        turn: state => {
            return state.turn;
        }
    },

    mutations: {
        setEnabled(state, value) {
            state.enabled = value;
        },
        setPaused(state, value) {
            state.paused = value;
        },
        setTurn(state, value) {
            state.turn = value;
        },
        incrementTurn(state) {
            if (state.turn < state.maxTurn) ++state.turn;
        },
        decrementTurn(state) {
            if (state.turn > state.minTurn) --state.turn;
        },
        setMaxTurn(state, value) {
            state.maxTurn = value;
        },
        minimizeTurn(state) {
            state.turn = state.minTurn;
        },
        maximizeTurn(state) {
            state.turn = state.maxTurn;
        }
    },

    actions: {
        enable({commit}) {
            commit('setEnabled', true);
        },
        disable({commit}) {
            commit('setEnabled', false);
        },
        play({commit}) {
            commit('setPaused', false);
        },
        pause({commit}) {
            commit('setPaused', true);
        },
        togglePause({state, commit}) {
            commit('setPaused', !state.paused);
        },
        reset({commit}) {
            commit('setEnabled', false);
            commit('setPaused', true);
            commit('minimizeTurn');
            commit('setMaxTurn', 1);
        }
    }

}