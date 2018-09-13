const path = require("path");

module.exports = {
    entry: [
        path.resolve(__dirname, "index.js"), 
        path.resolve(__dirname, "./console.js")
    ],
    // webpack 4 新增
    mode: "development",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dest"),
        // 输出解析文件的目录，url 相对于 HTML 页面
        // publicPath: ""
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             loader: "babel-loader",
    //             exclude: /node_modules/,
    //             options: {
    //                 presets: ["@babel/env"]
    //             }
    //         }
    //     ]
    // }
};