import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import Paginate from 'vuejs-paginate'
import router from './router'
import store from './store'
import dateFilter from "./filters/date.filter";
import currencyFilter from "./filters/currency.filter";
import localizeFilter from "./filters/localize.filter";
import messagePlugin from './utils/message.plugin'
import Loader from "./components/app/Loader";
import tooltip from "./directives/tooltip";
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from "firebase";
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)
Vue.directive('tooltip', tooltip)

const firebaseConfig = {
  ***
};

firebase.initializeApp(firebaseConfig)

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
