<template>
  <v-list expand light>
    <v-list-group
      v-for="item in items"
      v-model="item.active"
      :key="item.title"
      :prepend-icon="item.action"
    >
      <v-list-tile slot="activator">
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile
        v-for="subItem in item.items"
        :key="subItem.title"
        :to="subItem.link"
        @click="select_category(subItem.category)"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>{{ subItem.action }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  name: "side-menu",
  data() {
    return {
      items: [
        {
          action: "local_activity",
          title: "DBツール",
          items: [
            {
              title: "Pappet(テストデータ自動生成)",
              link: "/pappet"
            },
            {
              title: "ふかふかくん(DB負荷ツール)",
              link: "/fukafuka"
            }
          ]
        }],
    };
  },
  methods: {
    select_category: function(category) {
      this.selected_category = category;
      console.log("select category!");
      console.log(category);
      this.$emit("send-message", category);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
