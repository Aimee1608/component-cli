<template>
  <div class="example">
    {{ msg }}
    <img src="./images/test.png" alt="" class="images"/>
  </div>
</template>

<script>
export default {
  name: '<%=componentName%>',
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
