<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-btn :disabled="!enabled" @click="decrementTurn" icon>
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn :disabled="!enabled" @click="togglePause" icon>
          <v-icon>{{ paused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
        </v-btn>
        <v-btn :disabled="!enabled" @click="incrementTurn" icon>
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-slider :disabled="!enabled" v-model="t" step="1" min="0" :max="t_max" thumb-label ticks/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'

export default {

  name: "Player",

  computed: {
    ...mapState({
      enabled: state => state.player.enabled,
      paused: state => state.player.paused,
      t_max: state => state.player.t_max
    }),
    t: {
      get () {
        return Math.floor(this.$store.state.player.t);
      },
      set (value) {
        this.$store.commit('player/setT', value);
      }
    }
  },

  methods: {
    incrementTurn() {
      this.$store.commit('player/incrementTurn');
    },
    decrementTurn() {
      this.$store.commit('player/decrementTurn');
    },
    togglePause() {
      this.$store.dispatch('player/togglePause');
    },
    update() {
      if (this.enabled && !this.paused)
        this.$store.commit('player/modifyBy', 0.01);
    }
  }

}
</script>

<style scoped>

</style>