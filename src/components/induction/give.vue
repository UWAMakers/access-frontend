<template>
  <v-card outlined>
    <v-card-title> Give Induction </v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedItem"
        :items="items"
        :disabled="!!induction"
        :loading="loadingItems"
        label="Select Induction"
        item-text="ref"
        return-object
        outlined
      >
        <template #item="{ item }">
          <v-list-item-content>
            <v-list-item-title>
              {{
                getTrainings(item)
                  .map(({ name }) => name)
                  .join(', ')
              }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <template #selection="{ item }">
          <v-list-item-content>
            <v-list-item-title>
              {{
                getTrainings(item)
                  .map(({ name }) => name)
                  .join(', ')
              }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-select>

      <p v-show="selectedItem && !induction">
        Once you've gone through the induction with everyone, click Continue.
      </p>
    </v-card-text>
    <v-card-actions>
      <primary-btn
        v-if="selectedItem && selectedItem.checklistUrl"
        :href="selectedItem.checklistUrl"
        target="_blank"
      >
        Induction Checklist
        <v-icon right x-small>mdi-open-in-new</v-icon>
      </primary-btn>
      <v-spacer />
      <primary-btn v-show="selectedItem && !induction" :loading="loadingInduction" @click="submit">
        Continue
      </primary-btn>
    </v-card-actions>
    <v-card-text v-if="url" class="text-center">
      <qr :url="url" style="max-width: 300px" />
      <p v-if="$isDev">
        <a target="_blank" :href="url">{{ url }}</a>
      </p>
      <p>Get everyone that has received the induction to scan this QR code.</p>
      <p>
        If they cannot scan it for whatever reason, please add them below
        <br />
        and we will send them an email with the link.
      </p>
    </v-card-text>
    <v-card-actions v-show="url">
      <user-selector v-model="userIds" label="Manual Inductees" :exclude-ids="excludeIds" />
      <v-spacer />
      <primary-btn :disabled="!userIds.length" :loading="loadingInduction" @click="sendEmail">
        Send Email
      </primary-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Qr from '@/components/general/qr.vue';
import UserSelector from '@/components/input/user-selector.vue';

const genKey = () => `${Math.random().toString(36).substr(2)}${Math.random().toString(36).substr(2)}`;

export default {
  components: {
    Qr,
    UserSelector,
  },
  data() {
    return {
      selectedItem: null,
      induction: null,
      userIds: [],
      loadingItems: false,
      loadingInduction: false,
    };
  },
  computed: {
    items() {
      const { TrainingItem } = this.$FeathersVuex.api;
      const { data: items } = TrainingItem.findInStore({
        query: {
          ...(!this.$isAdmin ? { inductorIds: this.$user._id } : {}),
          type: 'induction',
        },
      });
      return items;
    },
    url() {
      if (!this.induction) return '';
      const key = this.induction.keys.find((k) => !k.userIds?.length);
      return `${window.location.origin}/induction/${key?.key}`;
    },
    excludeIds() {
      if (!this.induction) return [];
      return this.induction.keys.reduce((a, k) => [...a, ...(k.userIds || [])], []);
    },
  },
  async mounted() {
    await this.loadItems();
  },
  methods: {
    getTrainings(item) {
      const { Training } = this.$FeathersVuex.api;
      const { data: trainingItem } = Training.findInStore({
        query: {
          itemIds: item._id,
        },
      });
      return trainingItem;
    },
    async loadItems() {
      const { TrainingItem, Training } = this.$FeathersVuex.api;
      const existingIds = this.items.map((item) => item._id);
      this.loadingItems = true;
      try {
        await TrainingItem.find({
          query: {
            _id: { $nin: existingIds },
            ...(!this.$isAdmin ? { inductorIds: this.$user._id } : {}),
            type: 'induction',
          },
          paginate: false,
        });
        const itemIds = this.items.map(({ _id }) => _id);
        await Training.find({
          query: {
            itemIds: { $in: itemIds },
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading induction items');
      }
      this.loadingItems = false;
    },
    async submit() {
      if (!this.selectedItem?._id || this.induction) return;
      const { Induction } = this.$FeathersVuex.api;
      this.loadingInduction = true;
      try {
        this.induction = new Induction({
          itemId: this.selectedItem._id,
          inductorId: this.$user._id,
          keys: [
            {
              emailSent: false,
              key: genKey(),
              expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
            },
          ],
        });
        await this.induction.save();
        this.$success('created induction');
      } catch (err) {
        this.$handleError(err, 'creating induction');
      }
      this.loadingInduction = false;
    },
    async sendEmail() {
      if (!this.userIds.length || !this.induction) return;
      this.loadingInduction = true;
      try {
        this.induction.keys.push({
          key: genKey(),
          userIds: this.userIds,
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        });
        await this.induction.save();
        this.userIds = [];
        this.$success('sent induction confirmation');
      } catch (err) {
        this.$handleError(err, 'sending induction confirmation');
      }
      this.loadingInduction = false;
    },
  },
};
</script>
