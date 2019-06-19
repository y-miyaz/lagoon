import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
//import MakeDockerfile from './component/MakeDockerfile.vue';
import DockerfilePull from './components/DockerfilePull.vue';
//import DockerfileVolume from './components/DockerfileVolume.vue';
//import DockerfileCopy from './components/DockerfileCopy.vue';
//import DockerfileEnv from './components/DockerfileEnv.vue';
//import DockerfileRun from './components/DockerfileRun.vue';
//import DockerfileCmdEntryPoint from './components/DockerfileCmdEntryPoint.vue';
//import DockerfileBuild from './components/DockerfileBuild.vue';


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/dockerfile-pull',
      name: 'dockerfile-pull',
      component: DockerfilePull,
    },
    {
      path: '/test/:userId',
      name: 'test',
      component: {　
        template: '<div>{{$route.params.userId}}</div>'
      }
    }
  ]
});
