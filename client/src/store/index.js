import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogged: localStorage.access_token,
    baseUrl: `http://localhost:3000`,
    barbers: []
  },
  mutations: {
    COMMIT_LOGGED_IN(state, payload) {
      console.log(payload);
      state.isLogged = payload
    },
    COMMIT_SIGN_OUT(state) {
      localStorage.clear()
      state.isLogged = false
    },
    COMMIT_BARBERS(state, payload) {
      state.barbers = payload
    },
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
          localStorage.username = loggedUser.data.username
          router.push({
            name: 'Home'
          }).catch(err => {
            console.log(`>`, err);
          })
        } 
        
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async doRegister({state}, payload) {

      try {
        const registeredUser = await axios({
          method: 'post',
          url: `${state.baseUrl}/register`,
          data: {
            email: payload.email,
            username: payload.username,
            password: payload.password,
  
          }
        })
        if(registeredUser) {
          console.log(`register success`);
          router.push({
            name: 'Login'
          }).catch(err => {
            console.log(`>`, err);
          })
        } 
        
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async fetchBarbers({state, commit}, payload) {

      try {
        
        const barbers = await axios({
          method: 'get',
          url: `${state.baseUrl}/barbers`,
          params: {
            city: payload
          },
          headers: {
            access_token: localStorage.access_token
  
          },
        })
        if(barbers) {
          console.log(`fetch success`);
          commit("COMMIT_BARBERS", barbers.data)
        } 
        
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

  },
  modules: {
  }
})
