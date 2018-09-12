class ConsolePlugin{

    constructor(options){
        // TODO:
    }

    apply(compiler){
        compiler.plugin("emit", function(compilation, callback){
            console.log(compilation);
        });
    }
}

module.exports = ConsolePlugin;