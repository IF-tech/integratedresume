<template>
  <div>
    <div id="overlay">

<div @click="shrinkObject()">
  <span style=" position: fixed; z-index: 3;
  
  top: 0;
  left: 0;
  width: 100px;
  margin-top: 0;
  padding: 10px;" class="material-symbols-outlined">
X   </span>
</div></div>
<svg @click="growObject()" id="datablob" class="shape-blob" ref="blob" viewBox="0 0 200 200">
      
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop id="gradientStop1" offset="0%" stop-color="var(--devStartColor)" />
          <stop id="gradientStop2 " offset="100%" stop-color="var(--devStopColor)" />
        </linearGradient>
      </defs>
      <path onclick="growdev()" id="devblobpath" d="" fill="url('#gradient')"> </path>
    </svg>
    <!-- <div  @click="growObject()" id="datablob" class="shape-blob" ref="blob"></div> -->
  </div>
</template>



<script>
import gsap from "gsap";


export default {
  name: "IntegratedResumeVueAmplifyBlob",

  data() {
    return {};
  },

  mounted() {

   
},

  methods: {
    growObject(){
    console.log("grow function called")
   

    gsap.to(".shape-blob", { height: 5000, width: 5000, left: -2000, top: -1100, duration: 1 });
    console.log("grow function finished")
  },
  shrinkObject(){
    console.log("grow function called")
   

    gsap.to(".shape-blob", { height: 200, width: 200, left: "45vw", top: 50, duration: .3 });
    console.log("grow function finished")
  }
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

.container {
  background: #0a2463;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.shape-blob {
  background-image: linear-gradient(150deg, rgb(65, 255, 239), rgb(6, 184, 216));
  height: 200px;
  width: 200px;
  border-radius: 30% 50% 20% 40%;
  animation: transform 5s ease-in-out infinite both alternate,
    movement_one 10s ease-in-out infinite both;
  opacity: 1.0;
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