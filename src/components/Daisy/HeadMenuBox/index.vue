<template>
  <div class="head-menu-box">
    <div
      v-for="(item, index) in menuList"
      :key="index"
      class="head-menu-item"
      @click="handleClickMenuItem(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const menuList = ref([
  // {
  //   label: "首页",
  //   value: "home",
  //   name: "daisyHome",
  // },
  {
    label:'Pokémon',
    value:'pokemon',
    name:'pokemon'
  },
]);
const router = useRouter();

function handleClickMenuItem(data) {
  router.push({
    name: data.name,
  });
}
</script>

<style lang="scss">
.head-menu-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: min(99%, 980px);
  .head-menu-item {
    padding: 0 10px;
    color: #000;
    cursor: pointer;
    &:hover{
      font-weight: bold;
    }
  }
}
</style>
