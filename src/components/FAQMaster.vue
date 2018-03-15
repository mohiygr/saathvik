/* eslint-disable */

<template lang="html">
  <div class="section">
    <h1 class="title">FAQ Master</h1>
    <div class="columns">
      <div class="column is-one-third">
        <a class="button" :class="{'is-loading':isLoading}" @click="refresh">refresh</a>
        <b-table
           :data="faqs">
          <template slot-scope="props">
            <b-table-column field="question" label="Question">
              {{ props.row.question }}
            </b-table-column>

            <b-table-column field="votes" label="Rank" numeric>
              {{ props.row.votes }}
            </b-table-column>

            <b-table-column label="actions">
              <a class="button is-primary is-small" :disabled="(faq && (props.row._id === faq._id))" @click="editFAQ(props.row)">Edit</a>
              <a class="button is-danger is-small" @click="deleteFAQ(props.row)">Delete</a>
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
                <p>No FAQs in the database. Create your first FAQ by filling out this form.</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>
      <div class="column">
        <div class="field">
          <label class="label" for="question">Question</label>
          <div class="control">
            <input class="input" type="text" name="question" v-model="question">
          </div>
        </div>
        <div class="field">
          <label class="label" for="question">Answer</label>
          <div class="control">
            <textarea class="textarea" rows="10" name="question" v-model="answer">
            </textarea>
          </div>
        </div>
        <div class="field">
          <label class="label" for="votes">Rank</label>
          <div class="control">
            <input class="input" rows="10" name="votes" v-model="votes">
          </div>
        </div>
        <div class="field is-centered">
          <a class="button is-primary is-rounded"
             :class="{'is-loading':isSaving}"
             :disabled="!(question !== null && answer !== null)"
             @click="submitForm"
             >Save</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FAQMaster',
  data () {
    return {
      faqs: [],
      faq: null,
      question: null,
      answer: null,
      votes: 0,
      isLoading: false,
      isSaving: false

    }
  },
  methods: {
    editFAQ: function (f) {
      console.log('Edit', f)
      this.faq = f
      this.question = f.question
      this.answer = f.answer
      this.votes = f.votes
    },
    successMsg: function (msg) {
      this.$toast.open({
        duration: 5000,
        message: msg,
        queue: true,
        type: 'is-success',
        position: 'is-bottom'
      })
    },
    infoMsg: function (msg) {
      this.$toast.open({
        duration: 1000,
        message: msg,
        queue: false,
        type: 'is-success',
        position: 'is-top'
      })
    },
    submitForm: function () {
      var vm = this
      this.isSaving = true
      if (this.faq) {
        // put
        axios.put(
          '/faqs/' + this.faq._id,
          {
            question: this.question,
            answer: this.answer,
            votes: this.votes
          })
          .then(
            (o) => {
              vm.isSaving = false
              vm.faq = null
              vm.question = null
              vm.answer = null
              vm.votes = 0
              console.log('put output', o)
              vm.successMsg('Updated')
              vm.refresh()
            },
            (e) => {
              vm.isSaving = false
              vm.successMsg('Error in updating')
            }
          )
      } else {
        axios.post('/faqs', {
          question: this.question,
          answer: this.answer,
          votes: this.votes
        })
          .then(
            (o) => {
              vm.isSaving = false
              vm.faq = null
              vm.question = null
              vm.answer = null
              vm.votes = 0
              vm.successMsg('Created')
              vm.refresh()
            },
            (e) => {
              vm.isSaving = false
              console.log('Error creating new FAQ', e)
            }
          )
      }
    },
    refresh: function () {
      var vm = this
      vm.isLoading = true
      this.infoMsg('Refreshing...')
      axios.get('/faqs')
        .then(
          function (o) {
            vm.faqs = []
            o.data.forEach(function (faq) {
              vm.faqs.push(faq)
            })
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
                vm.successMsg('Deleted')
                vm.refresh()
              },
              (e) => {
                vm.successMsg('Error in deleting')
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
