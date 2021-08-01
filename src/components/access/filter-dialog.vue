<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <v-badge
        :content="count"
        :value="count"
        color="primary"
        bottom
        overlap
      >
        <v-btn icon v-on="on">
          <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-filter-outline</v-icon>
        Log Filter
      </v-card-title>
      <v-card-text>
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="renderedDates"
              label="Date Range"
              prepend-inner-icon="mdi-calendar"
              outlined
              readonly
              clearable
              v-bind="attrs"
              v-on="on"
              @click:clear="dates = []; updateValue()"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dates"
            range
            @input="closeDate"
          ></v-date-picker>
        </v-menu>

        <p class="text-caption mb-1">
          Access Was Granted?
        </p>
        <v-btn-toggle v-model="granted" borderless>
          <v-btn :value="1">
            <v-icon left>mdi-check-box-outline</v-icon>
            Yes
          </v-btn>
          <v-btn :value="-1">
            <v-icon left>mdi-minus-box-outline</v-icon>
            Either
          </v-btn>
          <v-btn :value="0">
            <v-icon left>mdi-close-box-outline</v-icon>
            No
          </v-btn>
        </v-btn-toggle>

        <p v-show="!hideUserSelector" class="text-caption mb-1">
          Users
        </p>
        <div v-show="!hideUserSelector">
          <user-selector v-model="userIds" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="mr-2" text @click="reset">Reset</v-btn>
        <primary-btn @click="dialog = false">Close</primary-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import UserSelector from '@/components/input/user-selector.vue';

export default {
  components: {
    UserSelector,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    hideUserSelector: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      dateMenu: false,
      dates: [],
      userIds: [],
      granted: -1,
    };
  },
  computed: {
    count() {
      return Object.keys(this.value).length;
    },
    renderedDates() {
      return uniq(this.dates).sort().map((v) => dayjs(v).format('D/M/YYYY')).join(' -> ');
    },
  },
  watch: {
    dateMenu(val) {
      if (!val) this.updateValue();
    },
    granted() {
      this.updateValue();
    },
    userIds() {
      this.updateValue();
    },
  },
  mounted() {
    if (typeof this.value.granted === 'boolean') {
      this.granted = this.value.granted ? 1 : 0;
    } else {
      this.granted = -1;
    }
    if (this.value.userId?.$in) {
      this.userIds = this.value.userId.$in;
    }
    if (this.value.createdAt) {
      this.dates = [
        dayjs(this.value.createdAt.$gte).format('YYYY-MM-DD'),
        dayjs(this.value.createdAt.$lte).format('YYYY-MM-DD'),
      ];
    }
  },
  methods: {
    closeDate() {
      if (this.dates.length > 1) this.dateMenu = false;
    },
    reset() {
      this.dates = [];
      this.granted = -1;
      this.userIds = [];
    },
    updateValue() {
      const value = {};
      if (this.granted !== -1) value.granted = !!this.granted;
      if (this.userIds.length > 0) value.userId = { $in: this.userIds };
      if (this.dates.length > 0) {
        value.createdAt = {
          $gte: dayjs([...this.dates].sort()[0]).startOf('day').toDate(),
          $lte: dayjs([...this.dates].sort()[this.dates.length - 1]).endOf('day').toDate(),
        };
      }
      this.$emit('input', value);
    },
  },
};
</script>
