<template>
  <div class="daisy-pokemon-view">
    <transition name="searchbox">
      <div class="search-row" v-if="props.isTop">
        <img src="@/assets/images/pokemon/pokemonlogo.png" class="pokemon-logo" />
        <input type="text" placeholder="使用名称或图鉴编号搜索" v-model="searchData" @keydown.enter="clickSearchIcon" />
        <div class="select-box">
          <label>属性：</label>
          <!-- TODO 属性选择框最多选择2项 暂未实现 -->
          <select v-model="typeFilterData">
            <option v-for="item in typeArray" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
          <label>特性：</label>
          <select v-model="abilityFilterData">
            <option v-for="item in abilityArray" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
          <label>地区： </label>
          <!-- TODO 地区选择框可无上限多选 暂未实现 -->
          <select v-model="regionFilterData">
            <option v-for="item in regionArray" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
        <!--排序条件 -->
        <div class="iconBox" @click="clickSearchIcon">
          <img class="icon" src="@/assets/images/pokemon/search-icon.svg" alt="" />
        </div>
      </div>
    </transition>
    <div class="daisy-pokemon-main-body-box">
      <div class="screen-box">
        <div class="screen-tab-list-box">
          <div class="screen-tab-item" v-for="(item, index) in screenTabList" :key="`${item.value}-${index}`"
            @click="handleClickScreenTabItem(item)" :class="{ 'screen-tab-item-active': curScreenTab === item.value }">
            {{ item.label }}</div>
        </div>
        <div class="screen-tab1-result" v-show="curScreenTab === '1'">
          <div class="screen-title">筛选</div>
          <div class="screen-type-list">
            <div v-for="item in attributeArray" :key="item.label" class="type-item"
              @click="handleClickCheckAttribute(item)"
              :style="{ '--typeColor': item.color, '--typeColorOpacity': `${item.color}a1` }" :title="item.title">
              <div class="type-item-img-box" :class="{ 'type-item-active': checkedArray.includes(item.label) }">
                <img :src="exportImgSrc(item.label)" />
              </div>
              <div class="type-item-title" :class="{ 'type-item-title-active': checkedArray.includes(item.label) }">
                {{ item.title }}</div>
            </div>
          </div>
        </div>
        <div class="screen-tab2-result" v-show="curScreenTab === '2'">
          <div class="screen-title">高级搜索</div>
          <div class="advance-search-item">
            <div class="advance-search-label">属性:</div>
            <div class="advance-search-row">
              <el-select v-model="screenSearchForm.type" multiple :multiple-limit="2" clearable placeholder="请选择属性">
                <el-option v-for="item in typeArray" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="screen-button-row">
          <div class="screen-button" @click="handleClickSearch">搜索</div>
        </div>
      </div>
      <div class="daisy-pokemon-body" v-show="!pageloading && pokemonItems.length">
        <div class="pokemon-item" v-for="(item, index) in pokemonItems" :key="`${item.zukan_id} - ${index}`"
          :style="pokemonCardStyle(item)">
          <div class="pokemon-item-info">
            <div class="pokemon-item-no-row">
              <img src="@/assets/images/pokemon/ball.svg" class="pokemon-ball" />
              <div class="pokemon-no">No.{{ item.zukan_id }}</div>
            </div>
            <div class="pokemonn-item-name-row">
              {{ item.pokemon_name }}
              <span v-if="item.pokemon_sub_name" class="pokemon-sub-name">
                {{ `(${item.pokemon_sub_name})` }}
              </span>
            </div>
            <div class="pokemon-img-box">
              <img :src="`https://www.pokemon.cn/play/resources/pokedex${item.file_name}`" class="pokemonimg" />
              <img src="@/assets/images/pokemon/random_center_bg.png" class="pokemonbgimg" />
            </div>
            <div class="pokemon-type-row" v-if="item.pokemon_type_name_arry && item.pokemon_type_name_arry.length">
              <div class="pokemon-type-row-item" v-for="(otem, i) in item.pokemon_type_id_arry">
                <img :src="exportImgSrc(otem)" />
                {{ item.pokemon_type_name_arry[i] }}
              </div>
            </div>
            <div class="pokemon-height-row">身高 : {{ item.height }}m</div>
            <div class="pokemon-weight-row">体重 : {{ item.weight }}kg</div>
          </div>
        </div>
      </div>
      <div class="empty-box" v-show="!pageloading && !pokemonItems.length">
        暂无数据
      </div>
      <div class="pokemon-loading" v-show="pageloading">
        <img src="@/assets/images/pokemon/ball.svg" class="loadingimg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPokemonList } from "@/api/pokemon";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { abilityArray, typeArray, regionArray } from "./types/pokemon_id";
