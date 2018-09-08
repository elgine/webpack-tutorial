const styleConfig = require("./styleConfig");
const merge = require("webpack-merge");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = merge(styleConfig("style.css"), {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["env", "es2015", "stage-2"],
                    plugins: ["transform-decorators-legacy", "transform-regenerator", "transform-runtime"]
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
});