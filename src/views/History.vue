<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!records.length">Записей пока нет. <router-link to="/record">Добавить новую запись</router-link></p>

    <section v-else>
      <HistoryTable :records="records"/>
    </section>
  </div>
</template>

<script>
  import HistoryTable from "../components/HistoryTable";

  export default {
    data: () => ({
      categories: [],
      records: [],
      loading: true
    }),
    async mounted() {
      const records = await this.$store.dispatch('fetchRecords')
      this.categories = await this.$store.dispatch('fetchCategories')

      this.records = records.map(r => {
        return {
          ...r,
          categoryName: this.categories.find(c => c.id === r.categoryId).title,
          typeText: r.type === 'income' ? 'Доход' : 'Расход',
          typeClass: r.type === 'income' ? 'green' : 'red'
        }
      })

      this.loading = false
    },
    components: {HistoryTable}
  }
</script>