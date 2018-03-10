/* eslint-disable */

<template lang="html">
  <div class="section">
    <div class="modal" v-bind:class="{'is-active':isLoading}">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="notification has-text-centered">
          <p class="subtitle">Loading... </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="box has-text-centered">
          <h1 class="is-4">Phone</h1>
          <h1 class="is-5">{{ourphone}}</h1>
          <a class="button is-link is-rounded" v-bind:href="ourphoneurl">Call</a>
        </div>
      </div>
      <div class="column is-two-thirds">
        <div class="box has-text-centered">
          <h1 class="is-4 pull-left">Address</h1>
          <h2 class="is-5 pulled-left" v-html="ouraddress"></h2>
        </div>
      </div>
      <div class="column">
        <div class="box has-text-centered">
          <h1 class="is-4">Email</h1>
          <h1 class="is-5">{{ouremail}}</h1>
          <a class="button is-link is-rounded" v-bind:href="ouremailurl">E-Mail us</a>
        </div>
      </div>
    </div>
  <div class="container has-text-centered">
  <h1 class="title">Or, Contact Us</h1>
  </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" placeholder="Name" v-model="name">
            <p class="help" v-bind:class="{'is-info': !isValidName}" v-if="!isValidName">Please fill your Name.</p>
          </div>
        </div>
        <div class="field">
          <label class="label">E-Mail</label>
          <div class="control">
            <input class="input" v-bind:class="{'is-info': !isValidEmail}" placeholder="Email" v-model="email">
          </div>
          <p class="help" v-bind:class="{'is-info': !isValidEmail}" v-if="!isValidEmail">Please fill a valid e-mail address.</p>
        </div>
        <div class="field">
          <label class="label">Phone</label>
          <div class="control">
            <input class="input" v-bind:class="{'is-info': !isValidPhone}" placeholder="Phone" v-model="phone">
          </div>
          <p class="help" v-bind:class="{'is-info': !isValidPhone}" v-if="!isValidPhone">Please enter a 10 digit phone number.</p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">Message</label>
          <div class="control">
            <textarea class="input textarea" rows="10" placeholder="Optional" v-model="message"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="container has-text-centered">
      <button class="button is-primary" v-on:click="submitForm" v-bind:disabled="!isSubmitReady" v-bind:class="{'is-loading': isSubmitting}">Submit</button>
      <button class="button is-transparent">Cancel</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Contact',
  data () {
    return {
      ourphone: '',
      ouremail: '',
      ouraddress: '',
      name: '',
      email: '',
      phone: '',
      message: '',
      isLoading: false,
      isSubmitting: false
    }
  },
  created () {
    var vm = this
    var u = firebase.auth().currentUser
    this.isLoading = true
    firebase.database().ref('admin').once('value')
      .then(function (cfg) {
        vm.isLoading = false
        if (cfg.val()) {
          vm.ourphone = cfg.val().ourphone
          vm.ouremail = cfg.val().ouremail
          vm.ouraddress = cfg.val().ouraddress
          if (u) {
            vm.email = u.email
            vm.name = u.displayName
          }
        } else {
          console.log('first time?')
        }
      })
  },
  computed: {
    obj: function () {
      return { name: this.name, phone: this.phone, email: this.email, message: this.message }
    },
    isValidPhone: function () {
      if (this.phone.match(new RegExp(/^([0-9]){10}$/))) {
        return true
      } else {
        return false
      }
    },
    isValidName: function () {
      if (this.name.match(new RegExp(/^.+$/))) {
        return true
      } else {
        return false
      }
    },
    isValidEmail: function () {
      if (this.email.match(new RegExp(/^(.*?)@(.*?)\.(.+)$/))) {
        return true
      } else {
        return false
      }
    },
    ourphoneurl: function () {
      return 'tel://' + this.ourphone
    },
    ouremailurl: function () {
      return 'maito://' + this.ouremail + '?Subject=Lunch / Dinner Enquiry'
    },
    isSubmitReady: function () {
      if (this.isValidEmail && this.isValidName && this.isValidPhone) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    submitForm: function () {
      if (this.isValidEmail && this.isValidName && this.isValidEmail) {
        this.isSubmitting = true
        var vm = this
        firebase.database().ref('enquiries')
          .push(
            {
              name: this.name,
              email: this.email,
              phone: this.phone,
              message: this.message,
              date: Date.now()
            })
          .then(function (obj) {
            console.log('Object saved', obj)
            vm.isSubmitting = false
          })
      }
    }
  }
}
</script>
