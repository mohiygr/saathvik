<template lang="html">
  <div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'

import 'firebaseui/dist/firebaseui.css'

export default {
  name: 'auth',
  data () {
    return {
      user: ''
    }
  },
  mounted () {
    console.log('pid', firebase.auth.EmailAuthProvider.PROVIDER_ID)
    var uiConfig = {
      signInSuccessUrl: '/profile',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  created () {
    console.log('Auth.created is here')
  }
}
</script>
