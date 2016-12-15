'use strict';
const webpack = require("webpack");
var config = require('./deploy.webpack.config.js');
webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack:build', err); }
    console.log('[webpack:build]', stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
    }));
});