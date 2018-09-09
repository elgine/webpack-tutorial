import Vue from "vue";

const log = (fnName, str)=>{
    return `Function: ${fnName}, message: ${str}`
};

Vue.prototype.log = log;

export default log;