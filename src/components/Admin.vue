<template lang="html">
  <div class="section">
    <div class="modal" v-bind:class="{'is-active':isAdding}">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="notification has-text-centered">
          <p class="subtitle">Loading... </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <h1 class="title is-3">Settings</h1>
      </div>
      <div class="column is-two-thirds">
        <div v-if="isError" class="notification is-danger">
          <button @click="isError = false" class="delete"></button>
          {{notify}}
        </div>
        <div v-if="isSuccess" class="notification is-success">
          <button @click="isSuccess = false" class="delete"></button>
          {{notify}}
        </div>
      </div>
    </div>
    <div class="columns" v-for="kv in settings" v-bind:key="kv._id">
      <div class="column is-3">
        <label class="label">{{kv.key}}</label>
      </div>
      <div class="column is-6">
        <div class="control">
          <input ref="title" class="input" :class="{'is-danger':kv.danger,'is-success':kv.success}" placeholder="value" v-model.trim="kv.value">
        </div>
      </div>
      <div class="column is-3">
        <a class="button is-primary" @click="updateSetting(kv)" :disabled="!hasChanged(kv)">Update</a>
        <a class="button is-link" v-if="hasChanged(kv)">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Admin',
  created () {
    this.refresh()
  },
  data () {
    return {
      isError: false,
      isSuccess: false,
      isAdding: false,
      settings: []
    }
  },
  methods: {
    undoChange: function (kv, old) {
      kv.value = old
      kv.oldvalue = kv.value
      kv.updated = false
      this.updateSetting(kv)
    },
    hasChanged: function (kv) {
      if (kv.value !== kv.oldvalue) {
        return true
      }
    },
    success: function (msg, kv) {
      var oldval = kv.oldvalue
      kv.oldvalue = kv.value
      this.$snackbar.open({
        duration: 5000,
        message: msg,
        type: 'is-success',
        position: 'is-top',
        actionText: 'Undo',
        onAction: () => {
          this.undoChange(kv, oldval)
          this.$toast.open({
            message: 'Reverted to old value',
            queue: true
          })
        }
      })
    },
    danger: function (msg, kv) {
      kv['warn'] = true
      this.$snackbar.open({
        duration: 7000,
        message: msg,
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Undo',
        onAction: () => {
          kv['warn'] = false
          this.updateSetting(kv)
          this.$toast.open({
            message: 'Retrying...',
            queue: false
          })
        }
      })
    },
    refresh: function () {
      this.settings = []
      var vm = this
      axios.get('/settings')
        .then(
          (resp) => {
            console.log('resp', resp.data)
            resp.data.forEach(function (cat) {
              cat['warn'] = false
              cat['success'] = false
              cat['oldvalue'] = cat['value']
              vm.settings.push(cat)
            })
          },
          (err) => {
            console.log('error in fetching settings', err)
          })
    },
    updateSetting: function (kv) {
      var vm = this
      axios.put('/settings/' + kv.key, kv)
        .then(
          (resp) => {
            vm.success('updated ' + kv.key + ' = ' + kv.value, kv)
            kv.updated = true
          },
          (err) => {
            console.log('Error', err)
            vm.danger('could not update.', kv)
          })
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
