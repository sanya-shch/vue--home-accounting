<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{info.bill | currency('UAH')}}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавить новую категорию</router-link></p>

    <section v-else>
      <div v-for="c in categories" :key="c.id">
        <p>
          <strong>{{c.title}}:</strong>
          {{c.spend | currency('UAH')}} из {{c.limit | currency('UAH')}}
        </p>
        <div class="progress" v-tooltip="c.tooltip">
          <div
              class="determinate"
              :class="[c.progressColor]"
              :style="{width: c.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import currencyFilter from "../filters/currency.filter";

  export default {
    name: "Planing",
    data: () => ({
      loading: true,
      categories: []
    }),
    computed: {
      ...mapGetters(['info'])
    },
    async mounted() {
      const records = await this.$store.dispatch('fetchRecords')
      const categories = await this.$store.dispatch('fetchCategories')

      this.categories = categories.map(c => {
        const spend = records
          .filter(r => r.categoryId === c.id)
          .filter(r => r.type === 'outcome')
          .reduce((total, rec) => total += rec.amount*1, 0)

        const percent = 100 * spend / c.limit
        const progressPercent = percent > 100 ? 100 : percent
        const progressColor = percent < 60
          ? 'green'
          : percent < 100
            ? 'yellow'
            : 'red'

        const tooltipValue = c.limit - spend
        const tooltip = `${tooltipValue < 0 ? 'Превишение на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipValue))}`

        return {
          ...c,
          progressColor,
          progressPercent,
          spend,
          tooltip
        }
      })

      this.loading = false
    }
  }
</script>