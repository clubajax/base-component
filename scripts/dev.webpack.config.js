'use strict';

// This file is used for tests

const root = __dirname + '/../';

module.exports = {
    context: root,

    performance: {
        hints: false
    },

    entry: {
        lifecycle: './tests/assets/lifecycle.js'
    },
    output: {
        path: root + 'dist',
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
        contentBase: root  // New
    },
    devtool: 'none-source-map' // eval does not work
};

console.log('webpack dev server');