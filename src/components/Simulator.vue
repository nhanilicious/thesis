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
      pipes: null,
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

    pipePositions() {

      if (this.nodePositions) {

        let [grid, positions] = [this.currStep.grid, [[], []]];
        let [w, h, s] = [grid.width, grid.height, this.nodeWidth];

        for (let i = 0; i < h; ++i) {
          positions[0].push([]);
          for (let j = 0; j < w - 1; ++j)
            positions[0][i].push([this.nodePositions[i][j][0] + s, this.nodePositions[i][j][1]]);
        }

        for (let i = 0; i < h - 1; ++i) {
          positions[1].push([]);
          for (let j = 0; j < w; ++j)
            positions[1][i].push([this.nodePositions[i][j][0], this.nodePositions[i][j][1] - s]);
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
    nextStep: function (step) {

      if (this.nodes && this.pipes) {

        for (let i = 0; i < this.nodes.length; ++i)
          for (let j = 0; j < this.nodes[i].length; ++j)
            this.nodes[i][j].material.color.setHex(0x333333);

        for (let d = 0; d < this.pipes.length; ++d)
          for (let i = 0; i < this.pipes[d].length; ++i)
            for (let j = 0; j < this.pipes[d][i].length; ++j)
              this.pipes[d][i][j].material.color.setHex(0x333333);

        if (step) {

          for (let idx in step.highlights) {

            let highlight = step.highlights[idx];
            let [x0, y0] = highlight.topLeft;
            let [x1, y1] = highlight.bottomRight;

            for (let i = x0; i <= x1; ++i)
              for (let j = y0; j <= y1; ++j) {

                if (j < y1) this.pipes[0][i][j].material.color.setHex(0xffffff);
                if (i < x1) this.pipes[1][i][j].material.color.setHex(0xffffff);
                this.nodes[i][j].material.color.setHex(0xffffff);

              }

          }

        }

      }

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
      this.pipes = [[], []];
      this.elems = [];

      if (this.currStep) {

        let grid = this.currStep.grid;
        let [w, h, n] = [grid.width, grid.height, grid.elems];

        // nodes
        for (let i = 0; i < h; ++i) {

          this.nodes.push([]);

          for (let j = 0; j < w; ++j) {

            let geometry = new Three.BoxGeometry(this.nodeWidth, this.nodeWidth, this.nodeWidth / 2);
            let edges = new Three.EdgesGeometry(geometry);
            let node = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0x333333}));
            [node.position.x, node.position.y] = [this.nodePositions[i][j][0], this.nodePositions[i][j][1]];

            this.nodes[i].push(node);
            this.scene.add(this.nodes[i][j]);

          }
        }

        // horizontal pipes
        for (let i = 0; i < h; ++i) {

          this.pipes[0].push([]);

          for (let j = 0; j < w - 1; ++j) {

            let geometry = new Three.CylinderGeometry(this.nodeWidth / 4, this.nodeWidth / 4, this.nodeWidth);
            let edges = new Three.EdgesGeometry(geometry);
            let pipe = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0x333333}));
            [pipe.position.x, pipe.position.y] = [this.pipePositions[0][i][j][0], this.pipePositions[0][i][j][1]];
            [pipe.rotation.x, pipe.rotation.z] = [Math.PI / 2, Math.PI / 2];

            this.pipes[0][i].push(pipe);
            this.scene.add(this.pipes[0][i][j]);

          }
        }

        // vertical pipes
        for (let i = 0; i < h - 1; ++i) {

          this.pipes[1].push([]);

          for (let j = 0; j < w; ++j) {

            let geometry = new Three.CylinderGeometry(this.nodeWidth / 4, this.nodeWidth / 4, this.nodeWidth, 7);
            let edges = new Three.EdgesGeometry(geometry);
            let pipe = new Three.LineSegments(edges, new Three.LineBasicMaterial({color: 0x333333}));
            [pipe.position.x, pipe.position.y] = [this.pipePositions[1][i][j][0], this.pipePositions[1][i][j][1]];

            this.pipes[1][i].push(pipe);
            this.scene.add(this.pipes[1][i][j]);

          }
        }

        // elems
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
          let delayed = this.delta * 2.0 - 0.5;
          if (delayed > 1.0) {
            this.elems[i].position.x = x1;
            this.elems[i].position.y = y1;
          } else if (delayed > 0.0) {
            let [dx, dy] = [(x1 - x0) * delayed, (y1 - y0) * delayed];
            this.elems[i].position.x = x0 + dx;
            this.elems[i].position.y = y0 + dy;
          } else {
            this.elems[i].position.x = x0;
            this.elems[i].position.y = y0;
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