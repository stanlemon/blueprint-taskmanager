'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PROD = 'production';
const DEV = 'development';

const env = process.env.NODE_ENV || DEV;

const vendors = [
    'react',
    'redux',
    'react-redux',
    'react-widgets',
    'react-tap-event-plugin',
    'moment'
];

module.exports = {
    devtool: env === PROD ? 'source-map' : 'eval',
    entry: env === PROD ?
        {
            main: ['./web/js/index', './web/css/main.less'],
            vendors: vendors
        }
        :
        {
            main: [
                'webpack-hot-middleware/client',
                'webpack/hot/only-dev-server',
                './web/js/index',
                './web/css/main.less',
            ],
            vendors: vendors
        },
    output: {
        path: path.join(__dirname, 'web/assets'),
        filename: "[name].js",
        chunkFilename: 'main-[id].js',
        publicPath: '/assets/'
    },
    plugins: 
        [
            new webpack.optimize.OccurenceOrderPlugin()
            , new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(env)
                }
            })
            , new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
            , ...(env === PROD ?
            [
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
            ])
            // Replace calls to fetch with whatwg, because I can
            , new webpack.ProvidePlugin({
                'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
            })
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
