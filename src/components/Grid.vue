<template>
  <div class="grid">
    <table>
      <tr v-for="row in grid" :key="row">
        <td v-for="cell in row" :key="cell">{{ cell }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Grid",
  computed: {
    grid() {
      return this.$store.state.grid;
    }
  }
}

</script>

<style scoped>

</style>