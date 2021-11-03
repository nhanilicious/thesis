<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-btn :disabled="!steps" @click="skipPrev" icon>
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn :disabled="!steps" @click="togglePlay" icon>
          <v-icon>{{ pause ? 'mdi-play' : 'mdi-pause' }}</v-icon>
        </v-btn>
        <v-btn :disabled="!steps" @click="skipNext" icon>
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-slider :disabled="!steps" v-model="turn" step="1" min="1" :max="history" thumb-label ticks/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Grid from "@/components/util/Grid";

export default {

  name: "Player",

  props: {
    config: undefined
    /*config: {
      algorithm: undefined,
      width: undefined,
      height: undefined,
      n: undefined
    }*/
  },

  data: function () {
    return {
      initStep: undefined,
      steps: undefined,
      turn: undefined,
      loop: undefined,
      pause: true,
      interval: 1000
    }
  },

  computed: {
    history() {
      if (this.steps) return this.steps.length;
      else return 1;
    }
  },

  watch: {
    config: function () {
      this.sim();
    },
    turn: function () {
      if (this.steps) this.emitStep();
    },
    interval: function () {
      this.init();
    }
  },

  methods: {
    init() {

      if (this.loop) clearInterval(this.loop);

      let player = this;
      this.loop = setInterval(function () {
        if (!player.pause) {
          if (player.turn < player.steps.length) {
            if (++(player.turn) >= player.steps.length) player.pause = true;
          } else {
            player.pause = true;
          }
        }
      }, player.interval);

    },
    sim() {

      let config = this.config;

      if (config) {

        let [a, w, h, n] = [config.algorithm, config.width, config.height, config.n];

        this.initStep = a.initStep(Grid.generateGrid(w, h, n));
        this.steps = [this.initStep];

        let step = a.nextStep(this.initStep);
        let timeout = 0;
        while (step != null && timeout++ < 2 * w * h) {
          this.steps.push(step);
          step = a.nextStep(step);
        }

        this.turn = 1;
        this.emitStep();

      }
    },
    emitStep() {
      this.$emit('emit-step', this.steps[this.turn - 1]);
    },
    skipPrev() {
      if (this.turn > 1) --this.turn;
    },
    skipNext() {
      if (this.turn < this.steps.length) ++this.turn;
    },
    togglePlay() {
      this.pause = !this.pause;
    }
  },

  created: function () {
    this.init();
  }

}
</script>

<style scoped>

</style>