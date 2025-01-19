<template>
  <div class="daisy-home-view">
    <div class="daisy-home-body">

    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.daisy-home-view {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .daisy-home-body {
    width: min(99%, 980px);
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    height: 2000px;
  }
}
</style>
