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
      <HistoryTable :records="items"/>

      <Paginate
        v-model="page"
        :pageCount="pageCount"
        :clickHandler="clickHandler"
        :prevText="'Prev'"
        :nextText="'Next'"
        :containerClass="'pagination'"
        :pageClass="'waves-effect'">
      </Paginate>
    </section>
  </div>
</template>

<script>
  import HistoryTable from "../components/HistoryTable";
  import pagination from "../mixins/pagination";

  export default {
    mixins: [pagination],
    data: () => ({
      records: [],
      loading: true
    }),
    async mounted() {
      this.records = await this.$store.dispatch('fetchRecords')
      const categories = await this.$store.dispatch('fetchCategories')

      this.setupPagination(this.records.map(r => {
        return {
          ...r,
          categoryName: categories.find(c => c.id === r.categoryId).title,
          typeText: r.type === 'income' ? 'Доход' : 'Расход',
          typeClass: r.type === 'income' ? 'green' : 'red'
        }
      }))

      this.loading = false
    },
    components: {HistoryTable}
  }
</script>