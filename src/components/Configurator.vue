<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-form ref="form" v-model="valid">
          <v-select name="algorithm" v-model="algorithm" :items="algorithms" :rules="rules.algorithm" label="Algorithm"
                    required/>
          <v-text-field name="width" :disabled="!algorithm" v-model="width" :rules="rules.width" label="Width"
                        type="number" min="1" required/>
          <v-text-field name="height" :disabled="!algorithm || algorithm.dimension < 2" v-model="height"
                        :rules="rules.height"
                        label="Height" type="number" min="1" required/>
          <v-text-field name="elems" v-model="elems" :rules="rules.elems" label="Elements" type="number" min="1"/>
          <v-btn name="submit" :disabled="!valid" @click="setConfig">Simulate</v-btn>
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

    algorithm: undefined,
    width: 1,
    height: 1,
    elems: undefined,

    valid: true,
    rules: {
      algorithm: [
        v => !!v || 'Algorithm is required'
      ],
      width: [
        v => !!v || 'Width is required',
        v => v > 0 || 'Width must be positive',
        v => Number.isInteger(Number(v)) || 'Width must be an integer'
      ],
      height: [
        v => !!v || 'Height is required',
        v => v > 0 || 'Height must be positive',
        v => Number.isInteger(Number(v)) || 'Height must be an integer'
      ],
      elems: [
        v => (!v || v > 0) || 'Number of elements must be positive',
        v => (!v || Number.isInteger(Number(v))) || 'Number of elements must be an integer'
      ]
    }

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
        elems: Number(this.elems ? this.elems : (this.width * this.height))
      });
    }
  }

}
</script>

<style scoped>

</style>