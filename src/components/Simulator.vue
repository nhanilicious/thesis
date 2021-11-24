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
      nodes: null,
      elems: null
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
            positions[i].push([(2 * j - w + 1) * s, -(2 * i - h + 1) * s]);
        }

        return positions;

      } else {

        return null;

      }
    },

    elemWidth() {
      return this.nodeWidth * 0.25;
    },

    elemCurrPositions() {

      if (this.currStep) {

        let [grid, positions] = [this.currStep.grid, []];
        let [w, h] = [grid.width, grid.height];

        for (let i = 0; i < grid.elems; ++i) positions.push([]);

        for (let i = 0; i < h; ++i) {
          for (let j = 0; j < w; ++j)
            for (let k = 0; k < grid.values[j][i].length; ++k)
              positions[grid.values[j][i][k] - 1] = [this.nodePositions[j][i][0], this.nodePositions[j][i][1]];
        }

        return positions;

      } else {

        return null;

      }

    },

    elemNextPositions() {

      if (this.nextStep) {

        let [grid, positions] = [this.nextStep.grid, []];
        let [w, h] = [grid.width, grid.height];

        for (let i = 0; i < grid.elems; ++i) positions.push([]);

        for (let i = 0; i < h; ++i) {
          for (let j = 0; j < w; ++j)
            for (let k = 0; k < grid.values[j][i].length; ++k)
              positions[grid.values[j][i][k] - 1] = [this.nodePositions[j][i][0], this.nodePositions[j][i][1]];
        }

        return positions;

      } else {

        return null;

      }

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
    elemCurrPositions: function (value) {
      console.log(value);
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
      this.elems = [];

      if (this.currStep) {

        let grid = this.currStep.grid;
        let [w, h, n] = [grid.width, grid.height, grid.elems];

        for (let i = 0; i < h; ++i) {

          this.nodes.push([]);

          for (let j = 0; j < w; ++j) {

            let geometry = new Three.BoxGeometry(this.nodeWidth, this.nodeWidth, this.nodeWidth);
            let edges = new Three.EdgesGeometry(geometry);
            let node = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0xffffff}));
            [node.position.x, node.position.y] = [this.nodePositions[i][j][0], this.nodePositions[i][j][1]];

            this.nodes[i].push(node);
            this.scene.add(this.nodes[i][j]);

          }
        }

        for (let i = 0; i < n; ++i) {

          let canvas = document.createElement("canvas");
          [canvas.width, canvas.height] = [40, 40];
          let context = canvas.getContext("2d");

          context.font = "14pt Arial";

          context.fillStyle = "white";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "black";
          context.fillText(i + 1, canvas.width / 2, canvas.height / 2);

          let texture = new Three.Texture(canvas);
          texture.needsUpdate = true;
          let material = new Three.MeshBasicMaterial({map: texture});
          let elem = new Three.Mesh(new Three.CircleGeometry(this.elemWidth, 20), material);
          [elem.overdraw, elem.position.x, elem.position.y] = [true, this.elemCurrPositions[i][0], this.elemCurrPositions[i][1]];

          this.elems.push(elem);
          this.scene.add(this.elems[i]);

        }

      }
    },

    updateGraphicsObjects() {

      if (this.elems && this.elemNextPositions && this.elemCurrPositions) {

        for (let i = 0; i < this.elems.length; i++) {
          let [x0, y0] = [this.elemCurrPositions[i][0], this.elemCurrPositions[i][1]];
          let [x1, y1] = [this.elemNextPositions[i][0], this.elemNextPositions[i][1]];
          let [dx, dy] = [(x1 - x0) * this.delta, (y1 - y0) * this.delta];
          this.elems[i].position.x = x0 + dx;
          this.elems[i].position.y = y0 + dy;
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

    renderGraphics() {

      if (this.renderer) {
        this.updateGraphicsObjects();
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