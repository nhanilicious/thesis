import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/store/modules/config';
import memento from "@/store/modules/memento";
import player from '@/store/modules/player';

Vue.use(Vuex)

export default new Vuex.Store({

    strict: true, // Enable during development.

    modules: {
        config,
        memento,
        player
    }

});