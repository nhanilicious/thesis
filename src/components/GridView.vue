<template>
  <div class="gridview">
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
  name: "GridView",
  computed: {
    values() {
      let initValues = this.$store.state.values;
      return initValues;
    },
    turn() {
      return this.$store.state.turn;
    }
  }
}

</script>

<style scoped>

</style>