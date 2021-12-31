<template>
  <router-view></router-view>
</template>

<script>
export default {
  created () {
    this.$request.request()
  },
  mounted () {
    this.$request.response()
  }
}
</script>

<style>
</style>
