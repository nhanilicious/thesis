<template>
  <v-container id="canvasContainer" class="d-flex" v-resize="resizeGraphics">
    <!-- <div v-if="currStep">
      <div class="row" v-for="(dx, i) in currStep.grid.values" :key="i">
        <div class="cell" v-for="(val, j) in dx" :key="j">{{ val }}</div>
      </div>
    </div> -->
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import Graphics3D from "@/utils/graphics/Graphics3D";

export default {

  name: "Simulator",

  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      graphics: null
    }
  },

  computed: {
    ...mapState({
      t: state => state.player.t,
      delta: state => state.player.t % 1
    }),
    config() {
      return this['config/config']();
    },
    currStep() {
      return this['memento/step']()(Math.floor(this.t));
    },
    nextStep() {
      return this['memento/step']()(Math.floor(this.t) + 1);
    },
    stepCount() {
      return this['memento/size']();
    }
  },

  watch: {
    config: function (value) {
      if (value) {
        this['player/reset']();
        this['memento/init']();
        this['memento/calc']();
        this.initGraphicsObjects();
        this['player/enable']();
      }
    },
    stepCount: function (value) {
      this['player/setMaxTurn'](value - 1);
    },
    currStep: function () {
      this.updateGraphicsObjects();
    },
    nextStep: function () {
      this.highlightGraphicsObjects();
    }
  },

  methods: {
    ...mapGetters([
      'config/config',
      'memento/size',
      'memento/step'
    ]),
    ...mapMutations([
      'player/setMaxTurn'
    ]),
    ...mapActions([
      'memento/init',
      'memento/calc',
      'player/enable',
      'player/reset'
    ]),
    update() {
      this.renderGraphics();
    },
    initGraphics() {
      let container = document.getElementById('canvasContainer');
      [this.canvasWidth, this.canvasHeight] = [container.clientWidth - 24, container.clientHeight - 24];
      this.graphics = new Graphics3D(this.canvasWidth, this.canvasHeight);
      container.appendChild(this.graphics.getDomElement());
      this.graphics.render();
    },
    initGraphicsObjects() {
      if (this.graphics && this.currStep) this.graphics.initObjects(this.currStep.grid);
    },
    updateGraphicsObjects() {
      if (this.graphics) this.graphics.updateObjects(this.currStep ? this.currStep.grid : null, this.nextStep ? this.nextStep.grid : null);
    },
    highlightGraphicsObjects() {
      if (this.graphics) this.graphics.highlight(this.nextStep ? this.nextStep.highlights : null);
    },
    resizeGraphics() {
      if (this.graphics) {
        let container = document.getElementById('canvasContainer');
        [this.canvasWidth, this.canvasHeight] = [container.clientWidth - 24, container.clientHeight - 24];
        this.graphics.resize(this.canvasWidth, this.canvasHeight);
      }
    },
    renderGraphics() {
      if (this.graphics) {
        this.graphics.animate(this.delta);
        this.graphics.render();
      }
    }
  },

  mounted: function () {
    this.initGraphics();
  }

}

</script>

<style scoped>

</style>