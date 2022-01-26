<template>
  <nav class="navbar shadow p-3 navbar-expand-lg navbar-dark">
  <div class="container-fluid flex-row">
    
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      
      <div class="navbar-nav justify-content-between w-100 mx-4">
        <a class="nav-link active" style="color: #F94892; font-weight:800;" href="">Hi, {{username}}!</a>
        <a class="nav-link active abs-center-x" style="color: #F94892; font-weight:800;" @click.prevent="goTo('Home')" aria-current="page" href="">SHAVETIV8</a>
        <a class="nav-link active" style="color: #F94892; font-weight:800;" @click.prevent="signOut" href="" tabindex="-1">Sign Out</a>
      </div>
    </div>
  </div>
</nav>
</template>

<script>

export default {
  name: 'Navbar',
  data() {
    return {
      isLogged: false,
      username: ''
    }
  },
  computed: {
    currentPage() {
      return this.$route.name
    }

  },
  methods: {
    goTo(page) {
      this.$router.push({
        name: page
      }).catch(failure => {
        console.log(`>>>>>>>>>>>>>>>>>>>`, failure);
      })
    },
    signOut() {
      this.$store.commit("COMMIT_SIGN_OUT")
      this.$router.push({
        name: 'Login'
      }).catch(failure => {
        console.log(`>>>>>>>>>>>>>>>>>>>`, failure);
      })
      this.$swal({
          icon: `success`,
          title: 'you have been logged out',
          position: `top-end`,
          showConfirmButton: false,
          timer: 1500
        })

    }

  },
  created() {
    if(localStorage.access_token) {
      this.isLogged = true
      this.username = localStorage.username
    }
  },
  updated() {
    if(localStorage.access_token) {
      this.isLogged = true
      this.username = localStorage.username
    }
  }
  
}
</script>

<style scoped>
.navbar {
  background-color: #fff6f6;
  height: 50px
}
.nav-link {
  background-color: #fff6f6;
}

.abs-center-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}


</style>