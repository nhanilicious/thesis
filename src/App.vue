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
            <v-sheet min-height="70vh" rounded="lg">
              <Simulator/>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="2">
            <v-sheet rounded="lg">
              <Player/>
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
import {mapMutations, mapState} from "vuex";

export default {

  name: 'App',

  components: {
    Configurator,
    Simulator,
    Player
  },

  computed: {
    ...mapState({
      paused: state => state.player.paused
    })
  },

  methods: {
    ...mapMutations([
      'player/increaseBy'
    ]),
    loop: function () {
      if (!this.paused) this['player/increaseBy']();
      requestAnimationFrame(this.loop);
    }
  },

  mounted: function () {
    this.loop();
  }

};
</script>
