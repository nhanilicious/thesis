<template>
  <div class="simulator">
    <div>
      Algorithm:
      <select v-model="algorithm">
        <option v-for="a in algorithms" :value="a.id" :key="a">
          {{ a.name }}
        </option>
      </select>
    </div>
    <div v-if="algorithm">
      <input v-model.number="width" placeholder="width" type="number">
      x
      <input v-model.number="width" placeholder="height" type="number">
    </div>
    <GridView/>
  </div>
</template>

<script>
import algorithms from '@/components/algorithms'
import GridView from './GridView.vue'

export default {
  name: "Simulator",
  data: function () {
    return {
      algorithm: undefined,
      algorithms: algorithms,
      n: undefined,
      width: undefined,
      height: undefined
    }
  },
  computed: {
    size() {
      return [this.width, this.height];
    }
  },
  components: {
    GridView
  }
}
</script>

<style scoped>

</style>