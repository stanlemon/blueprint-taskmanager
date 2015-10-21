var path = require('path');
var webpack = require('webpack');

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'eval', // source-map
    entry: [
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
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
/*    
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
*/
        new ExtractTextPlugin("[name].css")
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
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
