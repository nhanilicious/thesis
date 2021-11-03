<template>
  <v-container>
    <div v-if="step">
      <div class="row" v-for="(dx, i) in step.grid.values" :key="i">
        <div class="cell" v-for="(val, j) in dx" :key="j">{{ val }}</div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {

  name: "GridView",

  props: {
    step: undefined
  }

}

</script>

<style scoped>
.grid {
  display: table;
  text-align: center;
  width: 60%;
  margin: 10% auto 0;
  border-collapse: separate;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
}

.row {
  display: table-row;
}

.cell {
  display: table-cell;
}
</style>