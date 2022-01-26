import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogged: localStorage.access_token,
    baseUrl: `http://localhost:3000`,
    barbers: [],
    userLocation: "",
    userBooking: {},
  },
  mutations: {
    COMMIT_LOGGED_IN(state, payload) {
      console.log(payload);
      state.isLogged = payload;
    },
    COMMIT_SIGN_OUT(state) {
      console.log(`signoutstate>>>>>>>>`);
      localStorage.clear();
      state.isLogged = false;
      state.userBooking = {},
      state.userLocation = ""
    },
    COMMIT_BARBERS(state, payload) {
      state.barbers = payload;
    },
    COMMIT_LOCATION(state, payload) {
      state.userLocation = payload;
    },
    COMMIT_BOOKING(state, payload) {
      state.userBooking = payload;
    },
    COMMIT_CANCEL_BOOKING(state) {
      state.userBooking = {};
    },
  },
  actions: {
    async cancelBooking({commit, state}) {
      try {
        const deleteApp = await axios({
          method: "delete",
          url: `${state.baseUrl}/myAppointment`,
          headers: {
            access_token: localStorage.access_token
          },
        });
        if (deleteApp) {
          commit("COMMIT_CANCEL_BOOKING");
          
        }
      } catch (error) {
        console.log(error.response.data.message);
      }

    },
    async doLogin({ state, commit, dispatch }, payload) {
      try {
        const loggedUser = await axios({
          method: "post",
          url: `${state.baseUrl}/login`,
          data: {
            email: payload.email,
            password: payload.password,
          },
        });
        if (loggedUser) {
          commit("COMMIT_LOGGED_IN", loggedUser.data.access_token);
          localStorage.access_token = loggedUser.data.access_token;
          localStorage.username = loggedUser.data.username;
          dispatch("fetchUserBooking")
          router
            .push({
              name: "Home",
            })
            .catch((err) => {
              console.log(`>`, err);
            });
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async doRegister({ state }, payload) {
      try {
        const registeredUser = await axios({
          method: "post",
          url: `${state.baseUrl}/register`,
          data: {
            email: payload.email,
            username: payload.username,
            password: payload.password,
          },
        });
        if (registeredUser) {
          console.log(`register success`);
          router
            .push({
              name: "Login",
            })
            .catch((err) => {
              console.log(`>`, err);
            });
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async fetchBarbers({ state, commit }, payload) {
      try {
        const barbers = await axios({
          method: "get",
          url: `${state.baseUrl}/barbers`,
          params: {
            city: payload,
          },
          headers: {
            access_token: localStorage.access_token,
          },
        });
        if (barbers) {
          console.log(`fetch success`);
          commit("COMMIT_BARBERS", barbers.data);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async fetchUserLocation({ state, commit }, payload) {
      try {

        const location = await axios({
          method: "post",
          url: `${state.baseUrl}/translate`,
          data: {
            lat: payload.lat,
            long: payload.long,
          },
          headers: {
            access_token: localStorage.access_token,
          },
        });
        if (location) {
          console.log(`fetch success`);
          commit("COMMIT_LOCATION", location.data);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async fetchUserBooking({ state, commit }) {
      try {
        const booking = await axios({
          method: "get",
          url: `${state.baseUrl}/myAppointment`,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        if (booking.data) {
          console.log(booking);
          let formattedPrice = booking.data.price.toString().split("");

          for (
            let i = (formattedPrice.length % 3) - 1;
            i < formattedPrice.length;
            i += 3
          ) {
            if (i !== formattedPrice.length - 1) formattedPrice[i] += `.`;
          }

          formattedPrice = `Rp. ${formattedPrice.join("")},00`;
          let dateString = new Date(booking.data.appointmentDate).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }) 
            .substring(0, 9)
            console.log(booking.data.appointmentDate);
            booking.data.formatted = {formattedPrice, dateString}
          commit("COMMIT_BOOKING", booking.data);
        }
      } catch (error) {
        
        console.log(error.response.data.message);
      }
    },
  },
  modules: {},
});
