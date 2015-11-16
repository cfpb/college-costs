'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var config = require( '../config' ).browserify;

gulp.task('browserify', function() {
  var b = browserify({
    entries: config.paths.scripts,
    debug: true
  });

  b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( config.paths.dest ));
    // .pipe(browserSync.stream());
});
