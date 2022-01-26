<template>
  <Form :task="task" :submitText="submitText"/>
</template>

<script>
import Form from '../components/Form.vue'

export default {
  name: "Edit",
  components: {
    Form
    
  },
  data() {
    return {
      task: 'edit',
      submitText: 'create'
    }
    
    
  },
 
 
  methods: {
  },
    
    
    
};
</script>

