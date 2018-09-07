function CustomPlugin(options){

}

CustomPlugin.prototype.apply = function(compiler){


    compiler.plugin("compile", function(params){

    })

    compiler.plugin("compilation", function(compilation){

        // compilation.plugin("optimize", function(){
        // })
    })

    compiler.plugin("emit", function(compilation, callback){
        
    })
}