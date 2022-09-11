<template>
  <v-btn icon @click="exportUsers">
    <v-icon>mdi-table-arrow-right</v-icon>
  </v-btn>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    filter: {
      type: Object,
      required: true,
    },
    dataFn: {
      type: Function,
      default: () => ({}),
    },
    fileName: {
      type: String,
      default: 'users',
    },
  },
  methods: {
    exportUsers() {
      const { User } = this.$FeathersVuex.api;
      const { data } = User.findInStore({
        query: {
          ...this.filter,
          $sort: { name: 1, username: 1 },
        },
      });
      const csv = this.toCSV(data.map((u) => ({
        Name: u.name,
        'Display Name': u.displayName,
        Username: u.username,
        Email: u.email,
        'Joined At': dayjs(u.preferences.joinedAt).format('YYYY-MM-DD HH:mm:ss'),
        Roles: (u.roles || []).join(', '),
        ...this.dataFn(u),
      })));
      this.downloadCSV(csv);
    },
    toCSV(data) {
      const headers = data.reduce((acc, row) => {
        Object.keys(row).forEach((key) => {
          if (!acc.includes(key)) acc.push(key);
        });
        return acc;
      }, []);
      let csv = headers.map((header) => `"${header}"`).join(',');
      csv += '\n';
      data.forEach((row) => {
        csv += headers.map((header) => `"${row[header]}"`).join(',');
        csv += '\n';
      });
      return csv;
    },
    downloadCSV(csv) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
