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
              <p class="has-text-danger">(if you don't know what you are doing, don't change this!)</p>
              <div class="control">
                <input class="input" placeholder="Phone" v-model="ouradmin">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container has-text-centered">
      <button class="button is-primary" v-on:click="submitForm" v-bind:disabled="!isSubmitReady" v-bind:class="{'is-loading': isSubmitting}">Save</button>
      <a class="button is-transparent" href="/">Cancel</a>
    </div>
    <p class="help has-text-centered">Last Updated: {{lastUpdatedTime}}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Admin',
  data () {
    return {
      ourphone: '',
      ouremail: '',
      ouraddress: '',
      ourcontactname: '',
      ouradmin: '',
      lastupdated: null,
      isSubmitting: false
    }
  },
  created () {
    var vm = this
    axios.get('/settings')
      .then(
        function (o) {
          o.data.forEach(function (kv) {
            if (kv.key === 'contact.phone') {
              vm.ourphone = kv.value
            } else if (kv.key === 'contact.email') {
              vm.ouremail = kv.value
            } else if (kv.key === 'contact.name') {
              vm.ourcontactname = kv.value
            } else if (kv.key === 'contact.address') {
              vm.ouraddress = kv.value
            } else if (kv.key === 'admin.uid') {
              vm.ouradmin = kv.value
              vm.lastupdated = kv.last_modified
            } else {
              console.log('skipping irrelevant setting', kv)
            }
          })
        },
        function (e) {
          console.log('Error fetching settings', e)
        }
      )
  },
  computed: {
    lastUpdatedTime: function () {
      if (this.lastupdated) {
        const d = new Date(this.lastupdated)
        return d.toString()
      } else {
        return '...'
      }
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
        var kvs = [
          { key: 'contact.phone', value: this.ourphone, last_modified: nowdt },
          { key: 'contact.email', value: this.ouremail, last_modified: nowdt },
          { key: 'contact.address', value: this.ouraddress, last_modified: nowdt },
          { key: 'admin.uid', value: this.ouradmin, last_modified: nowdt }
        ]
        kvs.forEach(function (kv) {
          const k = kv.key
          const uri = '/settings/' + k
          axios.put(uri, kv)
            .then(
              function (obj) {
                vm.lastupdated = nowdt
              },
              function (err) {
                console.log('Error putting setting "' + k + '"', err)
              }
            )
        })
        this.isSubmitting = false
        this.$notify('Saved!')
      }
    }
  }
}
</script>

<style>
  notifications {
  z-index: 999;
  }
</style>
