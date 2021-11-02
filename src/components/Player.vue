<template>
  <div class="player">
    <br/><br/><br/>
    <button v-on:click="turn = turn > 0 ? turn - 1 : turn">Prev</button>
    <button v-on:click="pause = !pause">{{ pause ? "Play" : "Pause" }}</button>
    <button v-on:click="turn = turn + 1 < steps.length ? turn + 1 : turn">Next</button>
    <br/>
    <input v-model.number="interval" placeholder="interval" type="number"/>ms
    <br/><br/>
    <select v-model="turn" size="20">
      <option v-for="(step, t) in steps" :value="t" :key="t">
        Step: {{ t }}
      </option>
    </select>
  </div>
</template>

<script>
import Grid from "@/components/util/Grid";

export default {
  name: "Player",
  props: {
    config: {
      algorithm: undefined,
      width: undefined,
      height: undefined,
      n: undefined
    }
  },
  data: function () {
    return {
      grid: undefined,
      steps: undefined,
      turn: 0,
      loop: undefined,
      pause: true,
      interval: 1000
    }
  },
  watch: {
    algorithm: function () {
      this.calc();
    },
    width: function () {
      this.calc();
    },
    height: function () {
      this.calc();
    },
    n: function () {
      this.calc();
    },
    turn: function (turn) {
      this.$emit('emit-step', this.steps[turn]);
    },
    interval: function () {
      this.init();
    }
  },
  methods: {
    calc() {
      if ([this.config.algorithm, this.config.width, this.config.height, this.config.n].every(Boolean)) {

        let [a, w, h, n] = [this.config.algorithm, this.config.width, this.config.height, this.config.n];

        this.grid = a.initStep(Grid.generateGrid(w, h, n));
        this.steps = [this.grid];

        let nextGrid = a.nextStep(this.grid);
        let timeout = 0;
        while (nextGrid != null && timeout++ < 2 * w * h) {
          this.steps.push(nextGrid);
          nextGrid = a.nextStep(nextGrid);
        }

        this.turn = 0;

        this.$emit('emit-step', this.steps[this.turn]);

      }
    },
    init() {

      if (this.loop) clearInterval(this.loop);

      let player = this;
      this.loop = setInterval(function () {
        if (!player.pause && player.turn + 1 < player.steps.length)
          ++(player.turn);
      }, player.interval);

    }
  },
  created: function () {
    this.calc();
    this.init();
  }
}
</script>

<style scoped>

</style>