<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-btn :disabled="!enabled" @click="['player/decrementTurn']" icon>
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn :disabled="!enabled" @click="['player/togglePause']" icon>
          <v-icon>{{ pause ? 'mdi-play' : 'mdi-pause' }}</v-icon>
        </v-btn>
        <v-btn :disabled="!enabled" @click="['player/incrementTurn']" icon>
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-slider :disabled="!enabled" v-model="turn" step="1" :min="minTurn" :max="maxTurn" thumb-label ticks/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'

export default {

  name: "Player",

  computed: {
    ...mapState({
      enabled: state => state.player.enabled,
      pause: state => state.player.pause,
      minTurn: state => state.player.minTurn,
      maxTurn: state => state.player.maxTurn
    }),
    turn: {
      get() {
        return this.$store.state["player/turn"];
      },
      set(value) {
        this['player/setTurn'](value);
      }
    }
  },

  methods: {
    ...mapMutations([
      'player/setTurn',
      'player/incrementTurn',
      'player/decrementTurn'
    ]),
    ...mapActions([
      'player/togglePause'
    ])
  }

}
</script>

<style scoped>

</style>