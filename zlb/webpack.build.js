var path = require('path')
var webpack = require('webpack')
var extractTextPlugin = require("extract-text-webpack-plugin");
var extractCss = new extractTextPlugin('style/vendor.css')
var HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    entry: {
        build: path.resolve(__dirname, './src/main.js'),
        vendors: ['vue','vue-router','better-scroll','muse-ui','es6-promise','./src/vendor/js/swiper.min.js','./src/vendor/js/faskclick.js','./src/vendor/js/cookie.js','./src/common/js/fontsize.js','./src/common/js/getUrlParam.js']
    },
    output: {
        path: path.resolve(__dirname, './v110/'),
        publicPath: './',
        filename: "js/[name].[chunkHash:8].js",
        chunkFilename: "js/[name].[chunkHash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: extractCss.extract({
                    fallback:'style-loader',
                    use:'css-loader'
                })
            },
            {
                test: /\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/,
                loader: 'url-loader?limit=10000&name=images/[name]-[hash].[ext]',
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendor/[name].[chunkHash:8].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendors']
        }),
        extractCss,
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, '/v110/'),
            template: './index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ])
}
