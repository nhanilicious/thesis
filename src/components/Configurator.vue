<template>
  <div class="configurator">
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
</template>

<script>
import algorithms from '@/components/algorithms'

export default {
  name: "Configurator",
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
      let [w, h] = [this.width ? this.width : 4, this.height ? this.height : 1];
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
  }
}
</script>

<style scoped>

</style>