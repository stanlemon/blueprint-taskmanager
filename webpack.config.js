const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const PROD = 'production';
const DEV = 'development';

const env = process.env.NODE_ENV || DEV;

module.exports = {
    mode: env,
    devtool: env === PROD ? 'source-map' : 'eval',
    entry: {
        main: ['./web/js/index.js', './web/css/main.less'],
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
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        ...(env === PROD
            ? [new BabiliPlugin()]
            : [
                  new webpack.HotModuleReplacementPlugin(),
                  new webpack.NoEmitOnErrorsPlugin(),
              ]),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css'],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'less-loader',
                ],
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
