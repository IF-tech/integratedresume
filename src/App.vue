<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
html {
  margin: 0;
  padding: 0;
  background: #25252B;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

body {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}





</style>