<template>
  <div class="justify-content-center">
    <nav-bar />
    <div class="row mt-2 p-2">
      <div class="col-6 align-items-center justify-content-center">
        <form class="w-75 column mx-auto" @submit.prevent="doTask">
          <label
            class="align-self-start mb-2 small"
            style="font-size: small; opacity: 0.9"
            >Address</label
          >
          <textarea
            v-model="user.address"
            type="text"
            placeholder="your address"
            class="w-100 p-2 mb-2 rounded border-1"
            style="font-size: 0.8em"
          />
          <label
            for="login-password"
            class="align-self-start mb-1 small w-100"
            style="font-size: small; opacity: 0.9"
            >Date</label
          >
          <div class=" m-2 w-100">
          <DatePicker  v-model="appointmentDate" :min-date="new Date()" />
          </div>
          <div class="my-2">
          <label
            for="login-password"
            class="align-self-start mb-1 small px-2"
            style="font-size: small; opacity: 0.9"
            >Schedule</label
          >
          <select v-model="user.schedule">
            <option :disabled="appointments[1]" value=1>08.00</option>
            <option :disabled="appointments[2]" value=2>10.00</option>
            <option :disabled="appointments[3]" value=3>13.00</option>
            <option :disabled="appointments[4]" value=4>15.00</option>
            <option :disabled="appointments[5]" value=5>17.00</option>
          </select>
          </div>

          <div class="p-1 m-2" v-if="lat !== 0 || long !== 0">
          Total price: {{ priceFormatter }}
        </div>

          <input
            type="submit"
            class="btn sign-in-btn w-100 mb-2"
          />
        </form>
      </div>
      <div class="col-6 my-auto">
        
        <div>
          <button class="btn sign-in-btn my-3" @click.prevent="geoLocateNav">
            Click here to estimate your location!
          </button>
        </div>

        <div class="mx-auto p-2" style="height: 450px; width: 450px">
          <l-map
            @click="addMarker"
            v-if="showMap"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 80%"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-marker :lat-lng="withPopup">
              <l-popup>
                <div>
                  <p v-show="showParagraph">{{ user.address }}</p>
                </div>
              </l-popup>
            </l-marker>
            <l-marker :lat-lng="barberLoc">
              <l-popup>
                <div>
                  <p v-show="showParagraph">{{ barber.name }}</p>
                </div>
              </l-popup>
            </l-marker>
          </l-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import NavBar from "./NavBar.vue";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import axios from "axios";
