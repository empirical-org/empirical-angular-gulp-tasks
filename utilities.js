'use strict';

var args = require('yargs').argv;
var env = require('./env');

module.exports = {
  config: {
    getFile: function () {
      return args.configFile;
    },
    getConstants: function () {
      var constants = {};
      if (args.constants) {
        constants = JSON.parse(args.constants);
      }
      return constants;
    }
  },
  env: {
    isDev: function () {
      return env === 'development';
    },
    isProd: function () {
      return env === 'production';
    },
    isStaging: function () {
      return env === 'staging';
    },
    isTest: function () {
      return env === 'test';
    },
    getEnv: function () {
      return env;
    }
  }
};
