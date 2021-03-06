'use strict';

module.exports = function (gulp, config) {
  var rev = require('gulp-rev');
  var gulpif = require('gulp-if');
  var gutil = require('gulp-util');
  var rename = require('gulp-rename');
  var env = require('../utilities').env;
  var prettyHrtime = require('pretty-hrtime');
  var mainBowerFiles = require('main-bower-files');
  var gulpconcat = require('gulp-concat');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');

  gulp.task('browserify:vendors', function () {
    gutil.log('Bundling ' + gutil.colors.magenta(config.output) + '...');
    var start = process.hrtime();

    return gulp.src(mainBowerFiles({filter: '**/*.js'}))
      .pipe(gulpconcat(config.output))
      .pipe(gulpif(env.isDev(), sourcemaps.init()))
      .pipe(gulpif(env.isProd(), rev()))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulpif(env.isProd(), uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.dest))
    .on('end', function () {
      var end = process.hrtime(start);
      var prettyTime = prettyHrtime(end);
      gutil.log('Bundled ' + gutil.colors.magenta(config.output) + ' after ' + gutil.colors.magenta(prettyTime));
    });
  });
};
