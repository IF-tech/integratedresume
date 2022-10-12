<template>
  <!-- <avatar-environment></avatar-environment> -->
   <!-- <threejs-floor-only></threejs-floor-only> -->
   <campfire></campfire>

</template>

<script>
import HelloWorld from '../components/HelloWorld'
import AvatarEnvironment from '@/components/AvatarEnvironment.vue';
import Campfire from '@/components/Campfire.vue';
import ThreejsEmptyScene from '@/components/ThreejsEmptyScene.vue';
import ThreejsFloorOnly from '@/components/ThreejsFloorOnly.vue';


  export default {
    name: 'Home',

    components: {
    HelloWorld,
    AvatarEnvironment,
    Campfire,
    ThreejsEmptyScene,
    ThreejsFloorOnly
},
  }
</script>
