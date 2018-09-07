const Extract = require("extract-text-webpack-plugin");

const generate = function(extract){
    let loaders = ["css", "less", "sass"];
    return loaders.map((loader)=>{
        let config = {
            test: new RegExp(`/\.${loader}$/`),
            exclude: /node_modules/,
        };
        if(extract){
            config.use = Extract.extract({
                fallback: "style-loader",
                use: ["css-loader"].concat(loader==="css"?[]:[`${loader}-loader`])
            });
        }
        console.log(config);
        return config;
    });
}

module.exports = function(extract = "style.css"){
    return {
        module: {
            rules: generate(extract)
        },
        plugins: [
            new Extract("style.css")
        ]
    };
}