import Vue from "vue";
import "../style/detail.less"

const Detail = {
    render(fn){
        return fn("div", [fn("h1", ["Hello detail page"])])
    }
};

new Vue({
    el: "#app",
    render: (fn)=>fn(Detail)
});