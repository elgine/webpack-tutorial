const HTMLWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const merge = require("webpack-merge");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const getPathLastName = require("./getPathLastName");

const runtimeChunkName = config[process.env.NODE_ENV].runtimeChunk;
const seperateRuntime = !!runtimeChunkName;

const getEntryDirs = ()=>{
    let entries = [];
    let srcPath = path.resolve(__dirname, "../src/page");  
    if(fs.existsSync(srcPath)){
        let stat = fs.statSync(srcPath);
        if(stat.isDirectory()){
            let paths = fs.readdirSync(srcPath);
            paths.forEach((pathStr)=>{
                let curPath = String(srcPath + "/" + pathStr).replace("/", "\\");
                stat = fs.statSync(curPath);
                if(stat.isFile()){
                    entries.push(curPath.replace(path.extname(curPath), ""));
                }
            });
        }
    }
    return entries;
};

const generateStyle = ()=>{
    return {
        module: {
            rules: ["css", "less", "scss"].map((loaderName)=>{
                return {
                    test: new RegExp(`\.${loaderName}$`),
                    use: ExtractTextPlugin.extract({
                        fallback: "vue-style-loader",
                        use: ["css-loader"].concat(loaderName !== "css"?[`${loaderName}-loader`]:[]) 
                    })
                };
            })
        },
        plugins: [
            new ExtractTextPlugin({
                filename: "css/[name].css",
                allChunks: true
            })
        ]
    };
};

const generateEntries = (entries)=>{
    let entryMap = {};
    entries.forEach((entry)=>{
        entryMap[getPathLastName(entry)] = String(entry + ".js").replace("/", "\\");
    });
    return entryMap;
};

const generateHtmlPlugins = (entries)=>{
    return entries.map((entry)=>{
        let dirName = getPathLastName(entry);
        return new HTMLWebpackPlugin({
            title: dirName,
            filename: `${dirName}.html`,
            template: path.resolve(__dirname, "../src/index.html"),
            inject: true,
            hash: true,
            meta: true,
            chunks: (seperateRuntime?[runtimeChunkName]:[]).concat(["vendors", "commons", dirName])
        })
    })
};

const entryDirs = getEntryDirs();
const entries = generateEntries(entryDirs);
var webpackConfig = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, "../static"),
        filename: "js/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: "vue-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/env"]
                }
            },
            {
                test: /\.(png|jpeg|jpg|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 5000,
                    name: "./img/[name].[ext]",
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "/media/[name].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "/fonts/[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ].concat(generateHtmlPlugins(entryDirs)),
    optimization: {
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            cacheGroups: {
                commons: {
                    name: "commons",
                    test: /[\\/]src[\\/]/,
                    minSize: 0,
                    minChunks: 2,
                    reuseExistingChunk: true,
                    priority: 1
                },
                vendors: {
                    name: "vendors",
                    minSize: 0,
                    minChunks: 1,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    enforce: true
                }
            }
        }
    }
};

if(seperateRuntime){
    webpackConfig.optimization.runtimeChunk = {
        name: runtimeChunkName
    };
}

module.exports = merge(webpackConfig, generateStyle());