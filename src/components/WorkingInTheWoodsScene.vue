<template>
    <div>
      <v-container
        style="
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
        
          margin-top: 0;
          padding: 10px;
        "
        id="scenesetter"
        ><v-row justify="center">
          <v-col justify="center">
      
            <blob></blob>
            <!-- <v-color-picker
              v-model="backgroundColor"
              mode="hexa"
              dot-size="25"
              swatches-max-height="200"
              :value="this.backgroundColor"
            ></v-color-picker> -->
          </v-col> </v-row
      ></v-container>
  
      <canvas class="webgl"></canvas>

      
    </div>
  </template>
  
    
<script>
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import Blob from '@/components/Blob.vue';
import SplineBlob from './SplineBlob.vue';
import Chart from './Chart.vue';
  export default {
    name: "IntegratedResumeVueAmplifyWorkingInTheWoodsScene",
  
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
        let spike1, spike2, spike3, mixer, idle, neck, waist;
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
  
        //Load Objects
        const loader = new GLTFLoader();
        const CAMPFIRE_PATH =
          "https://iftechpublicassets.s3.us-west-2.amazonaws.com/campfire.glb";
        loader.load(
          CAMPFIRE_PATH,
          function (gltf) {
            const model = gltf.scene;
            model.scale.set(3, 3, 3);
            model.position.y = -7;
            model.position.x = -4;
            model.position.z = 20;
            model.rotation.y = 0.3;
            model.castShadow = true;
            scene.add(model);
          },
          undefined, // We don't need this function
          function (error) {
            console.error(error);
          }
        );
  
        //load firespikies
        const FIRESPIKE_PATH =
          "https://iftechpublicassets.s3.us-west-2.amazonaws.com/firespike.glb";
        loader.load(
          FIRESPIKE_PATH,
          function (gltf) {
            const model = gltf.scene;
  
            var newMaterial = new THREE.MeshStandardMaterial({
              transparent: true,
              color: 0xfcba03,
              opacity: 0.8,
            });
            model.scale.set(1.2, 1, 1.2);
            model.position.y = -3;
            model.name = "spike1";
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial;
            });
            model.position.x = -3.65;
            model.position.z = 21;
            model.castShadow = true;
  
            spike1 = model;
            scene.add(model);
          },
          undefined, // We don't need this function
          function (error) {
            console.error(error);
          }
        );
  
        loader.load(
          FIRESPIKE_PATH,
          function (gltf) {
            const model = gltf.scene;
            var newMaterial = new THREE.MeshStandardMaterial({
              transparent: true,
              color: 0xfcba03,
              opacity: 0.8,
            });
  
            model.scale.set(0.8, 0.8, 0.8);
            model.position.y = -3.6;
            model.position.x = -5.3;
            model.position.z = 20.5;
            model.name = "spike3";
            model.castShadow = true;
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial;
            });
  
            spike3 = model;
  
            scene.add(model);
          },
          undefined, // We don't need this function
          function (error) {
            console.error(error);
          }
        );
        loader.load(
          FIRESPIKE_PATH,
          function (gltf) {
            const model = gltf.scene;
            var newMaterial = new THREE.MeshStandardMaterial({
              transparent: true,
              color: 0xfcba03,
              opacity: 0.8,
            });
  
            model.scale.set(0.8, 0.8, 0.8);
            model.position.y = -3.6;
            model.position.x = -2;
            model.position.z = 20.5;
            model.name = "spike2";
            model.castShadow = true;
            model.traverse((o) => {
              if (o.isMesh) o.material = newMaterial;
            });
  
            spike2 = model;
  
            scene.add(model);
          },
          undefined, // We don't need this function
          function (error) {
            console.error(error);
          }
        );

        const STUMP_PATH = "https://iftechpublicassets.s3.us-west-2.amazonaws.com/stumpandlaptop.glb";
   
    loader.load(
        STUMP_PATH,
        function (gltf) {
          // A lot is going to happen here
         const model = gltf.scene;
          
    
          model.scale.set(5, 5, 5);
          model.position.y = -11;
          model.position.x = 9;
          model.position.z = 3;
          model.rotation.y = 180.2;
          model.castShadow = true;
          model.recieveShadow = true;
          scene.add(model);
        },
        undefined, // We don't need this function
        function (error) {
          console.error(error);
        }
      );
      let TREE_PATH = "https://iftechpublicassets.s3.us-west-2.amazonaws.com/generictree.glb";
    loader.load(
      TREE_PATH,
      function (gltf) {
        // A lot is going to happen here
        const model = gltf.scene;
        model.castShadow = true;
        model.recieveShadow = true;
        model.scale.set(50, 50, 50);
        model.position.y = -3;
        model.position.x = -.5;
        model.position.z = -3;

        scene.add(model);
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );
        //character
        //add character model
        const MODEL_PATH =
          "https://iftechpublicassets.s3.us-west-2.amazonaws.com/sittingidle.glb";
        loader.load(
          MODEL_PATH,
          function (gltf) {
            // A lot is going to happen here
            const model = gltf.scene;
            let fileAnimations = gltf.animations;
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
                neck = o;
              }
              if (o.isBone && o.name === "mixamorigNeck") {
                waist = o;
              }
            });
  
            model.scale.set(5, 5, 5);
            model.position.y = -11;
  
            scene.add(model);
  
            mixer = new THREE.AnimationMixer(model);
            let idleAnim = THREE.AnimationClip.findByName(fileAnimations, "idle");
  
            idleAnim.tracks.splice(3, 3);
            idleAnim.tracks.splice(9, 3);
  
            idle = mixer.clipAction(idleAnim);
            idle.play();
          },
          undefined, // We don't need this function
          function (error) {
            // console.error(error);
          }
        );
        document.addEventListener("mousemove", function (e) {
          let mousecoords = getMousePos(e);
          if (waist) {
        
            moveJoint(mousecoords, waist, 40);
            //   console.log(mousecoords);
          }
        });
        
        //load tree and rocks

        /**
         * Animate
         */
  
        function getMousePos(e) {
          return { x: e.clientX, y: e.clientY};
        }
  
        function moveJoint(mouse, joint, degreeLimit) {
          let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
          joint.rotation.y = THREE.MathUtils.degToRad(degrees.x)
          joint.rotation.x = THREE.MathUtils.degToRad(degrees.y)
        }
  
        function getMouseDegrees(x, y, degreeLimit) {
          let dx = 0,
            dy = 0,
            xdiff,
            xPercentage,
            ydiff,
            yPercentage;
  
          let w = { x: window.innerWidth, y: window.innerHeight };
  
          // Left (Rotates neck left between 0 and -degreeLimit)
          // 1. If cursor is in the left half of screen
          if (x <= w.x / 2) {
            // 2. Get the difference between middle of screen and cursor position
            xdiff = w.x / 3 - x;
            // 3. Find the percentage of that difference (percentage toward edge of screen)
            xPercentage = (xdiff / (w.x / 2)) * 100;
            // 4. Convert that to a percentage of the maximum rotation we allow for the neck
            dx = ((degreeLimit * 1.5 * xPercentage) / 100) * -1;
          }
  
          // Right (Rotates neck right between 0 and degreeLimit)
          if (x >= w.x / 2) {
            xdiff = x - w.x / 3;
            xPercentage = (xdiff / (w.x / 2)) * 100;
            dx = (degreeLimit * 1.3 * xPercentage) / 100;
          }
          // Up (Rotates neck up between 0 and -degreeLimit)
          if (y <= w.y / 2) {
            ydiff = w.y / 2 - y;
            yPercentage = (ydiff / (w.y / 2)) * 100;
            // Note that I cut degreeLimit in half when they look up
            dy = ((degreeLimit * yPercentage) / 100) * -1;
          }
          // Down (Rotates neck down between 0 and degreeLimit)
          if (y >= w.y / 2) {
            ydiff = y - w.y / 2;
            yPercentage = (ydiff / (w.y / 2)) * 100;
            dy = (degreeLimit * yPercentage) / 100;
          }
          return { x: dx, y: dy };
        }
  
        const clock = new THREE.Clock();
  
        const tick = () => {
          if (mixer) {
            mixer.update(clock.getDelta());
          }
  
          scene.background = new THREE.Color(this.backgroundColor);
          scene.fog = new THREE.Fog(this.backgroundColor, 60, 100);
          scene.children[4].material.color = new THREE.Color(
            this.backgroundColor
          );
  
          let newintensity = getRandomArbitrary(0.5, 1.2);
          pointLight.intensity = (pointLight.intensity + newintensity) / 2;
          renderer.render(scene, camera);
  
          if (spike1) {
            let newscale = getRandomArbitrary(1.0, 1.3);
            spike1.scale.y = (spike1.scale.y + newscale) / 2;
            renderer.render(scene, camera);
          }
  
          if (spike2) {
            let newscale = getRandomArbitrary(1.0, 1.3);
            spike2.scale.y = (spike2.scale.y + newscale) / 2;
            renderer.render(scene, camera);
          }
  
          if (spike3) {
            let newscale = getRandomArbitrary(1.0, 1.3);
            spike3.scale.y = (spike3.scale.y + newscale) / 2;
            renderer.render(scene, camera);
          }
  
          function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
          }
  
          // Render
          renderer.render(scene, camera);
          // Call tick again on the next frame
          requestAnimationFrame(tick);
        };
  
        tick();
      },
    },

    components: {
        Blob,
        SplineBlob,
        Chart
    }
  };
</script>
  


