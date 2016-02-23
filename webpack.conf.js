var webpack = require('webpack');
var vueSrc = 'app/elements';
var config = {
    context: __dirname + '/' + vueSrc,
    entry: 'vue.js',
    output: {
        path: vueSrc,
        publicPath: vueSrc,
        filename: 'build.js'
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//
            }
        ]
    }
};
module.exports = config;
