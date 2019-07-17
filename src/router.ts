import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import DockerfilePull from './components/DockerfilePull.vue';


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
