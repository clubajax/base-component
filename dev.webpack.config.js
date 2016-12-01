'use strict';

module.exports = {
    context: __dirname + "/",

    entry: {
        lifecycle: './tests/assets/lifecycle.js'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist',
        filename: 'lifecycle.js'
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
    plugins:[

    ],
    devServer: {
        contentBase: __dirname + "/"  // New
    },
    devtool: 'inline-source-map' // eval does not work

};