<template>
  <div>
      <v-container
        style="
          position: fixed;
          z-index: 3;

          top: 0;
          left: 0;
          width: 100vw;
          margin-top: 0;
          padding: 10px;
        "
        id="scenesetter"
        ><v-row>
          <v-col>
            <v-color-picker
              v-model="backgroundColor"
              mode="hexa"
              dot-size="25"
              swatches-max-height="200"
              :value="this.backgroundColor"
            ></v-color-picker
          ></v-col> </v-row
      ></v-container>

      <canvas class="webgl"></canvas>
    </div>
</template>


<script>
</script>
  
  <script>
import * as THREE from "three";
export default {
  name: "IntegratedResumeVueAmplifyThreejsFloorOnly",

  data() {
    return {
      backgroundColor: "#a2a4eb",
    };
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
      scene.background = new THREE.Color(this.backgroundColor);
      scene.fog = new THREE.Fog(this.backgroundColor, 60, 100);

      // Lights

      let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
      hemiLight.position.set(100, 100, 100);
      // Add hemisphere light to scene

      let d = 10.25;
      let pointd = 18.25;
      // Add lights
      // Add hemisphere light to scene

      let ambientLight = new THREE.AmbientLight(0xffffff, 0.25);

      let dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.color.setHSL(0, 0.5, 0.95);
      dirLight.position.set(-50, 50, 30);
      dirLight.castShadow = false;
      dirLight.shadow.radius = 2;
      dirLight.shadow.mapSize = new THREE.Vector2(500, 500);
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 1500;
      dirLight.shadow.camera.left = d * -1;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = d * -1;

      let pointLight = new THREE.PointLight(0xffbc12, 1, 0, 2);
      pointLight.position.set(-8, 0.8, 27);
      pointLight.castShadow = true;
      pointLight.shadow.radius = 5;
      pointLight.shadow.mapSize = new THREE.Vector2(500, 500);
      pointLight.shadow.camera.near = 0.1;
      pointLight.shadow.camera.far = 1500;
      pointLight.shadow.camera.left = pointd * -1;
      pointLight.shadow.camera.right = pointd;
      pointLight.shadow.camera.top = pointd;
      pointLight.shadow.camera.bottom = pointd * -1;

      scene.add(hemiLight);
      scene.add(dirLight);
      // scene.add(ambientLight);
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
      camera.position.y = 15;
      camera.rotation.x = -0.3;
      scene.add(camera);

      // Add Floor Geometry
      let floorGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
      let floorMaterial = new THREE.MeshPhongMaterial({
        color: this.backgroundColor,
        shininess: 10,
      });

      let floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI;
      floor.receiveShadow = true;
      floor.position.y = -11;
      scene.add(floor);

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
      console.log(scene.children[4]);
      const tick = () => {
        scene.background = new THREE.Color(this.backgroundColor);
        scene.fog = new THREE.Fog(this.backgroundColor, 60, 100);
        scene.children[4].material.color = new THREE.Color(
          this.backgroundColor
        );
        // Render
        renderer.render(scene, camera);
        // Call tick again on the next frame
        requestAnimationFrame(tick);
      };

      tick();
    },
  },
};
</script>
