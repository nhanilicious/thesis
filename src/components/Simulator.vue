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
import * as Three from 'three';
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {

  name: "Simulator",

  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      camera: null,
      scene: null,
      renderer: null,
      nodes: null
    }
  },

  computed: {

    ...mapState({
      paused: state => state.player.paused,
      t: state => state.player.t,
      delta: state => state.player.t % 2
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
    },

    nodeWidth() {

      if (this.currStep) {
        let grid = this.currStep.grid;
        return Math.min(2.0 / (2 * grid.width - 1), 1.0 / (2 * grid.height - 1));
      } else {
        return 0;
      }

    },

    nodePositions() {

      if (this.currStep) {

        let [grid, positions] = [this.currStep.grid, []];
        let [w, h, s] = [grid.width, grid.height, this.nodeWidth];

        for (let i = 0; i < h; ++i) {
          positions.push([]);
          for (let j = 0; j < w; ++j)
            positions[i].push([(2 * j - w + 1) * s, (2 * i - h + 1) * s]);
        }

        return positions;

      } else {

        return null;

      }
    },

    elemWidth() {
      return 0;
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
      this.animateGraphics();
    },

    initGraphics() {

      let container = document.getElementById('canvasContainer');
      [this.canvasWidth, this.canvasHeight] = [container.clientWidth - 24, container.clientHeight - 24];

      this.camera = new Three.PerspectiveCamera(50, this.canvasWidth / this.canvasHeight, 0.01, 10);
      this.camera.position.z = 1.5;
      this.scene = new Three.Scene();

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(this.canvasWidth, this.canvasHeight);
      container.appendChild(this.renderer.domElement);
      this.renderer.render(this.scene, this.camera);

    },

    initGraphicsObjects() {

      while (this.scene.children.length)
        this.scene.remove(this.scene.children[0]);
      this.nodes = [];

      if (this.currStep) {

        console.log(this.nodePositions);

        let grid = this.currStep.grid;
        let [w, h] = [grid.width, grid.height];

        for (let i = 0; i < h; ++i) {

          this.nodes.push([]);

          for (let j = 0; j < w; ++j) {

            let geometry = new Three.BoxGeometry(this.nodeWidth, this.nodeWidth, this.nodeWidth);
            let edges = new Three.EdgesGeometry(geometry);
            let node = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0xffffff}));
            console.log(node.position);
            [node.position.x, node.position.y] = [this.nodePositions[i][j][0], this.nodePositions[i][j][1]];

            this.nodes[i].push(node);
            this.scene.add(this.nodes[i][j]);

          }
        }

      }
    },

    resizeGraphics() {

      let container = document.getElementById('canvasContainer');
      [this.canvasWidth, this.canvasHeight] = [container.clientWidth - 24, container.clientHeight - 24];

      if (this.camera && this.renderer) {
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.render(this.scene, this.camera);
      }

    },

    animateGraphics() {

      if (this.renderer) {
        if (!this.paused) {
          this.mesh.rotation.x = this.delta;
          this.mesh.rotation.y = this.delta;
        }
        this.renderer.render(this.scene, this.camera);
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