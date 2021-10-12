<template>
  <div class="player">
  </div>
</template>

<script>
import Grid from "@/components/util/Grid";

export default {
  name: "Player",
  props: {
    algorithm: undefined,
    width: undefined,
    height: undefined,
    n: undefined
  },
  data: function () {
    return {
      grid: undefined,
      steps: undefined,
      turn: 0
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
    }
  },
  methods: {

    calc() {

      if ([this.algorithm, this.width, this.height, this.n].every(Boolean)) {

        this.grid = this.algorithm.initStep(Grid.generateGrid(this.width, this.height, this.n));
        this.steps = [this.grid];

        let nextGrid = this.algorithm.nextStep(this.grid);
        let timeout = 0;
        while (nextGrid != null && timeout++ < 100) {
          this.steps.push(nextGrid);
          nextGrid = this.algorithm.nextStep(nextGrid);
        }

        this.turn = 0;

        this.$emit('emit-grid', this.steps[this.turn]);

      }

    }

  }
}
</script>

<style scoped>

</style>