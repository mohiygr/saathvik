<template>
  <div class="container">
    <div class="content">
      <h1>Signup succeeded</h1>
      <button @click="logOut">Log out</button>
      <hr>
      <img :src="photo" style="height: 120px"> <br>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      photo: '',
      userId: '',
      name: '',
      email: '',
      user: {}
    }
  },
  created () {
    this.user = firebase.auth().currentUser
    if (this.user) {
      this.name = this.user.displayName
      this.email = this.user.email
      this.photo = this.user.photoURL
      this.userId = this.user.uid
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut()
      this.$route.go('/')
    }
  }
}
</script>
