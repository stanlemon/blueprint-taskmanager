const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const PROD = 'production';
const DEV = 'development';

const env = process.env.NODE_ENV || DEV;

module.exports = {
    devtool: env === PROD ? 'source-map' : 'eval',
    entry: {
        main: ['./web/js/index.jsx', './web/css/main.less'],
    },
    output: {
        path: path.join(__dirname, 'web/assets'),
        filename: '[name].js',
        publicPath: '/assets/',
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env),
            },
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
        }),
        ...(env === PROD ? [
            new BabiliPlugin(),
        ] : [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ]),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }),
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192',
            }, // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },
};
