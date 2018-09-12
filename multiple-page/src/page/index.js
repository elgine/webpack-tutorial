import Vue from "vue";
import "../style/index.less";
import "../style/bg.less";

window.onload = function(){
    new Vue({
        el: "#app",
        render: (fn)=>fn("div", [fn("h1", ["Hello home page"])])
    });
}