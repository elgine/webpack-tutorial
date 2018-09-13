const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, "./main.js"),
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./dest"),
        // chunkFilename: "[name].chunk.js"
    },
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "dest"),
        host: "localhost",
        port: 3000,
        inline: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
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
                    chunks:"all",
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