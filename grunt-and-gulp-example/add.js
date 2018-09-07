'use strict'
function add(){
    var args = Array.prototype.slice.call(arguments);
    function fn(){
        args = args.concat(Array.prototype.slice.call(arguments));
        return fn;
    }
    fn.toString = function(){
        var result = 0;
        args.forEach(function(a){
            result += a
        });
        return result;
    }
    return fn;
}