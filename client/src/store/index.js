import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogged: localStorage.access_token,
    baseUrl: `http://localhost:3000`
  },
  mutations: {
    COMMIT_LOGGED_IN(state, payload) {
      console.log(payload);
      state.isLogged = payload
    }
  },
  actions: {

    async doLogin({state, commit}, payload) {

      try {
        const loggedUser = await axios({
          method: 'post',
          url: `${state.baseUrl}/login`,
          data: {
            email: payload.email,
            password: payload.password,
  
          }
        })
        if(loggedUser) {
          commit("COMMIT_LOGGED_IN", loggedUser.data.access_token)
          localStorage.access_token = loggedUser.data.access_token
          router.push({
            name: 'Home'
          })
        } 
        
      } catch (error) {
        console.log(error.response.data.message);
      }

      



    }
  },
  modules: {
  }
})
