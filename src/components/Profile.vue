<template lang="html">
  <section class="hero is-medium is-fullheight">
    <div class="modal" v-bind:class="{'is-active':isLoading}">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="notification has-text-centered">
          <p class="subtitle">Loading... </p>
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">{{user.displayName}}</h1>
        <h2 class="subtitle">{{user.email}}</h2>
        <router-link class="button is-danger" to="/logout">Logout</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Profile',
  created () {
    this.user = firebase.auth().currentUser
  },
  data () {
    return {
      user: null,
      isLoading: false
    }
  }
}
</script>
