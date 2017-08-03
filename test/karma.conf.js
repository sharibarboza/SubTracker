// Karma configuration
// Generated on Wed Aug 02 2017 13:16:49 GMT-0600 (MDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        '../app/bower_components/angular/angular.js',
        '../app/scripts/app.js',
        '../app/bower_components/*/*.js',
        '../app/bower_components/*/*.css',
        '../app/bower_components/jquery/dist/jquery.js',
        '../app/bower_components/bootstrap/dist/js/bootstrap.js',
        '../app/bower_components/bootstrap/dist/css/bootstrap.css',
        '../app/bower_components/font-awesome/css/font-awesome.css',
        '../app/scripts/controllers/*.js',
        '../app/scripts/services/*.js',
        'spec/controllers/*.js',
        'spec/services/*.js'
    ],


    // list of files to exclude
    exclude: [
        '../app/bower_components/*/index.js',
        '../app/bower_components/angular-mocks/ngAnimateMock.js',
        '../app/bower_components/angular-mocks/ngMock.js',
        '../app/bower_components/angular-mocks/ngMockE2E.js',
        '../app/bower_components/bootstrap/package.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Code coverage report
    reporters: ['progress', 'coverage'],  
    preprocessors: {  
      'app/scripts/**/*.js': ['coverage']
    },
    coverageReporter: {  
      type: 'html',
      dir: 'coverage'
    },

    // Don't forget to add 'karma-coverage' to your list of plugins
    plugins: [  
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage',
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
