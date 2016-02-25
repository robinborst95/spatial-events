var webpack = require('webpack');

var config = {
    entry: './app/elements/vue.js',
    output: {
        path: 'dist/js',
        publicPath: 'dist',
        filename: 'build.js'
    },
    devtool: 'source-map',
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve:{
        modulesDirectories: ['node_modules', 'bower_components']
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    }
};
module.exports = config;
