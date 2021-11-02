<template>
  <div class="configurator">
    <div>
      Algorithm:
      <select v-model="config.algorithm">
        <option v-for="a in algorithms" :value="a" :key="a.name">
          {{ a.name }}
        </option>
      </select>
    </div>
    <div v-if="config.algorithm">
      <input v-model.number="config.width" placeholder="width" type="number"/>
      x
      <input v-model.number="config.height" placeholder="height" type="number"/>
      <br/>
      <input v-model.number="config.n" placeholder="n" type="number"/>
    </div>
    <div v-if="init">
      <button v-on:click="$emit('emit-config', config)">Simulate</button>
    </div>
  </div>
</template>

<script>
import algorithms from '@/components/algorithms'

export default {
  name: "Configurator",
  data: function () {
    return {
      algorithms: algorithms,
      config: {
        algorithm: undefined,
        n: undefined,
        width: undefined,
        height: undefined
      }
    }
  },
  computed: {
    init() {
      return (this.size && this.config.n);
    },
    size() {
      let [a, w, h] = [this.config.algorithm, this.config.width, this.config.height];
      if (a === undefined || w === undefined || h === undefined) return undefined;
      switch (a.dimension) {
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
  }
}
</script>

<style scoped>

</style>