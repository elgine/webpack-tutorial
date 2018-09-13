process.env.NODE_ENV = "dev";

const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.config.base");
const globalConfig = require("./config");

var webpackConfig = merge(webpackConfigBase, {
    mode: "development",
    output: {
        path: globalConfig.dev.outputPath
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm.js"
        }
    },
    devtool: "eval-source-map",
    devServer: {
        host: globalConfig.dev.host,
        port: globalConfig.dev.port,
        contentBase: globalConfig.dev.contentBase,
        inline: true,
        hot: true,
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
});

module.exports = webpackConfig;