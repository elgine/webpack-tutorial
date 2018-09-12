const merge = require("webpack-merge");
const webpackConfig = require("../webpack.config.base");
const ConsolePlugin = require("./consolePlugin");
const path = require("path");

module.exports = merge(webpackConfig, {
    entry: path.resolve(__dirname, "./main.js"),
    output: {
        path: path.resolve(__dirname, "./dest"),
        filename: "index.js"
    },
    plugins: [
        new ConsolePlugin()
    ]
});