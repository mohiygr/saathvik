import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Notifications from 'vue-notification'
import Buefy from 'buefy'
import VueScrollTo from 'vue-scrollto'
import firebase from 'firebase'
import router from './router'
import {config} from './helpers/firebaseConfig'
import 'buefy/lib/buefy.css'
// import 'bulma/css/bulma.css'
import 'vue-material-design-icons/styles.css'

Vue.use(VueRouter)
Vue.use(Buefy)
Vue.use(Notifications)
Vue.use(VueScrollTo)

let app

firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(
  function (user) {
    if (!app) {
      app = new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        router
      })
    }
  }
)

export default app
