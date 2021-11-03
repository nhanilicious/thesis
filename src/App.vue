<template>
  <v-app>

    <v-app-bar app color="white" flat>
      <!-- -->
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>

          <v-col cols="12" sm="2">
            <v-sheet rounded="lg">
              <Configurator v-on:emit-config="onEmitConfig"/>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="8">
            <v-sheet min-height="70vh" rounded="lg">
              <GridView v-bind:step="step"/>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="2">
            <v-sheet rounded="lg">
              <Player v-bind:config="config" v-on:emit-step="onEmitStep"/>
            </v-sheet>
          </v-col>

        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import Configurator from "@/components/Configurator";
import GridView from "@/components/GridView";
import Player from "@/components/Player";

export default {

  name: 'App',

  components: {
    Configurator,
    GridView,
    Player
  },

  data: () => ({
    config: undefined,
    step: undefined
  }),

  methods: {
    onEmitConfig: function (config) {
      this.config = config;
    },
    onEmitStep: function (step) {
      this.step = step;
    }
  }

};
</script>
