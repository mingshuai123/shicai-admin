import { login, logout, getInfo } from '@/api/user'
import { getsessionInfo, setToken, removeToken,setsessionInfo } from '@/utils/auth'
import { resetRouter } from '@/router'
const info=(getsessionInfo()== 'null'|| getsessionInfo()== null || !getsessionInfo())?{roleId:0,userName:'',token:''}:JSON.parse(getsessionInfo());
const state = {
  token: info.token,
  userName: info.userName,
  roleTitle:info.roleTitle,
  roleName:info.roleName,
  phone:info.phone,
  roleId:info.roleId,
  state:info.state
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { name, pwd } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: name, pwd: pwd }).then(response => {
        if(response.code==0){
          var  data  = response.data
          state.userName=data.userName;
          state.uid=data.uid;
          state.roleTitle=data.roleTitle;
          state.roleName=data.roleName
          state.phone=data.phone;
          state.token=data.token;
          state.roleId=data.roleId;
          state.state=data.state;
          setsessionInfo(JSON.stringify(state));
          setToken(data.token)
          resolve(response)
        }else{
          resolve(response)
        }
        
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
        setsessionInfo(null);
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
        
    })
  },
  
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

