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
              <Configurator/>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="8">
            <v-sheet min-height="70vh" rounded="lg" class="d-flex">
              <Simulator ref="simulator"/>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="2">
            <v-sheet rounded="lg">
              <Player ref="player"/>
            </v-sheet>
          </v-col>

        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import Configurator from "@/components/Configurator";
import Simulator from "@/components/Simulator";
import Player from "@/components/Player";

export default {

  name: 'App',

  components: {
    Configurator,
    Simulator,
    Player
  },

  methods: {
    loop: function () {
      this.$refs.simulator.update();
      this.$refs.player.update();
      requestAnimationFrame(this.loop);
    }
  },

  mounted: function () {
    this.loop();
  }

};
</script>
