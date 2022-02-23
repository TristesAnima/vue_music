<template>
  <div id="app">
    <vue-particles color="#ffffff"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="9"
        linesColor="#24adf3"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="lizi"></vue-particles>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
