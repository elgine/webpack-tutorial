process.env.NODE_ENV = "prod";

const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const optimizeCss = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.config.base");
const globalConfig = require("./config");

var webpackConfig = merge(webpackConfigBase, {
    mode: "production",
    output: {
        path: globalConfig.prod.outputPath
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.runtime.min.js"
        }
    },
    plugins: [
        new CleanWebpackPlugin(["*"], {
            root: path.resolve(__dirname, "../static"),
            dry: globalConfig.prod.dry
        }),
        new optimizeCss({
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { 
                discardComments: { removeAll: true } 
            }
        })
    ]
});

module.exports = webpackConfig;