'use strict';

module.exports = function (gulp, config) {
  var jade = require('gulp-jade');
  var gutil = require('gulp-util');
  var plumber = require('gulp-plumber');
  var templateCache = require('gulp-angular-templatecache');
  var gulpFilter = require('gulp-filter');

  gulp.task('templates', function () {
  var jadeTemplates = gulpFilter(['**/**/*.jade']);

  return gulp.src(config.src)
    .pipe(plumber(function (error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(jadeTemplates)
    .pipe(jade(config.jade))
    .pipe(jadeTemplates.restore())
    .pipe(templateCache(config.templateCache.filename, config.templateCache.options))
    .pipe(gulp.dest(config.dest));
});
};
