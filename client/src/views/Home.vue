<template>
  <div class="d-flex flex-column">
    <NavBar class="rounded" />

    <div class="container">
      <div class="mt-3">
        <div class="column">
          <div class="row pt-2">
            <div class="col-8">
              <img
                class="rounded img-fluid w-100 home-img-top"
                src="https://i.imgur.com/dXUOLfQ.jpg"
              />
            </div>
            <div class="col-4" >
             
              <img
                class="rounded img-fluid w-100 home-img-top"
                src="https://images.pexels.com/photos/3281121/pexels-photo-3281121.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-100 row justify-content-center my-2 mx-auto">
        <div class="col-6 ">
         <table style="max-height: 200px; font-size:0.8em;" class="table mt-1 table-danger" >
                <thead>
                  <tr>
                    <th colspan="3" scope="col">Today's weather forecast</th>
                  </tr>
                  <tr>
                    <th scope="col">City</th>
                    <th scope="col">Weather</th>
                    <th scope="col">Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Bandung</th>
                    <td>{{ forecast.bandung }}</td>
                    <td>{{ bandungMessage }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Jakarta</th>
                    <td>{{ forecast.jakarta }}</td>
                    <td>{{ jakartaMessage }}</td>
                  </tr>
                </tbody>
              </table>
        </div>
      <div v-if="!userBooking.id" class="col-6 align-self-center ">
        <div  class="dropdown ">
          <a
            @click.prevent=""
            class="btn btn-secondary dropdown-toggle"
            href=""
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Your City
          </a>

          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li>
              <a
                @click.prevent="fetchBarbers('Bandung')"
                class="dropdown-item"
                href=""
                >Bandung</a
              >
            </li>
            <li>
              <a
                @click.prevent="fetchBarbers('Jakarta')"
                class="dropdown-item"
                href=""
                >Jakarta</a
              >
            </li>
          </ul>
        </div>
      </div>
      </div>
        <table v-if="userBooking.id"  style="max-height: 200px; font-size:0.8em;" class="table mt-1 table-danger" >
                <thead>
                  <tr>
                    <th colspan="4" scope="col">Your Booking</th>
                  </tr>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Barber Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle">
                    <th scope="row">{{userBooking.formatted.dateString}}</th>
                    <td>{{userBooking.Barber.name}}</td>
                    <td>{{ userBooking.formatted.formattedPrice }}</td>
                    <td class="row">
                      <div >
                      <a @click.prevent="editBooking" style="font-size:0.8em" class="w-50 mb-1 btn btn-sm btn-light">Edit Booking</a>
                      </div>
                      <div>
                      <a @click.prevent="cancelBooking" style="font-size:0.8em" class="w-50 btn btn-sm btn-dark">Cancel Booking</a>
                      </div>
                      </td>
                  </tr>
                </tbody>
              </table>

      <table v-if="barbers.length !== 0 && !userBooking.id" class="table mt-2">
        <thead>
          <tr>
            <th scope="col" colspan="4">Pick your barber</th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">City</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <TableRow
            v-for="(barber, index) in barbers"
            :key="barber.id"
            :barber="barber"
            :index="index"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from "../components/NavBar.vue";
import TableRow from "../components/TableRow.vue";
import axios from "axios";
export default {
  name: "Home",
  components: {
    NavBar,
    TableRow,
  },
  data() {
    return {
      forecast: {
        bandung: "",
        jakarta: "",
      },
      priceString: '',
      dateString: '',
      barberName: ''


    };
  },
  methods: {
    fetchBarbers(city) {
      this.$store.dispatch("fetchBarbers", city);
    },
    editBooking() {
      this.$router.push({
        path: '/edit'
      })
    },
    cancelBooking() {
      this.$store.dispatch("cancelBooking")
      this.$store.dispatch("fetchUserBooking")
    },
    async fetchWeathers() {
      try {

        const bandungWeather = await axios({
          method: `get`,
          url: `${this.$store.state.baseUrl}/forecast`,
          headers: {
            access_token: localStorage.access_token,
          },
          params: {
            city: `Bandung`,
          },
        });
        const jakartaWeather = await axios({
          method: `get`,
          url: `${this.$store.state.baseUrl}/forecast`,
          headers: {
            access_token: localStorage.access_token,
          },
          params: {
            city: `Jakarta`,
          },
        });
        if (bandungWeather && jakartaWeather) {
          console.log(
            bandungWeather.data.weather[0].main,
            jakartaWeather.data.weather[0].main
          );
          this.forecast.bandung = bandungWeather.data.weather[0].main;
          this.forecast.jakarta = jakartaWeather.data.weather[0].main;
        }
      } catch (error) {
        this.$swal({
          icon: `error`,
          title: error.response.data.message,
          position: `top-end`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    },
  },
  computed: {
    // priceFormatter() {
    //   let formattedPrice = this.userBooking.price.toString().split("");

    //   for (
    //     let i = (formattedPrice.length % 3) - 1;
    //     i < formattedPrice.length;
    //     i += 3
    //   ) {
    //     if (i !== formattedPrice.length - 1) formattedPrice[i] += `.`;
    //   }

    //   return `Rp. ${formattedPrice.join("")},00`;

    // },
    // formattedDate() {
    //  if(this.userBooking) {
    //    console.log(this.userBooking);
    //    return this.userBooking.appointmentDate.substring(0, 10).split('-').reverse().join('/')}
    //  else return null
    // },
    userBooking() {
      return this.$store.state.userBooking
    },
    barbers() {
      return this.$store.state.barbers;
    },
    jakartaMessage() {
      if (
        this.forecast.jakarta === "Thunderstorm" ||
        this.forecast.jakarta === "Rain" ||
        this.forecast.jakarta === "Drizzle" ||
        this.forecast.jakarta === "Snow"
      ) {
        return "There's a chance of slight delay in your barber's arrival due to the bad weather";
      } else {
        return "it's a fine day to shave someone's head!";
      }
    },
    bandungMessage() {
      if (
        this.forecast.bandung === "Thunderstorm" ||
        this.forecast.bandung === "Rain" ||
        this.forecast.bandung === "Drizzle" ||
        this.forecast.jakarta === "Snow"
      ) {
        return "There's a chance of slight delay in your barber's arrival due to the bad weather";
      } else {
        return "it's a fine day to shave someone's head!";
      }
    },
  },
  created() {
    this.fetchWeathers();
    this.$store.dispatch("fetchUserBooking")
    
    
  },
  updated() {

  }
};
</script>
<style scoped>
.img {
  object-fit: cover;
  max-height: 5%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.text-block {
  position: absolute;
  font-size: 12px;
  bottom: 10px;
  left: 20px;
  background-color: rgba(125, 32, 32, 0.4);
  padding: 10px;
  margin-left: 5px;
  color: rgb(255, 255, 255);
  padding-left: 20px;
  padding-right: 20px;
  text-shadow: white;
  /* -webkit-text-stroke-width: 0.2px;
    -webkit-text-stroke-color: #918f8f;
    -webkit-text-fill-color: #646363; */
}

.home-img-top {
  height: 200px;
  object-fit: cover;
}

.navbar {
  -webkit-box-shadow: 0px 10px 17px 2px rgba(189, 189, 189, 1);
  -moz-box-shadow: 0px 10px 17px 2px rgba(189, 189, 189, 1);
  box-shadow: 0px 10px 17px 2px rgba(189, 189, 189, 1);
}

.table {
  border-radius: 6px;
  overflow: hidden;
}
.table-danger {
  color:rgb(84, 84, 86);
}

/* body {
  background-color: pink;
} */
</style>
