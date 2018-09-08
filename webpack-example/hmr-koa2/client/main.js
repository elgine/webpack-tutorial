import helloWorld from "./hello-world";

console.log(helloWorld());

if (module.hot) {
    module.hot.accept("./hello-world.js", function(){
        console.log("Accept HMR");
    })
}