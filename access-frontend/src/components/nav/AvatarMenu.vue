<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <v-avatar color="primary" size="36">
            <span class="white--text">EA</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="clickThing">
          <v-list-item-title
            ><span><v-icon>mdi-logout</v-icon> Logout</span></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'AvatarMenu',
  data: () => ({}),
  methods: {
    clickThing() {
      console.log('blah');
    },
  },
};
</script>
