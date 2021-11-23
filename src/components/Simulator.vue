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
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },

  computed: {
    ...mapState({
      paused: state => state.player.paused,
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
    size() {
      return this['memento/size']();
    }
  },

  watch: {
    config: function (value) {
      if (value) {
        this['player/reset']();
        this['memento/init']();
        this['memento/calc']();
        // init Mesh
        this['player/enable']();
      }
    },
    size: function (value) {
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
    resizeGraphics() {
      if (this.camera && this.renderer) {
        let container = document.getElementById('canvasContainer');
        let [width, height] = [container.clientWidth - 24, container.clientHeight - 24];
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);
      }
    },
    update() {
      if (this.renderer && !this.paused) {
        this.mesh.rotation.x = this.delta;
        this.mesh.rotation.y = this.delta;
        this.renderer.render(this.scene, this.camera);
      }
    }
  },

  mounted: function () {

    let container = document.getElementById('canvasContainer');
    let [width, height] = [container.clientWidth - 24, container.clientHeight - 24];

    this.camera = new Three.PerspectiveCamera(70, width / height, 0.01, 10);
    this.camera.position.z = 1;

    this.scene = new Three.Scene();

    let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
    let material = new Three.MeshNormalMaterial();

    this.mesh = new Three.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.renderer = new Three.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.renderer.render(this.scene, this.camera);

  }

}

</script>

<style scoped>

</style>