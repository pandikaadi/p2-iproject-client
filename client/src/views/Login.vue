<template>
  <div class="d-flex flex-row ">
    <div class="col-5 ">
      <div class="mh-100 login-left mw-100">

      </div>

    </div>
    <div class="d-flex flex-column align-items-center col-4 m-auto mt-1">
    <div class="logo col-6 d-flex justify-content-center ">
      <img src="../assets/b8dd7b5ee03c4cd2b8a3d7686cbbe29d.png"/>
    </div>
      <div class="mt-0 pt-0 mb-2 h3">Sign In</div>
      <div class="mb-2 text-muted h6 mb-3" style="font-size: small">
        Sign In to access your account
      </div>
      <form @submit.prevent="doLogin">
        <label
          for="login-email"
          class="align-self-start mb-2 small"
          style="font-size: small; opacity: 0.9"
          >Email Address</label
        >
        <input
          v-model="login.email"
          type="email"
          placeholder="your@email.com"
          id="login-email"
          class="w-100 p-2 mb-2 rounded border-1"
        />
        <label
          for="login-password"
          class="align-self-start mb-1 small"
          style="font-size: small; opacity: 0.9"
          >Password</label
        >
        <input
          v-model="login.password"
          type="password"
          placeholder="Your Password"
          id="login-password"
          class="w-100 mb-3 p-2 rounded border-1"
        />

        <input
          type="submit"
          class="btn sign-in-btn w-100 mb-2"
          value="Sign In"
        />
      </form>
      <div class="d-flex flex-column align-items-center col-8">
        <div class="mb-2 text-muted" style="font-size: small">Or</div>
        
        <div class="text-muted mt-1 mb-2" style="font-size: small">
          Don't have an account yet?

          <a href="">Sign Up</a>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  components: {
  },
  data() {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    doLogin() {
      this.$store.dispatch("doLogin", this.login)
    }
  }
}
</script>
<style scoped>
.login-left {
  height: 700px;
 background-image: url("../assets/pexels-maria-orlova-4947276.jpg");
 background-size: cover;
}
.img {
 object-fit: cover;
 max-height: 5%;
}
.sign-in-btn {
 background-color: rgb(251, 169, 182);
 color: white;
}
</style>
