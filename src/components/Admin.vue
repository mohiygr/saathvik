/* eslint-disable */

<template lang="html">
  <div class="section">
    <h1 class="title is-4">Contact Details</h1>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Phone</label>
          <div class="control">
            <input class="input" placeholder="Phone" v-model="ourphone">
            <p class="help" v-bind:class="{'is-info': !isValidPhone}" v-if="!isValidPhone">Please fill a 10-digit Phone number.</p>
          </div>
        </div>
        <div class="field">
          <label class="label">E-Mail</label>
          <div class="control">
            <input class="input" v-bind:class="{'is-info': !isValidEmail}" placeholder="Email" v-model="ouremail">
          </div>
          <p class="help" v-bind:class="{'is-info': !isValidEmail}" v-if="!isValidEmail">Please fill a valid e-mail address.</p>
        </div>
        <div class="field">
          <label class="label">Address</label>
          <div class="control">
            <textarea class="input textarea" rows="10" placeholder="Optional" v-model="ouraddress"></textarea>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="section">
          <h1 class="title is-4">Authorized Admin</h1>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Admin</label>
              <p class="help">Enter the uid of the registered user from database</p>
              <div class="control">
                <input class="input" placeholder="Phone" v-model="ouradmin">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container has-text-centered">
      <button class="button is-primary" v-on:click="submitForm" v-bind:disabled="!isSubmitReady" v-bind:class="{'is-loading': isSubmitting}">Submit</button>
      <button class="button is-transparent">Cancel</button>
    </div>
    <p class="help has-text-centered">Last Updated: {{lastUpdatedTime}}</p>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Admin',
  data () {
    return {
      ourphone: '',
      ouremail: '',
      ouraddress: '',
      ouradmin: '',
      lastupdated: '',
      isSubmitting: false
    }
  },
  created () {
    var vm = this
    firebase.database().ref('admin').once('value')
      .then(function (cfg) {
        if (cfg.val()) {
          vm.ourphone = cfg.val().ourphone
          vm.ouremail = cfg.val().ouremail
          vm.ouraddress = cfg.val().ouraddress
          vm.ouradmin = cfg.val().ouradmin
          vm.lastupdated = cfg.val().lastupdated
        } else {
          console.log('first time?')
        }
      })
  },
  computed: {
    lastUpdatedTime: function () {
      const d = new Date(this.lastupdated)
      return d.toString()
    },
    isValidPhone: function () {
      if (this.ourphone.match(new RegExp(/^([0-9]){10}$/))) {
        return true
      } else {
        return false
      }
    },
    isValidAddress: function () {
      if (this.ouraddress.match(new RegExp(/^.+$/, 'gms'))) {
        return true
      } else {
        return false
      }
    },
    isValidEmail: function () {
      if (this.ouremail.match(new RegExp(/^(.*?)@(.*?)\.(.+)$/))) {
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
      if (this.isValidEmail && this.isValidAddress && this.isValidPhone) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    submitForm: function () {
      if (this.isValidEmail && this.isValidAddress && this.isValidPhone) {
        this.isSubmitting = true
        var vm = this
        var nowdt = Date.now()
        firebase.database().ref('admin')
          .set(
            {
              ouraddress: this.ouraddress,
              ouremail: this.ouremail,
              ourphone: this.ourphone,
              ouradmin: this.ouradmin,
              lastupdated: nowdt
            })
          .then(function (obj) {
            console.log('Object saved', obj)
            vm.isSubmitting = false
            vm.lastupdated = nowdt
            vm.$notify('Updated!')
          })
      }
    }
  }
}
</script>
