<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
    <side-menu @send-message="select_category"/>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <contents :category="selected_category"></contents>
    </v-content>
    <column-list/>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018 Yohei Miyazaki</span>
    </v-footer>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
import SideMenu from './components/SideMenu';
import Contents from './components/Contents';
import ColumnList from './components/ColumnList';
import Anime from './components/anime';
import './directives/img_directive';

export default {
  name: 'App',
  components: {
    //'hello-world': HelloWorld,
    'side-menu': SideMenu,
    'contents': Contents,
    'column-list': ColumnList,
  },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Lagoon',
      selected_category: "",
    }
  },
  methods: {
    select_category: function (category) {
      console.log("app: " + category);
      this.selected_category = category;
    }
  }
}
</script>

<style scoped lang="scss">

img {
  opacity: 1;
  transition: opacity 1s;
}
img.hide {
  opacity: 0;
}

</style>