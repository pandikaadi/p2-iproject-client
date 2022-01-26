<template>
  <tr>
      <th scope="row">{{index+1}}</th>
      <td>{{barber.name}}</td>
      <td>{{barber.city}}</td>
      <td><button @click.prevent="book(barber.id)" type="button" class="btn btn-secondary">Book</button></td>
      
  </tr>
</template>

<script>

export default {
  name: 'TableRow',
  props: ['barber', 'index'],
  computed: {
    currentPage() {
      return this.$route.name
    }

  },
  methods: {
    book(page) {
      this.$router.push({
        path: `/book/${page}`
      })

    }


  },
  
}
</script>