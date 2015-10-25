"use strict";

let path = require('path');
let webpack = require('webpack');

const PROD = 'production';
const DEV = 'development'

let env = process.env.NODE_ENV || DEV;

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map', // source-map
    entry: env === PROD ?
        [
            './web/js/index',
            './web/css/main.less',
        ]
        :
        [
            'webpack-hot-middleware/client',
            'webpack/hot/only-dev-server',
            './web/js/index',
            './web/css/main.less',
        ],
    output: {
        path: path.join(__dirname, 'web/assets'),
        filename: "[name].js",
        publicPath: '/assets/'
    },
    plugins: env === PROD ?
        [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new ExtractTextPlugin("[name].css")
        ]
        :
        [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new ExtractTextPlugin("[name].css")
        ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'web/js')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            }, // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=[name].[ext]'
            }
        ]
    }
};
