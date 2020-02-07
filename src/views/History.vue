<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
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
  import {Pie} from 'vue-chartjs'

  export default {
    extends: Pie,
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

      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [
          {
            label: 'Расходы по категориям',
            backgroundColor: [
              '#0d3f67',
              '#ffb6b9',
              '#fae3d9',
              '#bbded6',
              '#8ac6d1',
              '#fff1ac',
              '#f9bcdd',
              '#f2f4f6',
              '#1ee3cf',
              '#6b48ff'
            ],
            data: categories.map(c => {
              return this.records.reduce((total, rec) => {
                if (rec.categoryId === c.id && rec.type === 'outcome') {
                  total += rec.amount*1
                }
                return total
              }, 0)
            })
          }
        ]
      })

      this.loading = false
    },
    components: {HistoryTable}
  }
</script>