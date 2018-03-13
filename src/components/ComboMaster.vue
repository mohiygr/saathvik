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
            <h1 class="title is-3">Combos</h1>
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
        <div class="columns is-centered">
          <div class="column is-one-third">
            <div class="field">
              <label for="title" class="label">Title</label>
              <div class="control">
                <input type="text" ref="title" name="title" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Enter Title" v-model="title" @keyup.enter="addCombo">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label for="cost" class="label">Categories of Dishes</label>
  <p class="help" v-if="(catsInCombo.length === 0 && selectedCat === null)">Select a category of dish to be included into this combo.</p>
              <p class="help" v-if="(catsInCombo.length === 0 && selectedCat !== null)">Now press the 'add' button</p>
              <p class="help" v-if="(catsInCombo.length > 0)">These are the categories included in this combo. Add more categories to this combo using the drop-down below. </p>
              <div class="tags">
                <span class="tag is-success is-large" v-for="cat in catsInCombo" v-bind:key="cat._id">
                  {{cat.title}}
                  <button @click="deleteCatFromCombo(cat)" class="delete is-medium"></button>
                </span>
              </div>
              <div class="field">
                <label for="category" class="label">Add Category</label>
                <b-select placeholder="Select a Category" name="category" ref="category" class="select" v-model="selectedCat">
                  <option v-bind:value="cat" v-for="cat in categories" v-bind:key="cat._id">{{cat.title}}</option>
                </b-select>
                <a class="button is-small is-rounded is-link" @click="addCatToCombo" v-bind:disabled="!isValidCatToAdd">Add</a>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-vcentered">
            <div class="field">
              <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addCombo" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
              <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="cancelUpdate">cancel</button>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <table class="table mytable is-fullwidth table-striped">
              <tr class="tr">
                <td class="thead">Title</td>
                <td class="thead">Categories</td>
                <td class="thead">Actions</td>
              </tr>
              <tr class="tr" v-for="combo in combos" v-bind:key="combo._id">
                <td class="td"><h1 class="title is-4">{{combo.title}}</h1></td>
                <td class="td">
                  <div class="tags">
                    <span class="tag is-rounded is-info is-medium" v-for="c in combo.categories" v-bind:key="c._id">{{c.title}}</span>
                  </div>
                </td>
                <td class="td"><button v-bind:disabled="(combo._id === comboId)" class="button is-small is-link is-rounded" @click="editCombo(combo)">Edit</button> <button @click="deleteCombo(combo)" class="button is-small is-danger is-rounded">X</button></td>
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
  name: 'ComboMaster',
  created () {
    this.refresh()
  },
  data () {
    return {
      isError: false,
      isSuccess: false,
      isAdding: false,
      cost: '',
      categories: [],
      combos: [],
      catsInCombo: [],
      category: null,
      comboId: null, // means, "new", else means "Edit" to given id
      selectedCat: null,
      title: '',
      titleBeforeUpdate: ''
    }
  },
  computed: {
    isValidTitle: function () {
      return this.title.match(new RegExp(/^.+$/))
    },
    isValidCatToAdd: function () {
      if (this.selectedCat !== null) {
        return true
      } else {
        return false
      }
    },
    isFormReady: function () {
      return (this.catsInCombo.length >= 1 && this.isValidTitle)
    },
    AddOrEdit: function () {
      return (this.comboId ? 'Update' : 'Add')
    }
  },
  methods: {
    refresh: function () {
      this.combos = []
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
      axios.get('/combos')
        .then(
          (resp) => {
            console.log('resp', resp.data)
            resp.data.forEach(function (combo) {
              vm.combos.push(combo)
            })
          },
          (err) => {
            console.log('error in fetching combos', err)
          })
    },
    addCatToCombo: function () {
      this.catsInCombo.push(this.selectedCat)
      this.selectedCat = null
    },
    deleteCatFromCombo: function (cat) {
      const index = this.catsInCombo.indexOf(cat)
      this.catsInCombo.splice(index, 1)
    },
    addCombo: function () {
      var vm = this
      this.isAdding = true

      var newCombo = { title: this.title, categories: this.catsInCombo }
      console.log('Combo before update', newCombo)

      if (this.comboId) { // update an existing object
        axios.put('/combos/' + this.comboId, newCombo)
          .then(
            (resp) => {
              console.log('update existing combo ' + vm.comboId, resp)
              vm.isAdding = false
              vm.comboId = null
              vm.selectedCat = null
              vm.isError = false
              vm.catsInCombo = []
              vm.title = ''
              vm.isSuccess = true
              vm.notify = 'Updated!'
              vm.refresh()
            },
            (err) => {
              console.log('Error', err)
              vm.notify = 'could not update. Please try again'
              vm.isError = true
              vm.isAdding = false
            })
      } else { // post a new object
        axios.post('/combos', newCombo)
          .then(
            (resp) => {
              console.log('created new combo', resp)
              vm.isAdding = false
              vm.isError = false
              vm.isSuccess = true
              vm.notify = 'Added!'
              vm.title = ''
              vm.selectedCat = null
              vm.catsInCombo = []
              vm.refresh()
            },
            (err) => {
              console.log('error in posting to /combos', err)
              vm.notify = 'Error creating Combo.'
              vm.isError = true
              vm.isAdding = false
            })
      }
    },
    deleteCombo: function (combo) {
      this.isAdding = true
      var vm = this
      var title = combo.title
      axios.delete('/combos/' + combo._id).then(
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
    editCombo: function (combo) {
      this.comboId = combo._id
      this.catsInCombo = combo.categories
      this.selectedCat = null
      // find in categories, catId and set title to that
      this.title = combo.title
      this.changed = false
    },
    cancelUpdate: function () {
      this.comboId = null
      this.catsincombo = []
      this.title = ''
      this.changedFlag = false
      this.titleBeforeUpdate = ''
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
