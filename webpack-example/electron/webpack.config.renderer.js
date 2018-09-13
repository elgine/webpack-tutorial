const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const config = require("./config");
const webpackConfig = require("../webpack.config.base");

module.exports = merge(webpackConfig, {
    target: "electron-renderer",
    // mode: "production",
    mode: "development",
    devServer: {
        host: config.host,
        port: config.port,
        inline: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    entry: path.resolve(__dirname, "./index.js"),
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./dest")
    }
});