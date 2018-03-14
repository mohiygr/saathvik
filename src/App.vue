<template>
  <div id="app">
    <nav class="navbar is-primary myfloatingnav">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/" v-bind:class="{'is-active': (currentMenu === 'Home')}">
          <img src="./assets/logo.png" alt="Sathvik Food" width="100">
        </router-link>
        <div class="navbar-burger burger" v-on:click="burgerToggle = !burgerToggle" v-bind:class="{ 'is-active' : burgerToggle }" data-target="mymenubar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="mymenubar" class="navbar-menu" v-bind:class="{ 'is-active' : burgerToggle }">
        <div class="navbar-start">
  <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'About')}" to="/about">
            About
          </router-link>
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Menu')}" to="/menu">
            Menu
          </router-link>
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Contact')}" to="/contact">
            Contact
          </router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable" v-if="isAdmin">
            <a class="navbar-link">Admin</a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Categories')}" to="/catmaster" v-if="user">Categories</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Dishes')}" to="/dishmaster" v-if="user">Dishes</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Combos')}" to="/combomaster" v-if="user">Combos</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Meals')}" to="/mealmaster" v-if="user">Meals</router-link>
              <hr class="navbar-divider">
              <router-link class="navbar-item" to="/admin">Settings</router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable" v-bind:class="{'is-active': (currentMenu === 'Account')}">
            <a class="navbar-link">Account</a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" to="/profile">Profile</router-link>
              <router-link class="navbar-item" to="/logout" v-if="user">Logout</router-link>
              <router-link class="navbar-item" to="/auth" v-if="!user">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <notifications position="bottom center">
    </notifications>
    <transition name="fade">
      <div class="mycontainer">
        <router-view/>
      </div>
    </transition>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      menus: {
        'Contact': ['/contact'],
        'Admin': ['/admin', '/catmaster'],
        'Menu': ['/menu'],
        'About': ['/about'],
        'Categories': ['/catmaster'],
        'Meals': ['/mealmaster'],
        'Dishes': ['/dishmaster'],
        'Combos': ['/combomaster'],
        'Account': ['/logout', '/auth', '/profile']
      },
      burgerToggle: false,
      user: null,
      isAdmin: false,
      isLoading: false
    }
  },
  computed: {
    currentMenu: function () {
      const path = this.$route.fullPath
      var cur = 'Home'
      var vm = this
      Object.keys(vm.menus).forEach(function (menu) {
        vm.menus[menu].forEach(function (p) { // ex: this.menus['Account'] is a List
          if (path.match(new RegExp(p, 'i'))) {
            cur = menu
          }
        })
      })
      return cur
    }
  },
  created () {
    var u = firebase.auth().currentUser
    var vm = this
    var r = this.$route.path
    console.log('App.created: Route', r)
    if (!u) {
      this.user = null
    } else {
      this.user = u
      console.log('App:User', u)
      firebase.database().ref('admin').child('ouradmin')
        .once('value')
        .then(
          function (o) {
            if (o.val()) {
              if (u.uid === o.val()) {
                vm.isAdmin = true
                vm.$notify({group: 'app', type: 'warning', text: 'is Admin!'})
                console.log('is an admin')
              } else {
                vm.$notify({group: 'app', text: 'is NOT Admin!'})
              }
            }
          }
        )
    }
  }
}
</script>

<style scoped>
notifications {
    z-index: 999;
}
</style>
