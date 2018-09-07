const path = require("path");

const relative = (url)=>{
    return path.resolve(__dirname, url);
}

module.exports = {
    entry: relative("main.js"),
    // webpack 4 新增
    mode: "development",
    output: {
        filename: "bundle.js",
        path: relative("./dest"),
        // 输出解析文件的目录，url 相对于 HTML 页面
        // publicPath: ""
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["env", "es2015", "stage-2"],
                    plugins: ["transform-decorators-legacy", "transform-regenerator", "transform-runtime"]
                }
            }
        ]
    }
};