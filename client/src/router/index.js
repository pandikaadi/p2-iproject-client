import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Book from '../views/Book.vue'
import Edit from '../views/Edit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/book/:barberId',
    name: 'Book',
    component: Book  
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit  
  },
    {
      path: '*',
      redirect: '/'
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const access_token = localStorage.access_token

  if(to.path == "/login" && access_token) next("/")
  else if(to.path == "/register" && access_token) next("/")
  else if(to.path !== "/register" && to.path !== "/login" && !access_token) next("/login")
  else next()
})

export default router
