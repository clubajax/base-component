var path = require('path');

module.exports = function (grunt) {

    // is this only needed by concurrent?
    require("load-grunt-tasks")(grunt);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

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
        },
        watch:{
            scripts: {
                files: ['./src/**/*.js', './tests/*.html'],
                tasks:['build'],
                options: {
                    livereload: 35731
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['watch', 'serve'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        run: {
            build: {
                cmd: 'webpack'
                //args:[dojoRel, 'load=./bootstrap.js', '--baseUrl', './']
            },
            test: {
                // not using this
                cmd: 'phantomjs',
                args: ['phantom-test.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-metl-tools');
    grunt.registerTask('default', ['babel']);

    grunt.registerTask('build', function () {
        grunt.task.run('run:build');
    });

    grunt.registerTask('dev', function () {
        grunt.task.run('build');
        //grunt.task.run('less:main');
        grunt.task.run('concurrent:target');
        grunt.event.on('watch', function (action, filepath) {
            console.log('changed.file', action, filepath);
        });
    });
    grunt.event.on('watch', function (action, filepath) {
        console.log('changed.file', action, filepath);
    });
};




