'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var version = require('./package.json').version;

// Settings
var DEST = './dist';
var src = {};

var publishHash = '';

// The default task
gulp.task('default', ['dist']);

// Clean up
gulp.task('clean', del.bind(null, [DEST], { force: true }));

// Static files
gulp.task('assets', function() {
  src.assets = 'src/assets/**';
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'assets'}));
});

gulp.task('svg', function() {
  return gulp.src('src/images/**/*.svg')
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
});

// Images
gulp.task('images', ['svg'], function() {
  return gulp.src(['src/images/**', '!src/images/**/*.svg'])
    .pipe($.changed(DEST + '/images'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
    }))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
});

// HTML pages
gulp.task('pages', function() {
  if (publishHash) {
    return gulp.src('src/*.html')
      .pipe($.replace('<!-- <%= css %> -->', '<link rel="stylesheet" href="app.' + publishHash + '.css" />'))
      .pipe($.replace('<!-- <%= report.css %> -->', '<link rel="stylesheet" href="report.' + publishHash + '.css" />'))
      .pipe($.replace('<script src = "report.js"></script>', '<script src="report.' + publishHash + '.js"></script>'))
      .pipe($.replace('<script src = "app.js"></script>', '<script src="app.' + publishHash + '.js"></script>'))
      .pipe(gulp.dest(DEST));
  }
  else {
    return gulp.src('src/*.html')
      .pipe($.replace('<!-- <%= css %> -->', '<link rel="stylesheet" href="main.css">'))
      .pipe(gulp.dest(DEST));
  }

});

gulp.task('min-html', ['pages'], function() {
  return gulp.src(DEST + '/*.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest(DEST));
});

// Bundle
gulp.task('bundle', function(cb) {
  var config = require('./config/webpack.dist.js');
  var bundler = webpack(config, function(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    publishHash = stats.hash;
    $.util.log('[webpack]', stats.toString({colors: true}));
    return cb();
  });
});

gulp.task('pre-build', function(cb) {
  //only if you change assets & images, you need to execute those two task.
  runSequence(['pages', /**'assets', 'images'**/], cb);
});

// Build the app from source code
gulp.task('dist', ['clean', 'bundle'], function(cb) {
  runSequence(['pre-build', 'min-html'], cb);
});
