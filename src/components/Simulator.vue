<template>
  <div class="simulator">
    <Configurator v-on:emit-config="onEmitConfig"/>
    <div class="ui" v-if="config">
      <Player v-bind:config="config" v-on:emit-step="onEmitStep"/>
      <GridView v-if="step" v-bind:step="step"/>
    </div>
  </div>
</template>

<script>
import GridView from '@/components/GridView.vue'
import Player from "@/components/Player";
import Configurator from "@/components/Configurator";

export default {
  name: "Simulator",
  components: {
    Configurator,
    Player,
    GridView
  },
  data: function () {
    return {
      config: undefined,
      step: undefined
    }
  },
  methods: {
    onEmitConfig: function (config) {
      this.config = config;
    },
    onEmitStep: function (step) {
      this.step = step;
    }
  }
}
</script>

<style scoped>

</style>