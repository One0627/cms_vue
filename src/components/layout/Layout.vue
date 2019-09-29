<template>
  <el-container>
    <!--给el-header设置 高度-->
    <el-header style="height: 70px;">
      <div class="logo">
        <span style="color:#909399">
          <h2 class="el-icon-menu" /><b> 新感觉后台管理系统</b></span>
      </div>
      <div class="header-left">
        <div class="operate" ref="operate">
          <i class="iconfont el-icon-s-fold" :class="{rotate: foldState}" @click="changeSlidebarState" />
        </div>
      </div>
      <div class="header-right">
        <el-dropdown class="massage" trigger="click">
          <el-badge :value="100" class="item" :max="99">
            <a href="javascript:void(0)" title="消息">
              <i class="el-icon-bell" style="color:rgb(255, 255, 255)" />
            </a>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              评论
              <el-badge class="mark" :value="69" :max="99" />
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              回复
              <el-badge class="mark" :value="88" :max="99" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" src="@/assets/1.jpg">
            <div class="username-wrapper">
              <span class="user-name">{{this.username}}</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item @click.native="jump" title="Personal">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click.native="layout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="sideBarWidth" class="aside" :style="asideStyle">
        <!-- <el-scrollbar style="height: 100%;"> -->
        <sidebar :nodes="routers" :isCollapse="isCollapse" />
        <!-- </el-scrollbar> -->
      </el-aside>
      <!--使用element的自带的滚动条，官方文档没有-->
      <!-- <el-scrollbar style="height: 100%;width: 100%;"> -->
      <el-main style="height: 100%;width: 100%;">
        <tabs ref="add" />
      </el-main>
      <!-- </el-scrollbar> -->
    </el-container>
  </el-container>
</template>

<script>
import tabs from '@/components/layout/tabs.vue'
import sidebar from '@/components/layout/sidebar.vue'
import utils from '@/utils/utils'
import { mapActions, mapGetters } from 'vuex'
export default {
  created () {
    this.signal.off('ReceiveNotice')
    this.signal.on('ReceiveNotice', res => {
      this.$notify({
        title: res.title,
        message: res.message,
        type: res.type
      })
    })
  },
  components: {
    tabs,
    sidebar
  },
  computed: {
    ...mapGetters([
      'username',
      'routers'
    ]),
    asideStyle () {
      const style = {}
      if (this.isPhone) {
        style.position = 'absolute'
        style.height = `${this.clientHeight}px`
        style.zIndex = 12
        if (this.isCollapse === false) {
          style.transform = `translateX(-${this.sideBarWidth})`
        } else {
          style.transform = 'translateX(0)'
        }
      }
      return style
    }
  },
  data () {
    return {
      isCollapse: false,
      sideBarWidth: '240px',
      foldState: false // 控制左侧菜单栏按键
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    changeSlidebarState () {
      this.isCollapse = !this.isCollapse
      this.foldState = !this.foldState
    },
    // 退出功能
    layout () {
      this.$confirm('是否退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout().then(() => {
          this.signal.stop()
          this.$store.commit('SET_ROUTERS', '')
          this.$router.push('/login')
          this.$message.success('退出成功')
        })
      })
    },
    jump ($el) {
      utils.$emit('jump', $el.currentTarget.innerText, $el.currentTarget.title)
    }
  },
  watch: {
    isCollapse () {
      this.transX = 0
      this.sideBarWidth = this.isCollapse === false ? '240px' : '64px'
    }
  }
}
</script>

<style lang="less">
body {
  height: 100%;

  .el-container {
    height: 100%;

    .el-aside {
      background-color: #324157;
      color: #333;
      height: 100%;
      width: "260px";
      transition: all 0.3s linear;
      /*禁止横向滚动条的出现*/
      overflow-x: hidden;
    }
  }
}

/* .el-scrollbar__wrap {
  //禁止横向滚动条的出现
  overflow-x: hidden;
} */

.el-header {
  color: #333;
  text-align: center;
  padding: 0;
  background-color: #26292e;
  .logo {
    float: left;
    width: 240px;
    background-color: #26292e;
    height: 100%;
    line-height: 70px;
  }
  .header-left {
    float: left;
    height: 100%;
    line-height: 70px;
    .operate {
      position: absolute;
      top: 0;
      width: 30px;
      color: #fff;
    }
  }
  .header-right {
    float: right;
    height: 100%;
    line-height: 70px;

    .massage {
      position: absolute;
      top: 0;
      right: 160px;
      color: #fff;
    }
    .avatar-container {
      position: absolute;
      top: 0;
      right: 40px;
      color: #fff;
      .avatar-wrapper {
        cursor: pointer;
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .username-wrapper {
          display: inline-block;
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}

.el-main {
  background-color: #fdfdfd;
  color: #333;
  padding: 20px;
  height: 100%;
}
@media only screen and (max-width: 1400px) {
  .el-main {
    padding: 20px;
  }
}
.el-submenu__title i {
  margin-right: 10px;
}

.el-menu {
  background-color: #324157;
  border-right: none;
  .el-menu-item-group {
    background-color: #324157;
  }

  .el-menu-item.is-active {
    background-color: #49515c;
  }
  /* //一级节点高亮
  .el-submenu.is-opened {
    background-color: #49515c;
  } */
}

.el-menu-item:hover {
  background-color: #444d57;
  color: #ffffff !important;
}

.el-submenu__title:hover {
  background-color: #4a525d;
}

.item sup {
  margin-top: 20px;
  margin-right: 0px;
}
.iconfont {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transform: rotate(0deg);
  transition: all 0.3s linear;
  margin-right: 10px;
  &:hover {
    color: #3963bc;
  }
}
.rotate {
  transform: rotate(180deg);
  transition: all 0.3s linear;
}
</style>
