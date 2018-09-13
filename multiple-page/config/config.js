const path = require("path");
module.exports = {
    dev: {
        host: "localhost",
        port: 3000,
        outputPath: path.resolve(__dirname, "../static"),
        contentBase: path.resolve(__dirname, "../static"),
        runtimeChunk: "mainfest"
    },
    prod: {
        dry: false,
        outputPath: path.resolve(__dirname, "../static"),
        runtimeChunk: undefined
    }
};