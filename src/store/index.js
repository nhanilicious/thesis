import Vue from 'vue'
import Vuex from 'vuex'
import config from './modules/config'
import player from './modules/player'

Vue.use(Vuex)

export default new Vuex.Store({

    strict: true,

    modules: {
        config,
        player
    }

});