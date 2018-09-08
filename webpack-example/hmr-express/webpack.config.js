const webpack = require("webpack");
const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");
module.exports = merge(baseConfig, {
    entry: [
        path.resolve(__dirname, "./client/main.js")
    ],
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dest")
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});