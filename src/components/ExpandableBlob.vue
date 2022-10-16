<template>
  <div>
    <div id="overlay">
      <div
        style="visibility: hidden"
        id="closedatawindow"
        @click="shrinkObject()"
      >
        <span
          style="
            position: fixed;
            z-index: 3;

            top: 0;
            left: 0;
            width: 100px;
            margin-top: 0;
            padding: 10px;
          "
          class="material-symbols-outlined"
        >
          X
        </span>
      </div>
    </div>

    <div id="chartoverlay" style="visibility: hidden">
      <v-container>
   </v-container>
      <responsive-chart></responsive-chart>
    </div>

    <svg
      @click="growObject()"
      id="datablob"
      class="shape-blob"
      ref="blob"
      viewBox="0 0 200 200"
    ></svg>
  </div>
</template>

<script>
import gsap from "gsap";
import ResponsiveChart from "./ResponsiveChart.vue";
export default {
  name: "IntegratedResumeVueAmplifyExpandableBlob",

  data() {
    return {};
  },

  mounted() {},
  components: {
    ResponsiveChart,
  },

  methods: {
    growObject() {

      gsap.to(".shape-blob", {
        height: 5000,
        width: 5000,
        left: -2000,
        top: -1100,
        duration: 1,
      });
      document.getElementById("closedatawindow").style.visibility = "visible";
      document.getElementById("chartoverlay").style.visibility = "visible";
      document.getElementById("datablob").style.zIndex = -4;
      document.getElementById("chartoverlay").style.zIndex = 4;
     
    },
    shrinkObject() {
  

      gsap.to(".shape-blob", {
        height: 200,
        width: 200,
        left: "45vw",
        top: 50,
        duration: 0.3,
      });
      document.getElementById("closedatawindow").style.visibility = "hidden";
      document.getElementById("chartoverlay").style.visibility = "hidden";
      document.getElementById("datablob").style.zIndex = 4;
     
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
}

body {
  margin: 0;
  padding: 0;
}


.shape-blob {
  background-image: linear-gradient(
    150deg,
    rgb(65, 255, 239),
    rgb(6, 184, 216)
  );
  height: 200px;
  width: 200px;
  border-radius: 30% 50% 20% 40%;
  animation: transform 5s ease-in-out infinite both alternate,
    movement_one 10s ease-in-out infinite both;
  opacity: 1;
  position: absolute;
  left: 45vw;
  top: 50px;
}

@keyframes transform {
  0%,
  100% {
    border-radius: 33% 67% 70% 30% / 30% 30% 70% 70%;
  }
  20% {
    border-radius: 37% 63% 51% 49% / 37% 65% 35% 63%;
  }
  40% {
    border-radius: 36% 64% 64% 36% / 64% 48% 52% 36%;
  }
  60% {
    border-radius: 37% 63% 51% 49% / 30% 30% 70% 70%;
  }
  80% {
    border-radius: 40% 60% 42% 58% / 41% 51% 49% 59%;
  }
}

@keyframes movement_one {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: translate(10%, 10%) rotateY(10deg) scale(1.2);
  }
}
</style>