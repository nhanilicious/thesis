export default {

    namespaced: true,

    state: {
        enabled: false,
        paused: true,
        t: 0,
        t_max: 0
    },

    mutations: {
        setEnabled(state, value) {
            state.enabled = Boolean(value);
        },
        setPaused(state, value) {
            state.paused = Boolean(value);
        },
        setT(state, value) {
            if (Number.isFinite(value) && value >= 0 && value <= state.t_max) {
                state.t = value;
                if (state.t == state.t_max) state.paused = true;
            }
        },
        increaseBy(state, value) {
            if (Number.isFinite(value)) {
                let newTurn = state.t + value;
                state.t = newTurn > state.t_max ? state.t_max : newTurn;
                if (state.t == state.t_max) state.paused = true;
            }
        },
        decreaseBy(state, value) {
            if (Number.isFinite(value)) {
                let newTurn = state.t - value;
                state.t = newTurn < 0 ? 0 : newTurn;
                if (state.t == state.t_max) state.paused = true;
            }
        },
        incrementTurn(state) {
            if (state.t < state.t_max) state.t = Math.floor(state.t + 1);
            if (state.t == state.t_max) state.paused = true;
        },
        decrementTurn(state) {
            if (state.t > 0) state.t = Math.ceil(state.t - 1);
        },
        setMaxTurn(state, value) {
            if (Number.isInteger(value) && value >= 0) state.t_max = value;
            else state.t_max = 0;
            if (state.t == state.t_max) state.paused = true;
        },
        minimizeTurn(state) {
            state.t = 0;
        },
        maximizeTurn(state) {
            state.t = state.t_max;
            state.paused = true;
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