import utmObj from "utm-latlng";
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: "Form",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    NavBar,
    DatePicker
  },
  data() {
    return {
      user: {
        address: this.userLocation,
        schedule: null,
      },
      appointmentDate: null,
      barber: {},
      barberId: null,
      zoom: 13,
      center: latLng(-6.91654, 107.60742),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(-6.91654, 107.60742),
      currentZoom: 11.5,
      barberLoc: latLng(0,0),
      currentCenter: latLng(-6.91654, 107.60742),
      showParagraph: true,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      lat: 0,
      long: 0,
      appointments: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      }
    };
  },
  watch: {
    userLocation() {
      this.user.address = this.userLocation;
    },
    appointmentDate() {
      this.fetchAppointments()
    }
  },
  computed: {
    userLocation() {
      return this.$store.state.userLocation;
    },
    priceCalculate() {
      const utm = new utmObj();

      let utmCust = utm.convertLatLngToUtm(this.lat, this.long, 2);
      let utmBarber = utm.convertLatLngToUtm(
        this.barber.lat,
        this.barber.long,
        2
      );
      const powerDistance =
        Math.pow(Math.abs(utmCust.Easting - utmBarber.Easting), 2) +
        Math.pow(Math.abs(utmCust.Northing - utmBarber.Northing), 2);
      const distance = Math.pow(powerDistance, 0.5);
      return Math.round(50_000 + distance * 5);
      
    },
    priceFormatter() {
      let formattedPrice = this.priceCalculate.toString().split("");

      for (
        let i = (formattedPrice.length % 3) - 1;
        i < formattedPrice.length;
        i += 3
      ) {
        if (i !== formattedPrice.length - 1) formattedPrice[i] += `.`;
      }

      return `Rp. ${formattedPrice.join("")},00`;

    },
    userBooking() {
      return this.$store.state.userBooking
    },
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {},
    geoLocateNav() {
      navigator.geolocation.getCurrentPosition((position) => {
        let { latitude, longitude } = position.coords;
        this.withPopup = latLng(latitude, longitude);
        this.center = latLng(latitude, longitude);
        this.currentCenter = latLng(latitude, longitude);
        this.lat = latitude;
        this.long = longitude;
        this.$store.dispatch("fetchUserLocation", {
          lat: this.lat,
          long: this.long,
        });
        this.user.address = this.userLocation;
      });
    },
    addMarker(event) {
      this.withPopup = latLng(event.latlng.lat, event.latlng.lng);
      this.lat = event.latlng.lat;
      this.long = event.latlng.lng;
      this.$store.dispatch("fetchUserLocation", {
        lat: this.lat,
        long: this.long,
      });
      this.user.address = this.userLocation;
    },
    async fetchBarber(barberId) {
      try {
        const barber = await axios({
          method: "get",
          url: `${this.$store.state.baseUrl}/barbers/${barberId}`,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        if (barber) {
          console.log(`fetch success`);
          this.barber = barber.data;
          this.barberLoc = latLng(barber.data.lat, barber.data.long)
          console.log(this.barber);
          if (this.barber.city === "Jakarta") {
            this.currentCenter = latLng(-6.2, 106.816666);
            this.center = latLng(-6.2, 106.816666);
            this.withPopup = latLng(-6.2, 106.816666);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchAppointments() {
      try {
        
        const appointments = await axios({
          method: "get",
          url: `${this.$store.state.baseUrl}/appointments`,
          headers: {
            access_token: localStorage.access_token,
          },
          params: {
            selectedDate: this.appointmentDate,
            barberId: this.barber.id

          }
        });
        if (appointments.data.length > 0) {
          appointments.data.forEach( e => {
            this.appointments[e.schedule] = true


          })
        } else {
          console.log(`hehehe`);
          this.appointments = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      }

        }
      } catch (error) {
        console.log(error);
      }
    },
    async doTask() {
      if(this.$route.name === 'Book') {
        try {
          const newApp = await axios({
            method: 'POST',
            url: `${this.$store.state.baseUrl}/appointments/${this.$route.params.barberId}`,
            headers: {
              access_token: this.$store.state.isLogged
            },
            data: {
              lat: this.lat,
              long: this.long,
              address: this.user.address,
              appointmentDate: this.appointmentDate,
              schedule: +this.user.schedule,
              price: this.priceCalculate
            }
          })
  
          if(newApp) {
            this.$store.dispatch("fetchUserBooking")
            this.$router.push({
              name: 'Home'
            }).catch(err => {
              console.log(err);
            })
          }
        } catch (error) {
          console.log(error);
          
        }
      } else {

        try {
          const editedApp = await axios({
            method: 'PUT',
            url: `${this.$store.state.baseUrl}/myAppointment`,
            headers: {
              access_token: this.$store.state.isLogged
            },
            data: {
              lat: this.lat,
              long: this.long,
              address: this.user.address,
              appointmentDate: this.appointmentDate,
              schedule: +this.user.schedule,
              price: this.priceCalculate,
              barberId: this.userBooking.barberId
            }
          })
  
          if(editedApp) {
            this.$store.dispatch("fetchUserBooking")
            this.$router.push({
              name: 'Home'
            }).catch(err => {
              console.log(err);
            })
          }
        } catch (error) {
          console.log(error);
          
        }

        

      }
    }
  },
  created() {
    if(this.$route.name === 'Edit') {
      this.$store.dispatch("fetchUserBooking")
      this.user.address = this.userBooking.address
      this.user.schedule = this.userBooking.schedule
      this.appointmentDate = this.userBooking.appointmentDate
      this.lat = this.userBooking.lat
      this.long = this.userBooking.long
      this.barber.id = this.userBooking.barberId
      this.barber = this.userBooking.Barber
      this.barber.lat = this.userBooking.Barber.lat
      this.barber.long = this.userBooking.Barber.long
      this.withPopup = latLng(this.userBooking.lat, this.userBooking.long) 
      this.barberLoc = latLng(this.userBooking.Barber.lat, this.userBooking.Barber.long) 
      this.fetchBarber(this.userBooking.barberId);
      this.fetchAppointments();
    }
    if(this.$route.name === 'Book') {
      this.barber.id = this.$route.params.barberId
      this.fetchBarber(this.$route.params.barberId);

    }
  },
};
</script>

<style>
.leaflet-center {
  left: 50%;
  transform: translate(-50%, 0%);
}

.sign-in-btn {
  background-color: rgb(251, 169, 182);
  color: white;
}
</style>
