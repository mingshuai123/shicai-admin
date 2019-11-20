import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getsessionInfo } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
var routerjs= require('./router/index.js')
router.beforeEach(async(to, from, next) => {

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const sessoininfo = JSON.parse(getsessionInfo('shicai'))
  if (sessoininfo&&sessoininfo.token) {
    if(to.name === undefined){
      var hasAdd=JSON.parse(sessionStorage.getItem('addRouter'));
        if(hasAdd){
          sessionStorage.setItem('addRouter',false);
          return router.options.routes
        }
      var c=(sessionStorage.getItem('pathName') != 'null'&&sessionStorage.getItem('pathName'))?sessionStorage.getItem('pathName'):'/';
      var dynamicRouter=routerjs.dynamicRouter;
      var dR = new Array();
      var role=(sessionStorage.getItem('shicai') != 'null'&&sessionStorage.getItem('shicai'))?JSON.parse(sessionStorage.getItem('shicai')).roleId:0;
      dynamicRouter.forEach((item) => {
        if(item.meta.roleId.indexOf( role)>-1 && item.children){
          let dR2=new Array();
          item.children.forEach(xx=>{
            if(xx.meta.roleId.indexOf( role)>-1){
              dR2.push(xx)
            }
            dR2.length>0?item.children=dR2:false;
          })
          dR.push(item);
        }
      });
      router.addRoutes(dR);
      router.options.routes=router.options.routes.concat(dR);
      sessionStorage.setItem('addRouter',true)
      router.push({path:c })
    }
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
