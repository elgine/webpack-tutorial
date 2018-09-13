const path = require("path");
module.exports = {
    target: "electron-main",
    // mode: "development",
    // devtool: "eval-source-map",
    mode: "production",
    entry: path.resolve(__dirname, "./app.js"),
    output: {
        path: path.resolve(__dirname, "./dest"),
        filename: "app.js"
    }
};