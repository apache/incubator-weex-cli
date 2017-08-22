<template>
  <div class="hello">
    <text class="h1">{{ msg }}</text>
    <text class="h2">Essential Links</text>
    <div class="ul">
      <a class="link li" href="https://weex-project.io/">
        <text class="link-label">Docs</text>
      </a>
      <a class="link li" href="https://segmentfault.com/t/weex">
        <text class="link-label">Ask Question</text>
      </a>
      <a class="link li" href="https://github.com/apache/incubator-weex">
        <text class="link-label">Github Repo</text>
      </a>
    </div>
    <text class="h2">Ecosystem</text>
    <div class="ul">
      <a class="link li" href="https://github.com/weexteam/weex-toolkit">
        <text class="link-label">weex-toolkit</text>
      </a>
      <a class="link li" href="https://github.com/weexteam/weex-loader">
        <text class="link-label">weex-loader</text>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Weex App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  align-items: center;
  width: 750px;
  margin-top: 12px;
}
.h1, .h2 {
  font-weight: normal;
}
.h1 {
  font-size: 32px;
  margin: 14px;
}
.h2 {
  font-size: 26px;
  margin: 10px;
}
.ul {
  flex-direction: row;
  padding: 0;
}
.li {
  margin: 0 10px;
}
.link-label {
  font-size: 18px;
  color: #00BDFF;
}
</style>
