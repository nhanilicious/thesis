<template>
  <div id="app">
    <Simulator/>
  </div>
</template>

<script>
import Simulator from './components/Simulator.vue'

export default {
  name: 'App',
  components: {
    Simulator
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
