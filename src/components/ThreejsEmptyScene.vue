<template>
  <!DOCTYPE html>
  <html lang="en">
    <body>
      <canvas class="webgl"></canvas>
    </body>
  </html>
</template>

<script>
import * as THREE from "three";

export default {
  name: "IntegratedResumeVueAmplifyThreejsEmptyScene",

  data() {
    return {};
  },

  mounted() {
    this.init();
  },

  methods: {
    init: function () {
      // Canvas
      const canvas = document.querySelector("canvas.webgl");

      // Scene
      const scene = new THREE.Scene();
      // Lights

      const pointLight = new THREE.PointLight(0xffffff, 0.1);
      pointLight.position.x = 2;
      pointLight.position.y = 3;
      pointLight.position.z = 4;
      scene.add(pointLight);

      /**
       * Sizes
       */
       const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 55;
    camera.position.x = 0;
    camera.position.y =15;
    camera.rotation.x = -0.3;
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(new THREE.Color("#32a852"), 1);

      /**
       * Animate
       */

    const clock = new THREE.Clock();
  

      const tick = () => {
        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>