const path = require("path");
// const baseConfig = require("../webpack.config.base");
// const merge = require("webpack-merge");
// module.exports = merge(baseConfig, {
//     entry: path.resolve(__dirname, "./main.js"),
//     mode: "production",
//     output: {
//         filename: "bundle.js",
//         path: path.resolve(__dirname, "./dest")
//     }
// })
const path = require("path");
module.exports = {
    entry: path.resolve(__dirname, "./main.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dest")
    },
    mode: "production"
    // mode: "development",
    // devtool: "source-map"
};