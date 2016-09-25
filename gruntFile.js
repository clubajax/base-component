var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({
        metl:{
            serve:{
                port: 8001
            },
            watch:{
                scripts:['./src/**/*.js', './tests/*.html'],
                port: 35731
            },
            umd:{
                src:'./src',
                name:'dist/create-element.js',
                ordered: ['create.js'],
                dependencies: ['dom', 'on']
            }
        }
    });

    grunt.loadNpmTasks('grunt-metl-tools');
};