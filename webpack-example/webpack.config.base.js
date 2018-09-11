const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "./index.html"),
            filename: "index.html",
            inject: true,
            hash: true
        })
    ]
};