// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.62vgdvbki

'use strict';
const webpack = require("webpack");

module.exports = {
    context: __dirname + "/",

    entry: {
        //app: './src/app.js',
        //lifecycle: './tests/assets/lifecycle.js'
        basecomponent: './src/BaseComponent'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist',
        filename: 'base-component.js',

        // export itself to a global var
        libraryTarget: 'umd',
        // name of the global var:
        library: 'BaseComponent',
        //umdNamedDefine: true //'BaseComponent',
        //libraryTarget: 'umd',

    },
    externals: {
        // require("jquery") is external and available
        on: {
            commonjs: 'on',
            commonjs2: 'on',
            amd: 'on',
            root: 'on'
        },
        dom: {
            commonjs: 'dom',
            commonjs2: 'dom',
            amd: 'dom',
            root: 'dom'
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: { presets: ["es2015"] }
                }]
            },{
                test: /.json$/,
                use: 'json-loader'
            }

            // Loaders for other file types can go here
        ]
    },
    plugins:[
        //new webpack.optimize.OccurrenceOrderPlugin()
        new webpack.optimize.UglifyJsPlugin({
            //compress:{ warnings: true }
             compress: false
        })
    ],
    devtool: 'inline-source-map' // eval does not work
};