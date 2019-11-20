<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {router,dynamicRouter} from '@/router'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
        var hasAdd=JSON.parse(sessionStorage.getItem('addRouter'));
        if(hasAdd){
          sessionStorage.setItem('addRouter',false);
          return this.$router.options.routes
        }
        var dR = new Array();
        var role=sessionStorage.getItem('shicai') != 'null'?JSON.parse(sessionStorage.getItem('shicai')).roleId:0;
        dynamicRouter.forEach((item) => {
          if(item.meta.roleId.indexOf(role)>-1 && item.children){
            let dR2=new Array();
            item.children.forEach(xx=>{
              if(xx.meta.roleId.indexOf(role)>-1){
                dR2.push(xx)
              }
              dR2.length>0?item.children=dR2:false;
            })
            dR.push(item);
          }
        });
        
        this.$router.addRoutes(dR);
        this.$router.options.routes=this.$router.options.routes.concat(dR);
        return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
