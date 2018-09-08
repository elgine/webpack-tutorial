const webpack = require("webpack");
const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(baseConfig, {
    entry: [
        path.resolve(__dirname, "./main.js")
    ],
    mode: "development",
    devServer: {
        port: 3000,
        host: "localhost",
        contentBase: path.join(__dirname, "dest"),
        hot: true
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dest")
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});