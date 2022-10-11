<template>
  <div>
    <div class="wrapper">
      <div id="container">
        <!-- The canvas element is used to draw the 3D scene -->

        <canvas id="c"></canvas>
      </div>
    </div>
  </div>
</template>

<!-- Primary Scene Renderer -->
<script type="module" src="./scripts/particles.js"></script>

<script></script>

<script>
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { ObjectLoader } from "three";

import {
  hemiLight,
  dirLight,
  ambientLight,
  pointLight,
} from "./scripts/lighting.js";

import { points } from "./scripts/particles.js";
import { loadRock, loadStump, loadTree } from "./scripts/loadprops.js";
import {
  moveJoint,
  getMousePos,
  getMouseDegrees,
} from "./scripts/character.js";

export default {
  name: "IntegratedResumeVueAmplifyAvatarEnvironment",

  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      mixer: null,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    animate: function () {
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      requestAnimationFrame(animate);
    },
    init: function () {
      let mixer;
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const canvas = document.querySelector("#c");
      const backgroundColor = 0x121212;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);
      scene.fog = new THREE.Fog(backgroundColor, 40, 100);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.shadowMap.enabled = true;
      renderer.setPixelRatio(window.devicePixelRatio);
      document.body.appendChild(renderer.domElement);

      // Add a camera
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

      // Floor
      let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
      let floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 0,
      });

      let floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
      floor.receiveShadow = true;
      floor.position.y = -11;
      scene.add(floor);

      //Load Character

      const MODEL_PATH =
        "https://iftechpublicassets.s3.us-west-2.amazonaws.com/sittingidle.glb";

      let loader = new GLTFLoader();

      loader.load(
        MODEL_PATH,
        function (gltf) {
          const model = gltf.scene;

          const fileAnimations = gltf.animations;
          model.traverse((o) => {
            //   console.log(o);
            //   if (o.isBone) {
            //     console.log(o.name);
            //   }
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = false;
            }
            // Reference the neck and waist bones
            if (o.isBone && o.name === "mixamorigHead") {
              let neck = o;
            }
            if (o.isBone && o.name === "mixamorigNeck") {
              let waist = o;
            }
          });

          model.scale.set(5, 5, 5);
          model.position.y = -11;

          scene.add(model);
          this.mixer = new THREE.AnimationMixer(model);

          let idleAnim = THREE.AnimationClip.findByName(fileAnimations, "idle");

          idleAnim.tracks.splice(3, 3);
          idleAnim.tracks.splice(9, 3);

          let idle = mixer.clipAction(idleAnim);
          idle.play();
        },
        undefined, // We don't need this function
        function (error) {
          console.error(error);
        }
      );

      /**
       * Sizes
       */

    //   window.addEventListener("resize", () => {
    //     // Update sizes
    //     sizes.width = window.innerWidth;
    //     sizes.height = window.innerHeight;

    //     // Update camera
    //     camera.aspect = sizes.width / sizes.height;
    //     camera.updateProjectionMatrix();

    //     // Update renderer
    //     renderer.setSize(sizes.width, sizes.height);
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //   });
      /**
       * Animate
       */

      let clock = new THREE.Clock();
      let ticks = 0;

      const tick = () => {
        ticks += 1;
        const elapsedTime = clock.getElapsedTime();

        if (mixer) {
          mixer.update(clock.getDelta());
        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let canvasPixelWidth = canvas.width / window.devicePixelRatio;
        let canvasPixelHeight = canvas.height / window.devicePixelRatio;

        const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  height: 100vh;
  font-family: "Work Sans", sans-serif;
  color: aliceblue;
  overflow-y: auto;
}

#c {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}

.container {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
}

.content {
  opacity: 0.9;
  width: 100%;
  padding-top: 70vh;
  position: relative;
  text-align: center;
}
</style>
