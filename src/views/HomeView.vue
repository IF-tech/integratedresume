<template>
  <!-- <avatar-environment></avatar-environment> -->
   <!-- <threejs-floor-only></threejs-floor-only> -->
   <!-- <campfire></campfire> -->
<working-in-the-woods-scene></working-in-the-woods-scene>
</template>

<script>
import HelloWorld from '../components/HelloWorld'
import AvatarEnvironment from '@/components/AvatarEnvironment.vue';
import Campfire from '@/components/Campfire.vue';
import ThreejsEmptyScene from '@/components/ThreejsEmptyScene.vue';
import ThreejsFloorOnly from '@/components/ThreejsFloorOnly.vue';
import WorkingInTheWoodsScene from '../components/WorkingInTheWoodsScene.vue';


  export default {
    name: 'Home',

    components: {
    HelloWorld,
    AvatarEnvironment,
    Campfire,
    ThreejsEmptyScene,
    ThreejsFloorOnly,
    WorkingInTheWoodsScene
},
  }
</script>
