<template>
  <div class="example">
    <<%=componentName%>/>
  </div>
</template>

<script>
import <%=componentName%> from '../index.vue'
export default {
  name: 'demo',
  components: {
  <%=componentName%>
},
data() {
  return {
    msg: 'Hello Webpack'
  };
},
};
</script>

<style>
.example {
  color: red;
}
.images {
  width: 100px;
}
</style>
