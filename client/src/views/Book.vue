<template>
  <Form :task="task" :submitText="submitText"/>
</template>

<script>
import Form from '../components/Form.vue'

export default {
  name: "Book",
  components: {
    Form
    
  },
  data() {
    return {
      task: 'add',
      submitText: 'create'
    }
    
    
  },
 
 
  methods: {
  },
    
    
    
};
</script>

