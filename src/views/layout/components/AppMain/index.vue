<template>
  <section class="app-main">
      <keep-alive v-if="$config.enableCache" :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      <router-view v-else />
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  data() {
    return {
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

