import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home'
import About from '../components/About'
import Order from '../components/Order'
import Contact from '../components/Contact'
import Menu from '../components/Menu'
import Auth from '../components/Auth'
import Profile from '../components/Profile'
import Admin from '../components/Admin'
import CatMaster from '../components/CatMaster'
import DishMaster from '../components/DishMaster'
import MealMaster from '../components/MealMaster'
import ComboMaster from '../components/ComboMaster'
import NotFound from '../components/NotFound'
import Logout from '../components/Logout'
import AuthSuccess from '../components/AuthSuccess'
import firebase from 'firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', exact: true, component: Home },
    { path: '/about', component: About },
    { path: '/menu', component: Menu },
    { path: '/catmaster', component: CatMaster },
    { path: '/dishmaster', component: DishMaster },
    { path: '/mealmaster', component: MealMaster },
    { path: '/combomaster', component: ComboMaster },
    { path: '/contact', component: Contact },
    { path: '/admin', component: Admin, meta: { requiresAuth: true } },
    { path: '/order', component: Order, meta: { requiresAuth: true } },
    { path: '/success', component: AuthSuccess, meta: { requiresAuth: true } },
    { path: '/auth', component: Auth },
    { path: '/profile', component: Profile },
    { path: '/logout', component: Logout },
    { path: '/NotFound', component: NotFound },
    { path: '*', redirect: '/NotFound' }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (currentUser) {
    console.log('logged in', currentUser)
    next()
  } else {
    if (requiresAuth) {
      next('/auth')
    } else {
      next()
    }
  }
})

export default router
