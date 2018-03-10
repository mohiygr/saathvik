<template>
  <div id="app">
    <nav class="navbar is-light">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="./assets/logo.png" alt="Sathvik Food" width="140">
        </router-link>
        <div class="navbar-burger burger" v-on:click="burgerToggle = !burgerToggle" v-bind:class="{ 'is-active' : burgerToggle }" data-target="mymenubar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="mymenubar" class="navbar-menu" v-bind:class="{ 'is-active' : burgerToggle }">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/about">
            About
          </router-link>
          <router-link class="navbar-item" to="/menu">
            Menu
          </router-link>
          <router-link class="navbar-item" to="/contact">
            Contact
          </router-link>
        </div>
        <div class="navbar-end">
          <router-link class="navbar-item" to="/admin" v-if="isAdmin">
            Admin
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable">
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
    <notifications position="bottom center"></notifications>
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      burgerToggle: false,
      user: null,
      isAdmin: false,
      isLoading: false
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

<style>
</style>
