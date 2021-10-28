<template>
  <div class="simulator">
    <div class="settings">
      <div>
        Algorithm:
        <select v-model="algorithm">
          <option v-for="a in algorithms" :value="a" :key="a.name">
            {{ a.name }}
          </option>
        </select>
      </div>
      <div v-if="algorithm">
        <input v-model.number="width" placeholder="width" type="number"/>
        x
        <input v-model.number="height" placeholder="height" type="number"/>
        <br/>
        <input v-model.number="n" placeholder="n" type="number"/>
      </div>
    </div>
    <div class="ui" v-if="init">
      <GridView v-if="step" v-bind:step="step"/>
      <Player v-bind:algorithm="algorithm" v-bind:width="size[0]" v-bind:height="size[1]" v-bind:n="n"
              v-on:emit-grid="onEmitStep"/>
    </div>
  </div>
</template>

<script>
import algorithms from '@/components/algorithms'
import GridView from '@/components/GridView.vue'
import Player from "@/components/Player";

export default {
  name: "Simulator",
  components: {
    Player,
    GridView
  },
  data: function () {
    return {
      algorithm: undefined,
      algorithms: algorithms,
      n: undefined,
      width: undefined,
      height: undefined,
      step: undefined
    }
  },
  computed: {
    init() {
      return (this.size && this.n);
    },
    size() {
      if (this.algorithm === undefined) return undefined;
      let [w, h] = [this.width ? this.width : 1, this.height ? this.height : 1];
      switch (this.algorithm.dimension) {
        case 0:
          return [1, 1];
        case 1:
          return [w, 1];
        case 2:
          return [w, h];
        default:
          return undefined;
      }
    }
  },
  methods: {
    onEmitStep: function (step) {
      this.step = step;
    }
  }
}
</script>

<style scoped>

</style>