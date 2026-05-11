<template>
  <div class="nav-menu-container">
    <div class="nav-menu">
      <div class="nav-logo" @click="goHome">
        <img :src="logo" alt="logo" />
      </div>
      <ul class="nav-menu-list flex items-center height-100">
        <li class="flex items-center height-100">
          <el-dropdown placement="bottom" :show-timeout="50" class="flex items-center height-100" ref="lotteryDropdownRef" :teleported="false" popper-class="lottery-sub-menu">
            <div class="nav-menu-item flex items-center height-100">彩票游戏<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="lottery-list-wrapper">
                  <div class="lottery-group">
                    <div class="lg-title">
                      <span class="sd-icon icon-sd-icon-lhc" style="color: #488ded;"></span>
                      六合彩
                    </div>
                    <div class="lg-list">
                      <div class="lg-list-item"
                           v-if="commonStore.lotteryList?.lhc"
                           v-for="(lottery, sign) in commonStore.lotteryList.lhc"
                           @click="goLotteryLhc(sign)"
                           :key="sign"
                      >
                        {{ lottery.name }}
                      </div>
                    </div>
                  </div>
                  <div class="lottery-group">
                    <div class="lg-title"><span class="sd-icon icon-sd-pk10" style="color: #67C23A;"></span>赛车</div>
                    <div class="lg-list">
                      <div class="lg-list-item"
                           v-if="commonStore.lotteryList?.pk10"
                           v-for="(lottery, sign) in commonStore.lotteryList.pk10"
                           @click="goLotteryPk10(sign)"
                           :key="sign"
                      >
                        {{lottery.name}}
                      </div>
                    </div>
                  </div>
                  <div class="lottery-group">
                    <div class="lg-title"><span class="sd-icon icon-sd-ssc" style="color: #F5A623;"></span>时时彩</div>
                    <div class="lg-list">
                      <div class="lg-list-item"
                           v-if="commonStore.lotteryList?.ssc"
                           v-for="(lottery, sign) in commonStore.lotteryList.ssc"
                           @click="goLotterySsc(sign)"
                           :key="sign"
                      >
                        {{ lottery.name }}
                      </div>
                    </div>
                  </div>
                  <div class="lottery-group">
                    <div class="lg-title"><span class="sd-icon icon-sd-ks" style="color: #FA5555;"></span>快三</div>
                    <div class="lg-list">
                      <div class="lg-list-item"
                           v-if="commonStore.lotteryList?.ks"
                           v-for="(lottery, sign) in commonStore.lotteryList.ks"
                           @click="goLotteryKs(sign)"
                           :key="sign"
                      >
                        {{ lottery.name }}
                      </div>
                    </div>
                  </div>
                  <div class="lottery-group">
                    <div class="lg-title"><span class="sd-icon icon-sd-poker" style="color: brown;"></span>其他</div>
                    <div class="lg-list">
                      <div class="lg-list-item">香港六合彩</div>
                      <div class="lg-list-item">新香港六合彩</div>
                      <div class="lg-list-item">澳门六合彩</div>
                      <div class="lg-list-item">新加坡六合彩</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-dropdown placement="top-start" :teleported="false" class="flex items-center height-100">
            <div class="nav-menu-item">棋牌游戏<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-if="commonStore.thirdGameList?.chess"
                    v-for="(thirdName, sign) in commonStore.thirdGameList.chess" @click="goLotteryLhc(sign)"
                >
                  {{ thirdName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-dropdown placement="top-start" class="flex items-center height-100">
            <div class="nav-menu-item">体育游戏<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-if="commonStore.thirdGameList?.sport"
                    v-for="(lotteryName, sign) in commonStore.thirdGameList.sport" @click="goLotteryLhc(sign)"
                >
                  {{ lotteryName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-dropdown placement="top-start" class="flex items-center height-100">
            <div class="nav-menu-item">真人视讯<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-if="commonStore.thirdGameList?.live"
                    v-for="(lotteryName, sign) in commonStore.thirdGameList.live" @click="goLotteryLhc(sign)"
                >
                  {{ lotteryName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-dropdown placement="top-start" class="flex items-center height-100">
            <div class="nav-menu-item">电子游戏<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-if="commonStore.thirdGameList?.e_game"
                    v-for="(lotteryName, sign) in commonStore.thirdGameList.e_game" @click="goLotteryLhc(sign)"
                >
                  {{ lotteryName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-dropdown placement="top-start"  class="flex items-center height-100">
            <div class="nav-menu-item">捕鱼游戏<span class="sd-menu-icon icon-sd-down-btn"></span></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-menu>
                  <el-dropdown-item
                      v-if="commonStore.thirdGameList?.fishing"
                      v-for="(lotteryName, sign) in commonStore.thirdGameList.fishing" @click="goLotteryLhc(sign)"
                  >
                    {{ lotteryName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li class="flex items-center height-100">
          <el-divider direction="vertical" />
        </li>
        <li class="flex items-center height-100">
          <span class="flex items-center height-100">优惠活动</span>
        </li>
        <li class="flex items-center height-100">
          <div class="flex items-center height-100">在线客服</div>
        </li>
        <li class="flex items-center height-100">
          <div class="flex items-center height-100">手机 APP</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/commonStore.js'

const commonStore = useCommonStore()
const router = useRouter()

const logo = '/images/logo.png'
const lotteryDropdownRef = ref(null);

const goHome = () => {
  router.push('/home')
}

const goLotteryLhc = (lotterySign) => {
  lotteryDropdownRef.value.handleClose();
  router.push({name: 'lotteryLhc', params: { sign: lotterySign }})
}

const goLotterySsc = (lotterySign) => {
  lotteryDropdownRef.value.handleClose();
  router.push({name: 'lotterySsc', params: { sign: lotterySign }})
}

const goLotteryKs = (lotterySign) => {
  lotteryDropdownRef.value.handleClose();
  router.push({name: 'lotteryKs', params: { sign: lotterySign }})
}

const goLotteryPk10 = (lotterySign) => {
  lotteryDropdownRef.value.handleClose();
  router.push({name: 'lotteryPk10', params: { sign: lotterySign }})
}

const goLotterySd = (lotterySign) => {
  lotteryDropdownRef.value.handleClose();
  router.push({name: 'lotterySd', params: { sign: lotterySign }})
}

onMounted(() => {
});
</script>

<style lang="scss">

.nav-menu-container {
  background-color: var(--hm-bg-color);
  .nav-menu {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: var(--width-small-container);
    max-width: var(--width-container);
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
    .nav-logo img {
      height: 40px;
      cursor: pointer;
    }
    .nav-menu-list {
      list-style: none;
      padding: 0;
      gap: 20px;
      .el-dropdown {
        position: inherit;
        height: 100%;
      }
      .nav-menu-item {
        position: relative;
        cursor: pointer;
        padding-left: 2.5em;
      }

      .lottery-sub-menu {
        overflow: hidden;
        justify-content: center;
        left: 0 !important;
        top: 100px !important;
        .lottery-list-wrapper {
          width: 100vw;
          display: flex;
          justify-content: center;
          overflow-x: hidden;
          box-sizing: border-box;
          overflow-y: scroll;
          -ms-overflow-style: none;
          margin: 15px 0;
          .lottery-group:last-child {
            border-style: none;
          }
          .lottery-group {
            border-right-width: 1px;
            border-style: dashed;
            border-color: var(--color-gray-2);
            padding-left: 15px;
            padding-right: 15px;
            .lg-title {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              margin: 10px 0;
              .sd-icon {
                font-size: 18px;
                color: #326BC7;
              }
            }
            .lg-list-item {
              background-color: var(--color-background);
              border-radius: .25rem;
              border-width: 1px;
              border-style: solid;
              border-color: var(--color-gray-3);
              width: 95px;
              cursor: pointer;
              text-align: center;
              font-size: 12px;
              line-height: 25px;
              margin: 5px 0 0 5px;
              writing-mode: horizontal-tb;
            }
            .lg-list-item:hover {
              transition-duration: .5s;
              border-width: 1px;
              border-color: var(--color-primary-1);
              background-color: var(--color-primary-lighten-3);
              color: var(--color-primary-1);
            }
          }
          .lottery-list-wrapper::-webkit-scrollbar {
            display: none; /* Chrome 和 Safari 隐藏滚动条 */
          }
        }
      }
    }
  }
}


.nav-dropdown {
  display: none;
  position: absolute;
  background-color: white;
  top: 40px;
  left: 0;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-menu__item:hover .nav-dropdown {
  display: block;
}
</style>
