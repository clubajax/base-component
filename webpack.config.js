// https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.62vgdvbki

'use strict';

const webpack = require("webpack");
var argv = require('minimist')(process.argv.slice(2));

if(argv.d){
    //deploy
    module.exports = require('./deploy.webpack.config');
}
else{
    // serve
    module.exports = require('./dev.webpack.config');
}
