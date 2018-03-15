/* eslint-disable */

<template lang="html">
  <div class="section">
    <b-modal :active.sync="isRefreshing">
      <div class="box">
        <h1 class="subtitle">Refreshing...</h1>
      </div>
    </b-modal>
    <b-modal :active.sync="showMsg" v-if="activeMsg">
      <div class="box">
        <h1 class="title">{{activeMsg.name}}</h1>
        <div class="level">
          <div class="field box">
            <label class="label">E-Mail</label>
            <h2 class="subtitle">{{activeMsg.email}}</h2>
          </div>
          <div class="field box">
            <label class="label">Phone</label>
            <h2 class="subtitle">{{activeMsg.phone}}</h2>
          </div>
          <div class="field box">
            <label class="label">PIN</label>
            <h2 class="subtitle">{{activeMsg.pincode}}</h2>
          </div>
        </div>
        <div class="box">
          {{activeMsg.message}}
        </div>
      </div>
    </b-modal>
      <h1 class="title">Enquiries</h1>
    <b-table
       :data="enquiries">

      <template slot-scope="props">
        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="email" label="E-Mail">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column field="phone" label="Phone">
          {{ props.row.phone }}
        </b-table-column>

        <b-table-column field="date" label="Date" centered>
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleDateString() }}
          </span>
        </b-table-column>

        <b-table-column label="actions">
          <a class="button is-primary" :disabled="!props.row.message" @click="activeMsg = props.row; showMsg = true">View Msg</a>
          <a class="button is-danger" @click="deleteMessage(props.row)">X</a>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                 icon="emoticon-sad"
                 size="is-large">
              </b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Enquiries',
  data () {
    return {
      enquiries: [],
      activeMsg: null,
      showMsg: false,
      isRefreshing: false

    }
  },
  methods: {
    refresh: function () {
      var vm = this
      vm.isRefreshing = true
      axios.get('/enquiries')
        .then(
          function (o) {
            vm.enquiries = []
            o.data.forEach(function (enq) {
              vm.enquiries.push(enq)
            })
            vm.isRefreshing = false
          },
          function (e) {
            console.log('Error fetching settings', e)
          }
        )
    },
    deleteMessage: function (m) {
      var vm = this
      if (m) {
        if (m._id) {
          axios.delete('/enquiries/' + m._id)
            .then(
              (o) => {
                console.log('deleted enquiry', o)
                vm.refresh()
              },
              (e) => {
                console.log('error in deleting enquiry', e)
              })
        }
      }
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style>
  notifications {
  z-index: 999;
  }
</style>
