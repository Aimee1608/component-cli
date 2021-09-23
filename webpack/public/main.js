import Vue from "vue";
import VConsole from "vconsole";
import App from "./common/index.js";

new VConsole();
new Vue({
  el: "#app",
  render: (h) => h(App),
});
