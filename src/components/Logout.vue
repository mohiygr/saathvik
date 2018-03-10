<template lang="html">
  <section class="hero is-medium">
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
        <b-icon icon="exit_to_app"></b-icon>
        <h1 class="title">Logout</h1>
        <h2 class="subtitle">Do you really want to logout?</h2>
        <button class="button is-success" @click="logout">Yes</button>
        <button class="button is-danger" @click="cancelLogout">No</button>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Logout',
  methods: {
    cancelLogout: function () {
      this.$router.push('/')
    },
    logout: function () {
      this.isLoading = true
      var vm = this
      firebase.auth().signOut()
        .then(function () {
          vm.isLoading = false
          vm.$router.push('/')
        })
    }
  },
  data () {
    return {
      isLoading: false
    }
  }
}
</script>
