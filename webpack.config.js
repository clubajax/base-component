// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.62vgdvbki

'use strict';

const webpack = require("webpack");

module.exports = {
    context: __dirname + "/src",
    entry: {
        app: "./app.js"
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
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    }
};