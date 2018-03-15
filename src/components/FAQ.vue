<template lang="html">
  <div class="section">
    <h1 class="title">FAQ</h1>
    <div class="columns" v-for="faq in faqs" :key="faq._id">
      <div class="column">
        <div class="content5B">
          <b-collapse class="card" :open="false">
            <div slot="trigger" slot-scope="props" class="card-header" @click="if (!props.open) { viewSome = true; upvote(faq) }">
              <p class="card-header-title">
                {{faq.question}}
              </p>
            </div>
            <div class="card-content">
              <div class="content" v-html="faq.answer">
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FAQ',
  data () {
    return {
      faqs: [],
      faq: null,
      isLoading: false,
      viewSome: false,
      viewAll: false
    }
  },
  methods: {
    upvote: function (f) {
      axios.put('/faqs/' + f._id + '/incr_vote')
        .then(
          (o) => {
            console.log('updated vote', o)
          },
          (e) => {
            console.log('Error in upvoting FAQ', e)
          }
        )
    },
    refresh: function () {
      var vm = this
      vm.isLoading = true
      axios.get('/faqs')
        .then(
          function (o) {
            vm.faqs = []
            for (var i = 0; i < o.data.length; i++) {
              var faq = o.data[i]
              vm.faqs.push(faq)
            }
            vm.isLoading = false
          },
          function (e) {
            console.log('Error fetching FAQs', e)
            vm.isLoading = true
          }
        )
    },
    deleteFAQ: function (f) {
      var vm = this
      if (f) {
        if (f._id) {
          axios.delete('/faqs/' + f._id)
            .then(
              (o) => {
                console.log('deleted FAQ', o)
                vm.refresh()
              },
              (e) => {
                console.log('error in deleting FAQ', e)
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
