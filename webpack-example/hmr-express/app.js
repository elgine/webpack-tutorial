const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const express = require("express");

webpackConfig.entry.unshift("webpack-hot-middleware/client?noInfo=true&reload=true");
const compiler = webpack(webpackConfig);

const app = express();

app.use(express.static("dest"));

app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler));

app.listen(3000, function(){
    console.log("Visit localhost:3000");
});