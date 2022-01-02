<template>
  <v-container>
    <v-row>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn name="prev" :disabled="!enabled" @click="decrementTurn" icon>
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn name="play" :disabled="!enabled" @click="togglePause" icon>
          <v-icon>{{ paused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
        </v-btn>
        <v-btn name="next" :disabled="!enabled" @click="incrementTurn" icon>
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <br/>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-subheader>Steps</v-subheader>
        <v-slider name="steps" :disabled="!enabled" v-model="t" step="1" min="0" :max="t_max" thumb-label ticks/>
        <v-subheader>Speed</v-subheader>
        <v-slider name="speed" :disabled="!enabled" v-model="speed" step="1" min="1" :max="3" thumb-label ticks/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'

const BASE_DELTA = 0.005;

export default {

  name: "Player",

  computed: {
    ...mapState({
      enabled: state => state.player.enabled,
      paused: state => state.player.paused,
      t_max: state => state.player.t_max
    }),
    t: {
      get() {
        return Math.floor(this.$store.state.player.t);
      },
      set(value) {
        this.$store.commit('player/setT', value);
      }
    },
    speed: {
      get() {
        return Math.round(this.$store.state.player.delta / BASE_DELTA);
      },
      set(value) {
        this.$store.commit('player/setDelta', value * BASE_DELTA);
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
        this.$store.dispatch('player/modifyByDelta');
    }
  }

}
</script>

<style scoped>

</style>