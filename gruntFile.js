/* eslint-disable global-require */
/* eslint-disable no-console */

const path = require('path');

module.exports = function (grunt) {
    // collect dependencies from node_modules
    const nm = path.resolve(__dirname, 'node_modules');
    const vendorAliases = ['@clubajax/on', '@clubajax/dom', 'randomizer', '@clubajax/custom-elements-polyfill'];
    const devAliases = [...vendorAliases];
    const baseAliases = ['./src/base-component', './src/properties', './src/refs', './src/template']; //, './src/item-template'
    // allAliases = vendorAliases.concat(baseAliases),
    const pluginAliases = ['@clubajax/on', 'base-component'];
    const sourceMaps = true;
    const watch = false;
    const watchPort = 35750;
    const babelTransform = [['babelify', { presets: ['@babel/preset-env'] }]];
    const devBabel = false;
    const excludes = [
        '!**/node_modules/**'
    ];

    grunt.initConfig({
        browserify: {
            // source maps have to be inline.
            // grunt-exorcise promises to do this, but it seems overly complicated
            vendor: {
                // different convention than "dev" - this gets the external
                // modules to work properly
                // Note that vendor does not run through babel - not expecting
                // any transforms. If we were, that should either be built into
                // the app or be another vendor-type file
                src: ['.'],
                dest: 'tests/dist/vendor.js',
                options: {
                    // expose the modules
                    alias: devAliases.map((module) => {
                        return `${module}:`;
                    }),
                    // not consuming any modules
                    external: null,
                    browserifyOptions: {
                        debug: sourceMaps,
                    },
                },
            },
            dev: {
                files: {
                    'tests/dist/output.js': ['tests/src/globals.js', 'tests/src/lifecycle.js'],
                },
                options: {
                    // not using browserify-watch; it did not trigger a page reload
                    watch: false,
                    keepAlive: false,
                    external: devAliases,
                    alias: {
                        BaseComponent: './src/base-component',
                    },
                    browserifyOptions: {
                        debug: sourceMaps,
                    },
                    // transform not using babel in dev-mode.
                    // if developing in IE or using very new features,
                    // change devBabel to `true`
                    transform: devBabel ? babelTransform : [],
                    postBundleCB(err, src, next) {
                        console.timeEnd('build');
                        next(err, src);
                    },
                },
            },
            test: {
                files: {
                    'tests/dist/dist-output.js': ['tests/src/globals.js', 'tests/src/dist-test.js'],
                },
                options: {
                    // not using browserify-watch; it did not trigger a page reload
                    watch: false,
                    keepAlive: false,
                    external: devAliases,

                    alias: {
                        // needed for internal references
                        BaseComponent: './src/base-component',
                    },
                    browserifyOptions: {
                        debug: sourceMaps,
                        standalone: 'base-component',
                    },
                    // since this is testing the distro, we need to babelize the test
                    transform: babelTransform,
                    postBundleCB(err, src, next) {
                        console.timeEnd('build');
                        next(err, src);
                    },
                },
            },
            BaseComponent: {
                files: {
                    'dist/base-component.js': ['src/base-component.js'],
                },
                options: {
                    external: [...vendorAliases, ...pluginAliases],
                    transform: babelTransform,
                    browserifyOptions: {
                        standalone: 'base-component',
                        debug: false,
                    },
                },
            },
            properties: {
                files: {
                    'dist/properties.js': ['src/properties.js'],
                },
                options: {
                    external: pluginAliases,
                    transform: babelTransform,
                    browserifyOptions: {
                        standalone: 'properties',
                        debug: false,
                    },
                },
            },
            xdeploy: {
                files: {
                    // remember to include the extension
                    'dist/index.js': ['./src/base-component.js'],
                },
                options: {
                    alias: {
                        // needed for internal references
                        BaseComponent: './src/base-component.js',
                    },
                    external: [...vendorAliases],
                    transform: babelTransform,
                    browserifyOptions: {
                        standalone: 'base-component',
                        //standalone: 'TestComponent',
                        debug: false,
                    },
                },
            },
            deploy: {
                files: {
                    // remember to include the extension
                    'dist/index.js': ['./src/deploy.js'],
                },
                options: {
                    alias: {
                        // needed for internal references
                        TestComponent: './src/TestComponent.js',
                    },
                    external: [...vendorAliases],
                    transform: babelTransform,
                    browserifyOptions: {
                        //standalone: 'base-component',
                        standalone: 'TestComponent',
                        debug: false,
                    },
                },
            },
        },

        watch: {
            scripts: {
                files: ['tests/src/*.js', 'src/*.js'],
                tasks: ['build-dev'],
            },
            html: {
                files: ['tests/*.html'],
                tasks: [],
            },
            options: {
                livereload: watchPort,
            },
        },

        'http-server': {
            main: {
                // where to serve from (root is least confusing)
                root: '.',
                // port (if you run several projects at once these should all be different)
                port: '8202',
                // host (0.0.0.0 is most versatile: it gives localhost, and it works over an Intranet)
                host: '0.0.0.0',
                cache: -1,
                showDir: true,
                autoIndex: true,
                ext: 'html',
                runInBackground: false,
                // route requests to another server:
                //proxy: dev.machine:80
            },
        },

        excludes,

        connect: {
            server: {
                keepalive:true,
                options: {
                    port: '8002',
                    hostname: '*',
                    livereload: true,
                    open : true,
                    onCreateServer: function (server, connect, options) {
                        console.log('\n\nserver running\n\n');
                        // var io = require('socket.io').listen(server);
                        // io.sockets.on('connection', function (socket) {
                        //     // do something with socket
                        // });
                    },
                },
            },
        },

        concurrent: {
            target: {
                // tasks: ['watch', 'connect'],
                tasks: ['watch', 'http-server'],
                options: {
                    logConcurrentOutput: true,
                },
            },
        },
    });

    // watch build task
    grunt.registerTask('build-dev', (which) => {
        console.time('build');
        grunt.task.run('browserify:dev');
        //grunt.task.run('browserify:test');
    });

    // task that builds vendor and dev files during development
    grunt.registerTask('build', (which) => {
        grunt.task.run('browserify:vendor');
        grunt.task.run('build-dev');
    });

    // The general task: builds, serves and watches
    grunt.registerTask('dev', (which) => {
        grunt.task.run('build');
        // grunt.task.run('connect');
        // grunt.task.run('serve');
        grunt.task.run('concurrent:target');
    });

    // alias for server
    grunt.registerTask('serve', (which) => {
        grunt.task.run('connect');
    });

    grunt.registerTask('deploy', (which) => {
        const compile = require('./scripts/compile-all');
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-http-server');
    // grunt.loadNpmTasks('grunt-contrib-connect');
};
