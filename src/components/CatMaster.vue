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
      <div class="column">
        <div class="columns">
          <div class="column is-one-third">
            <h1 class="title is-3">Categories</h1>
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
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control">
                <input ref="title" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Title" v-model="title" @keyup.enter="addCategory">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
          </div>
          <div class="column is-vcentered">
            <div class="field">
  <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addCategory" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
  <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="catId = null; title = ''; titleBeforeUpdate = ''">cancel</button>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <table class="table mytable is-fullwidth table-striped">
              <tr class="tr">
                <td class="thead">Title</td>
                <td class="thead">Actions</td>
              </tr>
              <tr class="tr" v-for="cat in categories" v-bind:key="cat._id">
                <td class="td"><h1 class="title is-4">{{cat.title}}</h1></td>
  <td class="td"><button v-bind:disabled="(cat._id === catId)" class="button is-small is-link is-rounded" @click="editCategory(cat)">Edit</button> <button @click="deleteCategory(cat)" class="button is-small is-danger is-rounded">X</button></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CatMaster',
  created () {
    this.refresh()
  },
  data () {
    return {
      isError: false,
      isSuccess: false,
      isAdding: false,
      categories: [],
      catId: null, // means, "new", else means "Edit" to given id
      meals: [],
      title: '',
      titleBeforeUpdate: ''
    }
  },
  computed: {
    isValidTitle: function () {
      return this.title.match(new RegExp(/^.+$/))
    },
    isFormReady: function () {
      return this.isValidTitle && (this.title !== this.titleBeforeUpdate)
    },
    AddOrEdit: function () {
      return (this.catId ? 'Update' : 'Add')
    }
  },
  methods: {
    refresh: function () {
      this.categories = []
      var vm = this
      axios.get('/categories')
        .then(
          (resp) => {
            console.log('resp', resp.data)
            resp.data.forEach(function (cat) {
              vm.categories.push(cat)
            })
          },
          (err) => {
            console.log('error in fetching categories', err)
          })
    },
    addCategory: function () {
      var vm = this
      this.isAdding = true
      var newCat = { title: this.title }

      if (this.catId) { // update an existing object
        axios.put('/categories/' + this.catId, newCat)
          .then(
            (resp) => {
              console.log('update existing category ' + vm.catId, resp)
              vm.catId = null
              vm.isAdding = false
              vm.isError = false
              vm.title = ''
              vm.isSuccess = true
              vm.notify = 'Updated!'
              vm.refresh()
            },
            (err) => {
              console.log('Error', err)
              vm.notify = 'could not update. Please try again'
              vm.isError = true
              vm.catId = null
              vm.title = ''
              vm.isAdding = false
            })
      } else { // post a new object
        axios.post('/categories', { title: this.title })
          .then(
            (resp) => {
              console.log('created new category', resp)
              vm.isAdding = false
              vm.isError = false
              vm.isSuccess = true
              vm.notify = 'Added!'
              vm.title = ''
              vm.refresh()
            },
            (err) => {
              console.log('error in posting to category', err)
              vm.notify = 'could not post. Please try again'
              vm.isError = true
              vm.isAdding = false
            })
      }
    },
    deleteCategory: function (cat) {
      this.isAdding = true
      var vm = this
      var title = cat.title
      axios.delete('/categories/' + cat._id).then(
        (resp) => {
          console.log('Deleted', resp)
          vm.isAdding = false
          vm.isSuccess = true
          vm.notify = 'Successfully deleted "' + title + '"'
          vm.refresh()
        },
        (err) => {
          console.log('Error in deleting', err)
          vm.isAdding = false
          vm.isError = true
          vm.notify = 'could not delete "' + title + '"'
        })
    },
    editCategory: function (cat) {
      this.catId = cat._id
      // find in categories, catId and set title to that
      this.title = cat.title
      this.titleBeforeUpdate = cat.title
      this.$refs.title.focus()
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
