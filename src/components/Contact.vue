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
          <h1 class="subtitle is-5">{{ourname}}</h1>
          <h1 class="title is-4">{{ourphone}}</h1>
          <a class="button is-link is-rounded" v-bind:href="ourphoneurl">Call</a>
        </div>
        <div class="box has-text-centered" v-if="ourname2">
          <h1 class="subtitle is-5">{{ourname2}}</h1>
          <h1 class="title is-4">{{ourphone2}}</h1>
          <a class="button is-link is-rounded" v-bind:href="ourphoneurl2">Call</a>
        </div>
      </div>
      <div class="column is-two-thirds">
        <div class="box has-text-centered">
          <h1 class="subtitle is-5 pull-left">Address</h1>
          <h2 class="title is-4 pulled-left" v-html="ouraddress"></h2>
        </div>
      </div>
      <div class="column">
        <div class="box has-text-centered">
          <h1 class="subtitle is-5">Email</h1>
          <h1 class="title is-6">{{ouremail}}</h1>
          <a class="button is-link is-rounded" v-bind:href="ouremailurl">E-Mail us</a>
        </div>
      </div>
    </div>
  <div class="container has-text-centered">
  <h1 class="title">Feedback Form</h1>
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
        <div class="field">
          <label class="label">PIN Code</label>
          <p class="help">Enter the 6 digit PIN code of your locality where you need our service</p>
          <div class="control">
            <input class="input" v-bind:class="{'is-info': !isValidPIN}" placeholder="PIN Code" v-model="pincode">
          </div>
          <p class="help" v-bind:class="{'is-info': !isValidPIN}" v-if="!isValidPIN">Please enter a valid 6-digit PIN code (ex: 600044).</p>
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
import axios from 'axios'

export default {
  name: 'Contact',
  data () {
    return {
      ourphone: '',
      ourphone2: '',
      ourname: '',
      ourname2: '',
      ouremail: '',
      ouraddress: '',
      name: '',
      email: '',
      phone: '',
      pincode: '',
      message: '',
      isLoading: false,
      isSubmitting: false
    }
  },
  created () {
    var vm = this
    this.isLoading = true
    var u = firebase.auth().currentUser
    if (u) {
      vm.email = u.email
      vm.name = u.displayName
    }
    axios.get('/settings')
      .then(
        function (o) {
          vm.isLoading = false
          o.data.forEach(function (kv) {
            if (kv.key === 'contact.phone') {
              vm.ourphone = kv.value
            } else if (kv.key === 'contact.name') {
              vm.ourname = kv.value
            } else if (kv.key === 'contact.phone2') {
              vm.ourphone2 = kv.value
            } else if (kv.key === 'contact.name2') {
              vm.ourname2 = kv.value
            } else if (kv.key === 'contact.email') {
              vm.ouremail = kv.value
            } else if (kv.key === 'contact.name') {
              vm.ourcontactname = kv.value
            } else if (kv.key === 'contact.address') {
              vm.ouraddress = kv.value
            } else {
              console.log('skipping irrelevant setting', kv)
            }
          })
        },
        function (e) {
          console.log('Error fetching settings', e)
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
    isValidPIN: function () {
      return this.pincode.match(new RegExp(/^([0-9]){6}$/))
    },
    isValidName: function () {
      return this.name.match(new RegExp(/^.+$/))
    },
    isValidEmail: function () {
      return this.email.match(new RegExp(/^(.*?)@(.*?)\.(.+)$/))
    },
    ourphoneurl: function () {
      return 'tel://' + this.ourphone
    },
    ourphoneurl2: function () {
      return 'tel://' + this.ourphone2
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
        axios.post('/enquiries', {
          name: this.name,
          email: this.email,
          phone: this.phone,
          pincode: this.pincode,
          message: this.message,
          date: Date.now()
        })
          .then(function (obj) {
            console.log('Object saved', obj)
            vm.isSubmitting = false
            vm.$notify('Posted!')
          })
      }
    }
  }
}
</script>
