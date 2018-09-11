const webpack = require("webpack");
const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");
module.exports = merge(baseConfig, {
    entry: {
        main: path.resolve(__dirname, "./main.js"),
        // cancel: path.resolve(__dirname, "./cancel.js"),
        // confirm: path.resolve(__dirname, "./confirm.js")
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./dest"),
        chunkFilename: "[name].chunk.js"
    },
    mode: "development",
    devtool: "source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    minSize: 0,
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                },
                vendors: {
                    name: "vendors",
                    minSize: 0,
                    minChunks: 1,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: "mainfest"
        }
    }
});