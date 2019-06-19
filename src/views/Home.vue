<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import DockerfilePull from '@/components/DockerfilePull.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    DockerfilePull,
  },
})
export default class Home extends Vue {}
</script>
