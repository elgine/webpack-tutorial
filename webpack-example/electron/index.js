const path = require("path");

new Promise((resolve)=>{
    resolve(1 + 2);
});

window.onload = function(){
    console.log(__filename);
    //console.log("window loaded");
    document.body.style.background = "#0f0";
}