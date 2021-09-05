<template>
  <div>
    <v-row v-if="$isAdmin" justify="end">
      <v-col cols="auto">
        <v-btn small depressed @click="addLink">
          <v-icon left>mdi-plus</v-icon>
          Add Link
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col v-for="(link, i) in links" :key="i" cols="6" md="4" lg="2">
        <v-card
          :href="link.href || undefined"
          :target="link.href ? '_blank' : undefined"
          :to="link.to || undefined"
          class="home-link-card"
          outlined
        >
          <v-card-text>
            <v-icon size="5em">mdi-{{ link.icon }}</v-icon>
          </v-card-text>
          <div class="home-link-title mb-4 px-2">
            <h2 class="text-center">
              {{ link.name }}
            </h2>
          </div>
          <v-card-actions v-if="link._id && $isAdmin" class="home-link-actions">
            <v-btn icon @click.prevent="currentLink = link.clone()">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-spacer />
            <delete-dialog name="Link" @delete="link.remove()" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog :value="!!currentLink" max-width="400" @input="!$event && closeLink()">
      <v-card v-if="currentLink">
        <v-card-title> {{ currentLink._id ? 'Edit' : 'Add' }} Link </v-card-title>
        <v-card-text>
          <p>
            <a href="https://mdisearch.com" target="_blank"> Find Icons Here. </a>
          </p>
          <v-alert v-show="showError" type="warning">
            Please complete all fields before saving.
          </v-alert>
          <v-text-field label="Name" v-model="currentLink.name" outlined required />
          <v-text-field label="URL" v-model="currentLink.href" outlined required />
          <v-text-field label="Icon" v-model="currentLink.icon" outlined required />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeLink"> Cancel </v-btn>
          <primary-btn :loading="loading" @click="saveLink()"> Save </primary-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentLink: null,
      loading: false,
      showError: false,
    };
  },
  computed: {
    valid() {
      return (
        this.currentLink?.name?.trim()
        && this.currentLink?.href?.trim()
        && this.currentLink?.icon?.trim()
      );
    },
    showInduction() {
      const { TrainingItem } = this.$FeathersVuex.api;
      const { total } = TrainingItem.findInStore({
        query: {
          type: 'induction',
          inductorIds: this.$user._id,
        },
      });
      return this.$isAdmin || !!total;
    },
    remoteLinks() {
      const { HomeLink } = this.$FeathersVuex.api;
      return HomeLink.findInStore({ query: { $sort: { name: 1 } } }).data;
    },
    links() {
      return [
        {
          to: '/training',
          name: 'Training',
          icon: 'school-outline',
        },
        {
          to: '/cards',
          name: 'Manage Key Cards',
          icon: 'card-account-details-outline',
        },
        ...(this.showInduction
          ? [
            {
              to: '/induction',
              name: 'Induct',
              icon: 'clipboard-check-outline',
            },
          ]
          : []),
        ...this.remoteLinks,
        ...(this.$isAdmin
          ? [
            {
              to: '/training-config',
              name: 'Training Config',
              icon: 'wrench-outline',
            },
            {
              to: '/users',
              name: 'User Management',
              icon: 'account-multiple-outline',
            },
            {
              to: '/email',
              name: 'Email Templates',
              icon: 'email-edit-outline',
            },
          ]
          : []),
      ];
    },
  },
  async mounted() {
    await this.loadLinks();
  },
  methods: {
    async loadLinks() {
      const { HomeLink } = this.$FeathersVuex.api;
      try {
        await HomeLink.find({
          query: {
            _id: { $nin: this.remoteLinks.map((l) => l._id) },
            $limit: 100,
          },
        });
      } catch (err) {
        this.$handleError(err, 'loading links');
      }
    },
    async saveLink() {
      if (!this.valid) {
        this.showError = true;
        return;
      }
      this.loading = true;
      this.showError = false;
      try {
        await this.currentLink.save();
        this.$success('saved Link');
        this.currentLink = null;
      } catch (err) {
        this.$handleError(err, 'saving link');
      }
      this.loading = false;
    },
    addLink() {
      const { HomeLink } = this.$FeathersVuex.api;
      this.currentLink = new HomeLink();
    },
    closeLink() {
      this.currentLink = null;
      this.showError = false;
    },
  },
};
</script>

<style scoped>
.home-link-card {
  text-align: center;
}

.home-link-card:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.home-link-actions {
  position: absolute;
  top: 0;
  width: 100%;
}

.home-link-title {
  min-height: 72px;
  display: flex;
  align-items: center;
}

.home-link-title h2 {
  width: 100%;
}
</style>
