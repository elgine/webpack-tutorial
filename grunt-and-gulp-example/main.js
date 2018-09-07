window.onload = function(){
    console.log("============== Execute 2 + 3 + 4 + 5 + 7 in curry");
    console.log(add(2, 3, 4)(5)(7));
    console.log("============== End Execute");
}