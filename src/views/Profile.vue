<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="name"
            :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
        >
        <label for="description">Имя</label>
        <small
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
        >
          Поле Имя не должно быть пустым.
        </small>
      </div>

      <div class="switch">
        <label>
          Eng
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Рус
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {required} from 'vuelidate/lib/validators'

  export default {
    data: () => ({
      name: '',
      isRuLocale: true
    }),
    mounted() {
      this.name = this.info.name
      this.isRuLocale = this.info.locale === 'ru-RU'

      setTimeout(() => {
        M.updateTextFields()
      }, 0)
    },
    validations: {
      name: {required}
    },
    computed: {
      ...mapGetters(['info'])
    },
    methods: {
      ...mapActions(['updateInfo']),
      async submitHandler() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        try {
          await this.updateInfo({
            name: this.name,
            locale: this.isRuLocale ? 'ru-RU' : 'en-US'
          })
        } catch (e) {
        }
      }
    }
  }
</script>

<style scoped>
  .switch {
    margin-bottom: 2rem;
  }
</style>