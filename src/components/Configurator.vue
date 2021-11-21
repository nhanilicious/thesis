<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-form ref="form" v-model="valid">
          <v-select v-model="algorithm" :items="algorithms" :rules="[v => !!v || 'Algorithm is required']"
                    label="Algorithm"
                    required/>
          <v-text-field :disabled="!algorithm" v-model="width" :rules="widthRules" label="Width" type="number" min="1"
                        required/>
          <v-text-field :disabled="!algorithm || algorithm.dimension < 2" v-model="height" :rules="heightRules"
                        label="Height" type="number" min="1" required/>
          <v-text-field v-model="n" :rules="[v => (!v || v > 0) || 'Number of elements must be positive']"
                        label="Elements"
                        type="number" min="1"/>
          <v-btn :disabled="!valid" @click="setConfig">Simulate</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {

  name: "Configurator",

  data: () => ({
    valid: true,
    algorithm: undefined,
    width: 1,
    widthRules: [
      v => !!v || 'Width is required',
      v => v > 0 || 'Width must be positive'
    ],
    height: 1,
    heightRules: [
      v => !!v || 'Height is required',
      v => v > 0 || 'Height must be positive'
    ],
    n: undefined
  }),

  computed: {
    algorithms() {
      return this['config/algorithms']();
    }
  },

  watch: {
    algorithm: function (algorithm) {
      if (algorithm.dimension < 2) this.height = 1;
    }
  },

  methods: {
    ...mapGetters([
      'config/algorithms'
    ]),
    setConfig() {
      this.$store.dispatch('config/setConfig', {
        algorithm: this.algorithm,
        width: Number(this.width),
        height: Number(this.height),
        elems: Number(this.n ? this.n : (this.width * this.height))
      });
    }
  }

}
</script>

<style scoped>

</style>