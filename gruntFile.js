var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({
        metl:{
            watch:{
                less:['./test/less/*.less'],
                scripts:['./test/**/*.js'],
                port: 35730
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

    //require(path.join(__dirname, '/tasks/index'))(grunt);
};