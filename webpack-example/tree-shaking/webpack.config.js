const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");
module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, "./main.js"),
    mode: "production",
    output: {
        filename: "boundle.js",
        path: path.resolve(__dirname, "./dest")
    }
})