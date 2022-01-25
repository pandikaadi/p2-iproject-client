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
            <div class="col-4">
              <img
                class="rounded img-fluid w-100 home-img-top"
                src="https://images.pexels.com/photos/3281121/pexels-photo-3281121.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2"> 

              <div>Select barbers in your area:</div>
              <div class="dropdown p-2">
                <a @click.prevent=""
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
                  <li><a @click.prevent="fetchBarbers('Bandung')" class="dropdown-item" href="">Bandung</a></li>
                  <li><a @click.prevent="fetchBarbers('Jakarta')" class="dropdown-item" href="">Jakarta</a></li>
                </ul>
              </div>
      </div>
      <table v-if="barbers.length !== 0" class="table mt-2">
        <thead>
          <tr>
            <th scope="col" colspan="4">
            </th>
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

export default {
  name: "Home",
  components: {
    NavBar,
    TableRow,
  },
  data() {
    return {

    }
  },
  methods: {
    fetchBarbers(city) {
      this.$store.dispatch("fetchBarbers", city);
    }

  },
  computed: {
    barbers() {
      return this.$store.state.barbers;
    },
  },
  created() {
    
  },
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

/* body {
  background-color: pink;
} */
</style>
