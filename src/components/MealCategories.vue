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
          <div class="column">
            <h1 class="title is-3">Meal Categories</h1>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input class="input" placeholder="Title" v-model="title">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <button v-bind:class="{'is-loading': isAdding,'disabled': !isFormReady}" @click="addCategory" class="button is-primary is-medium is-rounded">Add Category</button>
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
              <tr class="tr" v-for="(m, k) in categories" v-bind:key="k">
                <td class="td">{{m.title}}</td>
                <td class="td"><button class="button is-small is-link is-rounded">Edit</button> <button @click="deleteCategory(k)" class="button is-small is-danger is-rounded">X</button></td>
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
  name: 'MealCategories',
  created () {
    this.categories = []
    var vm = this
    axios.get('http://localhost:8081/categories')
      .then(function (resp) {
        console.log('resp', resp.data)
        resp.data.forEach(function (category) {
          vm.categories.push(category)
        })
      })
  },
  data () {
    return {
      isAdding: false,
      categories: [],
      title: '',
      category: '',
      cost: ''
    }
  },
  computed: {
    dishCount: function () {
      return this.dishes.length
    },
    isValidTitle: function () {
      return this.title.match(new RegExp(/^.+$/))
    },
    isValidCost: function () {
      return this.cost.match(new RegExp(/^\d+(\.\d+)*$/))
    },
    isValidCategory: function () {
      return !(this.category === '')
    },
    isFormReady: function () {
      if (this.isValidCost && this.isValidTitle && this.isValidCategory) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    deleteCategory: function (category) {
      // firebase.database().ref('categories').child(category['.key']).remove()
    },
    addCategory: function () {
      var vm = this
      vm.isAdding = true
      // firebase.database().ref('categories').child(vm.title)
      //   .set({
      //     title: vm.title,
      //     category: vm.category,
      //     cost: vm.cost
      //   })
      //   .then(function (obj) {
      //     vm.isAdding = false
      //     console.log('saved')
      //   })
    }
  }
}
</script>

<style>
</style>
