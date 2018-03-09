<template>
  <div class="hello">
    <ul>
      <li v-for="item in menu" v-bind:key="item.title">{{item.title}} ({{item.category}})</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  computed: {
    menu: function () {
      return this.$store.state.menu
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
