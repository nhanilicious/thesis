export default {

    namespaced: true,

    state: {
        enabled: false,
        paused: true,
        turn: 0,
        maxTurn: 0
    },

    mutations: {
        setEnabled(state, value) {
            state.enabled = Boolean(value);
        },
        setPaused(state, value) {
            state.paused = Boolean(value);
        },
        setTurn(state, value) {
            if (!Number.isNaN(value) && value >= 0 && value <= state.maxTurn)
                state.turn = value;
        },
        incrementTurn(state) {
            if (state.turn < state.maxTurn) state.turn = Math.floor(state.turn + 1);
        },
        decrementTurn(state) {
            if (state.turn > 0) state.turn = Math.ceil(state.turn - 1);
        },
        setMaxTurn(state, value) {
            if (Number.isInteger(value) && value >= 0) state.maxTurn = value;
            else state.maxTurn = 0;
        },
        minimizeTurn(state) {
            state.turn = 0;
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