import type { getPokemonListInterFace } from './types/pokemonApi'
//类型声明
type LabelValueType = {
  label: string;
  value: string;
}
type LabelValueTypeList = LabelValueType[];
//搜索栏显示状态
const props = defineProps({
  isTop: {
    type: Boolean,
    default: true
  },
})
type pageOptionType = {
  pokemon_ability_id: string,
  zukan_id_from: number
}
//搜索内容
const searchData = ref<string>('')
const screenSearchForm = ref<{ type: string }>({
  type: ''
})
//筛选内容
const typeFilterData = ref<string>('');
const abilityFilterData = ref<string>('');
const regionFilterData = ref<string>('');

//列表原数据
const pokemonList = ref<getPokemonListInterFace[]>([]);
//请求参数
const pageOption = ref<pageOptionType>({
  pokemon_ability_id: "",
  zukan_id_from: 1,
  // zukan_id_to: 898,
});
//列表分页
const pokemonNumberLimit = ref<number>(60);
//列表加载数据
const pokemonItems = computed<getPokemonListInterFace[]>(() => pokemonList.value.slice(0, pokemonNumberLimit.value));

//列表加载状态
const pageloading = ref<boolean>(false);

//当前选中的tab
const curScreenTab = ref<string>('1')

//查询列表的tab数组
const screenTabList = ref<LabelValueTypeList>([
  { label: '属性', value: '1' },
  { label: '高级', value: '2' },
])
//tab 点击事件
const handleClickScreenTabItem = (data: LabelValueType) => {
  curScreenTab.value = data.value
};
//列表滚动事件
const handleScroll = (): void => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMore();
  }
};
const loadMore = (): void => {
  if (pokemonList.value.length <= pokemonNumberLimit.value) return;
  pokemonNumberLimit.value += 60;
};

