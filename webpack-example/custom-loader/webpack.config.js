const path = require("path");
module.exports = {
    entry: path.resolve(__dirname, "./add.js"),
    // mode: "production",
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dest")
    },
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "./")]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "pure-plus-loader!babel-loader"
            }
        ]
    }
};