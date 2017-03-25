var webpackConfig = require('./webpack.test.js');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: './karma-test-shim.js', watched: true }
    ],

    preprocessors: {
      './karma-test-shim.js': ['webpack', 'sourcemap']
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    reporters: ['kjhtml', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  };

  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
  }

  config.set(_config);
};