//属性图标
const exportImgSrc = (pokemon_type_id: string): string => {
  return import.meta.resolve(`../../../assets/images/pokemon/type/icon_type_${pokemon_type_id}_on.svg`);
};
// 属性字典样式 
type AttributeDic = {
  [type: string]: {
    color: string;
  };
};
type attributeArrayType = {
  label: string,
  title: string,
  color: string
}
// 属性字典
const attributeDic = ref<AttributeDic>({
  normal: { color: "#9fa0a0" }, //一般
  fire: { color: "#fe3700" }, //火
  water: { color: "#0093e4" }, //水
  grass: { color: "#91be19" }, //草
  electric: { color: "#e3b600" }, //电
  ice: { color: "#00b6ed" }, //冰
  fighting: { color: "#c75500" }, //格斗
  poison: { color: "#bd78bd" }, // 毒
  ground: { color: "#cba042" }, //地面
  flying: { color: "#79bbd6" }, //飞
  psychic: { color: "#db78c7" }, //超能
  bug: { color: "#31b032" }, //虫
  rock: { color: "#9f7850" }, //岩石
  ghost: { color: "#8b78ef" }, //幽灵
  dragon: { color: "#3c64c7" }, //龙
  dark: { color: "#646464" }, //恶
  steel: { color: "#95b3db" }, //钢
  fairy: { color: "#fe7eb7" }, //妖精
});
// 属性数组
const attributeArray = ref<attributeArrayType[]>([
  { label: 'normal', title: '一般', color: '#9fa0a0' },
  { label: 'fire', title: '火', color: '#fe3700' },
  { label: 'water', title: '水', color: '#0093e4' },
  { label: 'grass', title: '草', color: '#91be19' },
  { label: 'electric', title: '电', color: '#e3b600' },
  { label: 'ice', title: '冰', color: '#00b6ed' },
  { label: 'fighting', title: '格斗', color: '#c75500' },
  { label: 'poison', title: '毒', color: '#bd78bd' },
  { label: 'ground', title: '地面', color: '#cba042' },
  { label: 'flying', title: '飞行', color: '#79bbd6' },
  { label: 'psychic', title: '超能', color: '#db78c7' },
  { label: 'bug', title: '虫', color: '#31b032' },
  { label: 'rock', title: '岩石', color: '#9f7850' },
  { label: 'ghost', title: '幽灵', color: '#8b78ef' },
  { label: 'dragon', title: '龙', color: '#3c64c7' },
  { label: 'dark', title: '恶', color: '#646464' },
  { label: 'steel', title: '钢', color: '#95b3db' },
  { label: 'fairy', title: '妖精', color: '#fe7eb7' },
]);
//当前选中的属性 的数组
const checkedArray = ref<any[]>([])
const handleClickCheckAttribute = (item: attributeArrayType) => {
  if (checkedArray.value.includes(item.label)) {
    let index = checkedArray.value.findIndex(res => res === item.label)
    if (index > -1) {
      checkedArray.value.splice(index, 1)
    }
  } else {
    checkedArray.value.push(item.label)
  }
}
//属性筛选的 搜索按钮
const handleClickSearch = () => {
  console.log(checkedArray.value, 'checkedArray')
}

//页面初始请求
const getListData = () => {
  pageloading.value = true
  getPokemonList(pageOption.value)
    .then(({ data }) => {
      //item定义类型 
      pokemonList.value = data.pokemons.map((item: { pokemon_type_id: string; pokemon_type_name: string; }) => {
        return {
          ...item,
          pokemon_type_id_arry: item.pokemon_type_id.split(','),
          pokemon_type_name_arry: item.pokemon_type_name.split(',')
        }
      })
    })
    .finally(() => {
      pageloading.value = false
    });
};

//搜索
const changeSearch = () => {
  pageloading.value = true
  let prarms = {
    "key_word": searchData.value || undefined,
    "pokemon_type_id[]": typeFilterData.value?.length ? typeFilterData.value : undefined,
    "pokemon_ability_id": abilityFilterData.value || undefined,
    "pokemon_region_id[]": regionFilterData.value?.length ? regionFilterData.value : undefined
  }
  getPokemonList(prarms).then(({ data }) => {
    //item定义类型 
    pokemonList.value = data.pokemons.map((item: getPokemonListInterFace) => {
      return {
        ...item,
        pokemon_type_id_arry: item.pokemon_type_id.split(','),
        pokemon_type_name_arry: item.pokemon_type_name.split(',')
      }
    })
  }).finally(() => {
    pageloading.value = false;
  })
}

// 根据属性，生成每个item 的样式 
const pokemonCardStyle = (item: getPokemonListInterFace) => {
  const typeArray = item?.pokemon_type_id_arry;
  if (typeArray && typeArray.length === 2) {
    return {
      background: `linear-gradient(to bottom, 
      ${attributeDic.value[typeArray[0]]?.color}a1, 
      ${attributeDic.value[typeArray[1]]?.color}a1)`
    };
  } else if (typeArray && typeArray.length === 1) {
    return {
      background: `${attributeDic.value[typeArray[0]]?.color}a1`
    };
  } else {
    return { background: 'transparent' };
  }
};

