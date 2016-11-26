// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.62vgdvbki

'use strict';

const webpack = require("webpack");

let cmd = process.argv[1],
    isServer = /webpack-dev-server/.test(cmd);

console.log('isServer:', isServer);

module.exports = {
    context: __dirname + "/",
    //entry: {
    //    pageA: "./pageA",
    //    pageB: "./pageB"
    //},
    //output: {
    //    path: path.join(__dirname, "js"),
    //    filename: "[name].bundle.js",
    //    chunkFilename: "[id].chunk.js"
    //},

    entry: {
        app: "./src/app.js",
        lifecycle: './tests/assets/lifecycle.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: { presets: ["es2015"] }
                }]
            }

            // Loaders for other file types can go here
        ]
    },
    devServer: {
        contentBase: __dirname + "/"  // New
    },
    devtool: 'inline-source-map' // eval does not work

};