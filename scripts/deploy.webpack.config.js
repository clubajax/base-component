// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.62vgdvbki
// https://github.com/sapientglobalmarkets/react-redux-seed/tree/master/config
// http://survivejs.com/webpack/developing-with-webpack/enabling-sourcemaps/#-sourcemapdevtoolplugin-

'use strict';
const webpack = require('webpack');
const root = __dirname + '/../';
//const src = { basecomponent: './src/BaseComponent' };
const src = { lifecycle: './tests/assets/lifecycle.js' };

module.exports = {

    //devtool: 'none',
    //devtool: 'source-map',
    //devtool: 'source-map-hidden-eval-cheap',
    //devtool: 'inline-source-map',
    //devtool: 'eval',
    // this one allows for external maps:
    devtool: 'cheap-module-source-map',

    context: root,

    entry: src,
    output: {
        path: root + '/dist',
        publicPath: '/dist',
        //filename: 'BaseComponent.js',

        // export itself to a global var
        //libraryTarget: 'umd'
        // name of the global var:
        //library: 'BaseComponent',

        //sourceMapFilename: 'BaseComponent.js.map',
        //umdNamedDefine: true //'BaseComponent',
        //libraryTarget: 'umd',
        //devtoolLineToLine: true

    },
    externals: {
        // require("dom") is external and available
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
    }
    //plugins:[
    //    new webpack.optimize.OccurrenceOrderPlugin(),
    //    new webpack.optimize.UglifyJsPlugin({
    //        //compress:{ warnings: true }
    //        compress: false
    //    })
    //]
};
console.log('running webpack deploy');