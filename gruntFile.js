'use strict';

const path = require('path');

module.exports = function (grunt) {
    
    // collect dependencies from node_modules
    let nm = path.resolve(__dirname, 'node_modules'),
        vendorAliases = ['@clubajax/on', '@clubajax/dom', 'randomizer', '@clubajax/custom-elements-polyfill'],
		devAliases = [...vendorAliases],
		baseAliases = ['./src/BaseComponent', './src/properties', './src/refs', './src/template'],  //, './src/item-template'
		// allAliases = vendorAliases.concat(baseAliases),
		pluginAliases = ['@clubajax/on', 'BaseComponent'],
        sourceMaps = true,
        watch = false,
        watchPort = 35750,
        babelTransform = [['babelify', { presets: ['latest'] }]],
        devBabel = false;
    
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
                    alias: devAliases.map(function (module) {
                        return module + ':';
                    }),
                    // not consuming any modules
                    external: null,
                    browserifyOptions: {
                        debug: sourceMaps
                    }
                }
            },
            dev: {
                files: {
                    'tests/dist/output.js': ['tests/src/globals.js', 'tests/src/lifecycle.js']
                },
                options: {
                    // not using browserify-watch; it did not trigger a page reload
                    watch: false,
                    keepAlive: false,
                    external: devAliases,
					alias: {
                    	'BaseComponent': './src/BaseComponent'
					},
                    browserifyOptions: {
                        debug: sourceMaps
                    },
                    // transform not using babel in dev-mode.
                    // if developing in IE or using very new features,
                    // change devBabel to `true`
                    transform: devBabel ? babelTransform : [],
                    postBundleCB: function (err, src, next) {
                        console.timeEnd('build');
                        next(err, src);
                    }
                }
            },
			test: {
				files: {
					'tests/dist/dist-output.js': ['tests/src/globals.js', 'tests/src/dist-test.js']
				},
				options: {
					// not using browserify-watch; it did not trigger a page reload
					watch: false,
					keepAlive: false,
					external: devAliases,

					alias: {
						// needed for internal references
						'BaseComponent': './src/BaseComponent'
					},
					browserifyOptions: {
						debug: sourceMaps,
						standalone: 'BaseComponent',
					},
					// since this is testing the distro, we need to babelize the test
					transform: babelTransform,
					postBundleCB: function (err, src, next) {
						console.timeEnd('build');
						next(err, src);
					}
				}
			},
			BaseComponent:{
            	files:{
            		'dist/BaseComponent.js': ['src/BaseComponent.js']
				},
				options: {
					external: [...vendorAliases, ...pluginAliases],
					transform: babelTransform,
					browserifyOptions: {
						standalone: 'BaseComponent',
						debug: false
					}
				}
			},
			properties:{
				files:{
					'dist/properties.js': ['src/properties.js']
				},
				options: {
					external: pluginAliases,
					transform: babelTransform,
					browserifyOptions: {
						standalone: 'properties',
						debug: false
					}
				}
			},
            xdeploy: {
                files: {
                	// remember to include the extension
                    'dist/index.js': ['./src/BaseComponent.js']
                },
				options: {
					alias: {
						// needed for internal references
						'BaseComponent': './src/BaseComponent.js'
					},
					external: [...vendorAliases],
					transform: babelTransform,
                    browserifyOptions: {
						standalone: 'BaseComponent',
						//standalone: 'TestComponent',
                        debug: false
                    }
                }
            },
			deploy: {
				files: {
					// remember to include the extension
					'dist/index.js': ['./src/deploy.js']
				},
				options: {
					alias: {
						// needed for internal references
						'TestComponent': './src/TestComponent.js',
					},
					external: [...vendorAliases],
					transform: babelTransform,
					browserifyOptions: {
						//standalone: 'BaseComponent',
						standalone: 'TestComponent',
						debug: false
					}
				}
			}
        },
        
        watch: {
            scripts: {
                files: ['tests/src/*.js', 'src/*.js', 'tests/*.html'],
                tasks: ['build-dev']
            },
            options: {
                livereload: watchPort
            }
        },

        'http-server': {
            main: {
                // where to serve from (root is least confusing)
                root: '.',
                // port (if you run several projects at once these should all be different)
                port: '8200',
                // host (0.0.0.0 is most versatile: it gives localhost, and it works over an Intranet)
                host: '0.0.0.0',
                cache: -1,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: false
                // route requests to another server:
                //proxy: dev.machine:80
            }
        },

        concurrent: {
            target: {
                tasks: ['watch', 'http-server'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // watch build task
    grunt.registerTask('build-dev', function (which) {
        console.time('build');
        //grunt.task.run('browserify:dev');
		grunt.task.run('browserify:test');
    });

    // task that builds vendor and dev files during development
    grunt.registerTask('build', function (which) {
        grunt.task.run('browserify:vendor');
        grunt.task.run('build-dev');
    });

    // The general task: builds, serves and watches
    grunt.registerTask('dev', function (which) {
        grunt.task.run('build');
        grunt.task.run('concurrent:target');
    });

    // alias for server
    grunt.registerTask('serve', function (which) {
        grunt.task.run('http-server');
    });

	grunt.registerTask('deploy', function (which) {
		// const compile = require('./scripts/compile');
		// compile('BaseComponent');
		// compile('properties');
		// compile('template');
		// compile('refs');
		// compile('item-template');
		//grunt.task.run('browserify:deploy');

		const compile = require('./scripts/compile-all');
	});

	grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-http-server');
};