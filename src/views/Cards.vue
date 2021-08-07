<template>
  <v-row justify="center" class="mt-12">
    <v-col cols="12" sm="10" md="6" ls="4" xl="3">
      <v-card outlined>
        <v-card-title>
          Manage RFID Cards
          <v-spacer />
          <card-reader v-model="isScanning" ref="scanner" @scan="addCard">
            <template #activator="{ on: scanner }">
              <v-tooltip top>
                <template #activator="{ on: tooltip }">
                  <v-btn icon v-on="{ ...scanner, ...tooltip }">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add New Card</span>
              </v-tooltip>
            </template>
          </card-reader>
        </v-card-title>
        <v-progress-linear v-show="loading" indeterminate />
        <v-list>
          <v-list-item
            v-for="card in cards"
            :key="card._id"
          >
            <v-list-item-content>
              <v-list-item-title>
                <inline-edit
                  v-model="card.name"
                  @input="updateCard(card, $event)"
                />
              </v-list-item-title>
              <v-list-item-subtitle>
                Last Updated on the
                {{ dayjs(card.updatedAt).format('Do [of] MMMM, YYYY') }}
                at
                {{ dayjs(card.updatedAt).format('h:mm A') }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <delete-dialog :name="card.name" @delete="removeCard(card)" />
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-text v-show="initialised && !cards.length">
          <p v-show="canAdd">
            No cards found.
          </p>
          <p v-show="!canAdd">
            No cards found. You can add a new card by using the Android Chrome browser
            on a mobile phone that supports NFC.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CardReader from '@/components/input/card-reader.vue';
import InlineEdit from '@/components/input/inline-edit.vue';
import dayjs from 'dayjs';

export default {
  components: {
    CardReader,
    InlineEdit,
  },
  data() {
    return {
      isScanning: false,
      loading: true,
      initialised: false,
      dayjs,
    };
  },
  computed: {
    cards() {
      const { Card } = this.$FeathersVuex.api;
      Math.random(this.loading);
      return Card.findInStore({
        query: {
          owner: this.$user.username,
          $sort: { name: 1 },
        },
      }).data;
    },
    canAdd() {
      Math.random(this.initialised);
      return !!this.$refs.scanner?.method;
    },
  },
  async mounted() {
    await this.loadCards();
    this.initialised = true;
  },
  methods: {
    async loadCards() {
      const { Card } = this.$FeathersVuex.api;
      this.loading = true;
      try {
        const { data } = await Card.find();
        await Promise.all(data
          .map(async (card) => Card.get(card._id, { skipRequestIfExists: false })));
      } catch (err) {
        this.$handleError(err, 'loading Cards');
      }
      this.loading = false;
    },
    async addCard(uuid) {
      const { Card } = this.$FeathersVuex.api;
      this.loading = true;
      try {
        const card = new Card({ uuid });
        await card.save();
        this.$success('added Card');
      } catch (err) {
        this.$handleError(err, 'adding Card');
      }
      this.loading = false;
    },
    async removeCard(card) {
      this.loading = true;
      try {
        await card.remove();
        this.$success('removed Card');
      } catch (err) {
        this.$handleError(err, 'removing Card');
      }
      this.loading = false;
    },
    async updateCard(card, name) {
      this.loading = true;
      try {
        await card.clone({ name }).save();
        this.$success('updated Card');
      } catch (err) {
        this.loadCards();
        this.$handleError(err, 'updating card');
      }
      this.loading = false;
    },
  },
};
</script>
