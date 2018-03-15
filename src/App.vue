<template>
  <div id="app">
    <nav class="navbar mynav">
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
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'About')}" @click.native="closeBurger" to="/about">
            About
          </router-link>
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Menu')}" @click.native="closeBurger" to="/menu">
            Menu
          </router-link>
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'FAQ')}" @click.native="closeBurger" to="/faq">
            FAQ
          </router-link>
          <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Contact')}" @click.native="closeBurger" to="/contact">
            Contact
          </router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable" v-if="isAdmin">
            <a class="navbar-link">Admin</a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Categories')}" @click.native="closeBurger" to="/catmaster" v-if="user">Categories</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Dishes')}" @click.native="closeBurger" to="/dishmaster" v-if="user">Dishes</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Combos')}" @click.native="closeBurger" to="/combomaster" v-if="user">Combos</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Meals')}" @click.native="closeBurger" to="/mealmaster" v-if="user">Meals</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'FAQMaster')}" @click.native="closeBurger" to="/faqmaster" v-if="user">FAQ Master</router-link>
              <hr class="navbar-divider">
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Enquiries')}" @click.native="closeBurger" to="/enquiriesmaster" v-if="user">Enquiries</router-link>
              <router-link class="navbar-item" v-bind:class="{'is-active': (currentMenu === 'Settings')}" @click.native="closeBurger" to="/admin" v-if="user">Settings</router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable" v-bind:class="{'is-active': (currentMenu === 'Account')}">
            <a class="navbar-link">Account</a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" @click.native="closeBurger" to="/profile">Profile</router-link>
              <router-link class="navbar-item" @click.native="closeBurger" to="/logout" v-if="user">Logout</router-link>
              <router-link class="navbar-item" @click.native="closeBurger" to="/auth" v-if="!user">Login</router-link>
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
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      menus: {
        'Contact': ['/contact'],
        'Admin': ['/admin', '/catmaster'],
        'Menu': ['/menu'],
        'FAQ': ['/faq'],
        'About': ['/about'],
        'Categories': ['/catmaster'],
        'Meals': ['/mealmaster'],
        'Dishes': ['/dishmaster'],
        'Enquiries': ['/enquiriesmaster'],
        'FAQMaster': ['/faqmaster'],
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
  methods: {
    closeBurger: function () {
      this.burgerToggle = false
    },
    openBurger: function () {
      this.burgerToggle = true
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
      axios.get('/settings/admin.uid')
        .then(
          function (o) {
            console.log('Got setting', o.data)
            if (o.data.length === 1) {
              if (u.uid === o.data[0].value) {
                vm.isAdmin = true
                vm.$notify({group: 'app', type: 'warning', text: 'is Admin!'})
                console.log('is an admin', o.data)
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
    color: black;
    background-color: gray;
}
.mycontainer {
  background-color: #dacaa9;
}
.navbar-item .is-active {
    background-color: #00bb00;
}
.mynav, .mynav .navbar-dropdown {
    background-color: #d8b98c;
}
.mynav .navbar-item, .navbar-link {
color: #bb0000;
}
.mynav .navbar-link:hover, .navbar-item:hover {
color:#225560;
}
</style>
