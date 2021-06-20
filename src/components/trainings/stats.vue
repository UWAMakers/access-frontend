<template>
  <v-card outlined>
    <v-card-title>
      User Completions
    </v-card-title>
    <v-row justify="center" class="mb-0">
      <v-col style="max-width: 400px">
        <pie-chart :options="pieOptions" :chart-data="pieData" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PieChart from '@/components/charts/pie.vue';

export default {
  components: {
    PieChart,
  },
  props: {
    trainingId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      completionTotals: [],
      userTotal: 0,
    };
  },
  computed: {
    pieOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      };
    },
    pieData() {
      const pendingTotal = this.completionTotals.find((c) => c.status === 'pending')?.total || 0;
      const completeTotal = this.completionTotals.find((c) => c.status === 'complete')?.total || 0;
      const nostartTotal = Math.max(this.userTotal - pendingTotal - completeTotal, 0);
      console.log(nostartTotal);
      return {
        labels: ['No Progress', 'Pending', 'Complete'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [nostartTotal, pendingTotal, completeTotal],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(182,251,164)'],
          },
        ],
      };
    },
  },
  async mounted() {
    await this.loadUserTotal();
    await this.loadCompletionTotals();
  },
  watch: {
    trainingId(to, from) {
      if (to === from) return;
      this.loadCompletionTotals();
    },
  },
  methods: {
    async loadUserTotal() {
      const { User } = this.$FeathersVuex.api;
      try {
        const { total } = await User.find({ query: { $limit: 0 } });
        this.userTotal = total;
        console.log(total);
      } catch (err) {
        this.$handleError(err, 'loading users total');
      }
    },
    async loadCompletionTotals() {
      const { Completion } = this.$FeathersVuex.api;
      try {
        const { data } = await Completion.find({
          query: {
            trainingId: this.trainingId,
            $distinct: 'status',
          },
        });
        this.completionTotals = data;
        console.log(data);
      } catch (err) {
        this.$handleError(err, 'loading completion totals');
      }
    },
  },
};
</script>