const clickSearchIcon = () => {
  // 重置显示数量 
  pokemonNumberLimit.value = 60;
  changeSearch();
}
onMounted(() => {
  getListData();
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss">
$cardWidth: 220px; //卡片宽度
$cardHeight: 300px; //卡片高度
$bodyWidth: min(90%, 1200px); //内容模块宽度

.daisy-pokemon-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-image: url("@/assets/images/daisy/daisy-home-background5.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  position: relative;

  .search-row {
    width: $bodyWidth;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    margin-bottom: 10px;
    position: sticky;
    z-index: 10;
    top: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px;
    border-radius: 4px;
    flex-shrink: 0;
    animation: showAndCollapse 0.2s linear;

    .pokemon-logo {
      width: 75px;
      height: 25px;
    }

    .iconBox {
      height: 30px;
      width: 30px;
      cursor: pointer;

      .icon {
        height: 100%;
        width: 100%;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    input {
      flex: 1;
      flex-shrink: 0;
      background: transparent;
      color: #333;
      font-size: 20px;
      outline: none;
      border: none;
      border-bottom: 1px solid #333;
      margin: 0 10px;

      &::placeholder {
        color: #333;
        font-size: 14px;
      }
    }
  }

  .daisy-pokemon-main-body-box {
    width: $bodyWidth;
    display: flex;
    flex-direction: row;
    position: relative;

    .screen-box {
      position: sticky;
      top: 70px;
      width: 170px;
      height: fit-content;
      padding: 10px 5px 20px 5px;
      background-color: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      margin-right: 15px;
      border-radius: 0px 3px 3px 3px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      user-select: none;
      box-shadow: 5px 5px 6px #000;

      .screen-tab-list-box {
        position: absolute;
        left: -30px;
        top: 0;
        height: fit-content;
        width: 30px;
        background-color: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        border-radius: 3px 0 0 3px;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .screen-tab-item {
          color: #000;
          font-size: 14px;
          font-weight: bold;
          writing-mode: vertical-rl;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          letter-spacing: 4px;
          padding: 9px 0 5px 0;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 3px #000;
        }

        .screen-tab-item-active {
          background: rgba($color: #Fff, $alpha: 0.6);
        }
      }

      .screen-tab2-result {
        .advance-search-item {
          display: flex;
          flex-direction: column;

          .advance-search-row {
            .el-select__placeholder.is-transparent {
              color: #FFF;
            }

            .el-select__wrapper {
              background: transparent;

              .el-tag {
                max-width: 58px !important;
                font-size: 11px;
              }
            }
          }
        }
      }

      .screen-title {
        width: 100%;
        color: #333;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 2px dashed;
        margin-bottom: 10px;
      }

      .screen-type-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 40px);
        grid-template-rows: repeat(auto-fill, 60px);
        justify-content: center;
        gap: 10px;

        .type-item {
          width: 40px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s linear;
          cursor: pointer;

          &:hover {
            .type-item-img-box {
              transform: translateY(-2px);
              background: rgba($color: #eaf2ff, $alpha: 0.5);
              border: solid 2px var(--typeColor);
            }

            .type-item-title {
              width: 80%;
              font-weight: bold;
              background: var(--typeColorOpacity);
            }
          }

          &:active {
            .type-item-img-box {
              transform: translateY(-2px);
              background: rgba($color: #eaf2ff, $alpha: 0.9);
              border: solid 2px var(--typeColor);
            }

            .type-item-title {
              width: 80%;
              font-weight: bold;
              background: var(--typeColorOpacity);
            }
          }

          .type-item-img-box {
            width: 40px;
            height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            transition: all 0.2s linear;
            border-radius: 4px;
            flex-shrink: 0;

            img {
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              background: #FFF;
              border-radius: 50%;
            }
          }

          .type-item-active {
            background: rgba($color: #eaf2ff, $alpha: 0.5);
            border: solid 2px var(--typeColor);
          }

          .type-item-title {
            height: 17px;
            font-size: 14px;
            line-height: 14px;
            color: #FFF;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-top: 3px;
            transition: all 0.2s;
            border-radius: 3px;
          }

          .type-item-title-active {
            width: 100%;
            font-weight: bold;
            background: var(--typeColorOpacity);
          }
        }
      }

      .screen-button-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 20px;

        .screen-button {
          width: 100%;
          background: rgba($color: #fda06a, $alpha: 0.7);
          color: #fff;
          border-radius: 6px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 10px;
          padding-left: 10px;
          height: 25px;
          line-height: 14px;

          &:hover {
            background: rgba($color: #fda06a, $alpha: 0.8);
          }

          &:active {
            background: rgba($color: #e48d5a, $alpha: 0.9);
          }
        }
      }
    }
  }

  .empty-box {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    color: #FFF;
  }

  .daisy-pokemon-body {
    // width: $bodyWidth;
    flex: 1;
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    display: grid;
    grid-template-columns: repeat(auto-fill, $cardWidth);
    grid-template-rows: repeat(auto-fill, $cardHeight);
    gap: 15px;
    grid-auto-flow: row dense;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;

    .pokemon-item {
      width: $cardWidth;
      min-height: $cardHeight;
      padding: 10px 5px 5px 5px;
      box-sizing: border-box;
      border-radius: 5px;
      color: #fff;
      display: flex;
      flex-direction: row;
      justify-content: center;
      transition: all 0.2s;
      cursor: pointer;
      border: solid 5px #fbfbfba6;
      box-shadow: 2px 2px 6px #464646;

      .pokemon-item-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 5px;
        box-sizing: border-box;

        .pokemon-item-no-row {
          display: flex;
          flex-direction: row;

          .pokemon-ball {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            animation: rollback linear 0.3s;
          }

          .pokemon-no {
            font-size: 18px;
          }
        }

        .pokemonn-item-name-row {
          font-size: 16px;
          line-height: 35px;

          .pokemon-sub-name {
            font-size: 12px;
          }
        }
      }

      &:hover {
        transform: translate(0, -5px);
        box-shadow: 3px 3px 5px #888888;

        .pokemonimg {
          animation: upanddown 2s infinite;
        }

        .pokemonbgimg {
          animation: rollcenter 10s linear infinite;
          opacity: 0.8;
        }
      }

      .pokemon-img-box {
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;

        .pokemonimg {
          width: 120px;
          height: 120px;
          z-index: 2;
          position: relative;
        }

        .pokemonbgimg {
          position: absolute;
          width: 140px;
          height: 140px;
          z-index: 1;
          top: calc(50% - 70px);
          left: calc(50% - 70px);
          opacity: 0.3;
          transition: all 0.2s;
        }
      }

      .pokemon-type-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;
        padding: 5px 0;

        .pokemon-type-row-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 28px;
          font-size: 14px;

          img {
            background: #fff;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
        }
      }

      .pokemon-height-row {
        line-height: 25px;
        font-size: 14px;
      }

      .pokemon-weight-row {
        line-height: 25px;
        font-size: 14px;
      }
    }
  }

  .pokemon-loading {
    // width: min(90%, 1200px);
    flex: 1;
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    // min-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .loadingimg {
      width: 50px;
      height: 50px;
      animation: roll 2s linear infinite;
    }
  }

  @keyframes roll {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rollback {
    100% {
      transform: rotate(-360deg);
    }
  }

  @keyframes rollcenter {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes upanddown {
    0% {
      transform: translate(0, 0px);
    }

    50% {
      transform: translate(0, 10px);
    }

    100% {
      transform: translate(0, 0px);
    }
  }

  @keyframes showAndCollapse {
    // 0%{
    //   transform: translateY(-100%) scale(0);
    //   opacity: 0;
    // }
    // 100%{
    //   opacity: 1;
    //   transform: translateY(0)  scale(1);
    // }
  }

  .searchbox-leave-active,
  .searchbox-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
  }

  .searchbox-leave-active,
  .searchbox-enter {
    transform: translateY(-100%) scale(0);
    opacity: 0;

  }

  .searchbox-leave,
  .searchbox-enter-active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
