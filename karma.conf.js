// Karma configuration
// Generated on Sun Sep 17 2017 14:55:11 GMT-0600 (MDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // plugins
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-browserify'
    ],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/'
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/chart.js/dist/*.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/moment/moment.js',
      'app/scripts/app.js',
      'app/bower_components/*/*.js',
      'app/bower_components/*/*.css',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/bootstrap/dist/css/bootstrap.css',
      'app/bower_components/font-awesome/css/font-awesome.css',
      'app/bower_components/angular-timeago/dist/*.js',
      'app/bower_components/angular-lazy-img/release/angular-lazy-img.js',
      'app/bower_components/angular-chart.js/dist/*.js',
      'app/lib/*.js',
      'app/lib/angular-calendar-heatmap/dist/*.js',
      'app/scripts/controllers/*.js',
      'app/scripts/services/*.js',
      'app/scripts/filters/*.js',
      'app/views/*.html',
      'test/spec/*/*.js',
    ],


    // list of files to exclude
    exclude: [
      'app/bower_components/*/index.js',
      'app/bower_components/angular-mocks/ngAnimateMock.js',
      'app/bower_components/angular-mocks/ngMock.js',
      'app/bower_components/angular-mocks/ngMockE2E.js',
      'app/bower_components/bootstrap/package.js',
      'app/bower_components/angular-moment/tests.js',
      'app/bower_components/angular-timeago/protractor-e2e.conf.js',
      'app/bower_components/pluralize/test.js',
      'app/bower_components/angular-lazy-img/karma.conf.js',
      'app/bower_components/firebase/*.js',
      'app/bower_components/angular-chart.js/gulpfile.js',
      'app/bower_components/chart.js/gulpfile.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/views/*.html': 'ng-html2js'
    },

    browserify: {
      debug: true
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


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
