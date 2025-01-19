<template>
  <div class="daisy-default-layout-view" ref="daisyLayout">
    <div class="head">
      <HeadMenuBox />
    </div>
    <transition name="to-top-button">
      <div
        class="to-top-button"
        v-show="!isTop"
        title="返回顶部"
        @click="handleClickToTop"
      >
      <el-icon>
        <ArrowUpBold />
      </el-icon>
    </div>
    </transition>
    <router-view v-slot="{ Component }" class="padding-default">
      <keep-alive :isTop="isTop">
         <component :is="Component" />
      </keep-alive>
    </router-view>
    <div class="footer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import HeadMenuBox from "@/components/Daisy/HeadMenuBox/index.vue";
const daisyLayout = ref();
// const bottom = ref(false);
const isTop = ref(true);
const scrollTopNumber = ref(0);
const scrolling = (e:Event) => {
  const scrollTop =  ref(window.scrollY);
  scrollTopNumber.value = window.scrollY;
  if (scrollTop.value === 0) {
    isTop.value = true;
  } else {
    isTop.value = false;
  }
};
function handleClickToTop():void{
window.scrollTo({
    // top: daisyLayout.value.offsetHeight, //回到底部
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
onMounted(() => {
  window.addEventListener("scroll", scrolling);
});
onUnmounted(() => {
  window.removeEventListener("scroll", scrolling);
});
</script>

<style lang="scss">
:root {
  --menuHeadHeight: 60px;
}
.padding-default{
  padding: calc(var(--menuHeadHeight) + 10px) 0 10px 0;
  position: relative;
}
.daisy-default-layout-view {
  position: relative;
  .head {
    height: var(--menuHeadHeight);
    width: 100%;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 14px 28px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 10;
  }
  @keyframes showFormTop {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .to-top-button {
    position: fixed;
    right: 50px;
    bottom: 50px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    box-shadow: 0px 0px 2px rgba($color: #000000, $alpha: 0.4);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    animation: showToRight 0.2s linear;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 99;
    cursor: pointer;
  }
  @keyframes showToRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .to-top-button-enter-from,
  .to-top-button-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  .to-top-button-enter-to,
  .to-top-button-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .to-top-button-enter-active,
  .to-top-button-leave-active {
    transition: all 0.2s;
  }
  .footer {
    width: 100%;
  }
}
</style>
