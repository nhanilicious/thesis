<template>
  <v-container>
    <div v-if="currStep">
      <div class="row" v-for="(dx, i) in currStep.grid.values" :key="i">
        <div class="cell" v-for="(val, j) in dx" :key="j">{{ val }}</div>
      </div>
    </div>
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {

  name: "Simulator",

  computed: {
    ...mapState({
      t: state => state.player.t
    }),
    config() {
      return this['config/config']();
    },
    prevStep() {
      return this['memento/step']()(Math.floor(this.t) - 1);
    },
    currStep() {
      return this['memento/step']()(Math.floor(this.t));
    },
    size() {
      return this['memento/size']();
    }
  },

  watch: {
    config: function (value) {
      if (value) {
        this['player/reset']();
        this['memento/init']();
        this['memento/calc']();
        this['player/enable']();
      }
    },
    size: function (value) {
      this['player/setMaxTurn'](value - 1);
    }
  },

  methods: {
    ...mapGetters([
      'config/config',
      'memento/size',
      'memento/step'
    ]),
    ...mapMutations([
      'player/setMaxTurn'
    ]),
    ...mapActions([
      'memento/init',
      'memento/calc',
      'player/enable',
      'player/reset'
    ])
  }

}

</script>

<style scoped>

</style>