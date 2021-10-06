<template>
  <div class="grid">
    <div class="turn">{{ turn }}</div>
    <div class="mesh">
      <table>
        <tr v-for="dx in values" :key="dx">
          <td v-for="val in dx" :key="val">{{ val }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Grid",
  computed: {
    values() {
      return this.$store.state.values;
    },
    turn() {
      return this.$store.state.turn;
    }
  }
}

</script>

<style scoped>

</style>