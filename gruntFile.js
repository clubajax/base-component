var path = require('path');

module.exports = function (grunt) {

    // is this only needed by concurrent?
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        metl:{
            serve:{
                port: 8001,
                host: '0.0.0.0'
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
        },
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "dist/app.js": "src/app.js"
                }
            }
        }
    });

    console.time('task');
    grunt.loadNpmTasks('grunt-metl-tools');
    grunt.registerTask('default', ['babel']);

    console.timeEnd('task');
};




