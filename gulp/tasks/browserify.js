'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var config = require( '../config' ).scripts;

var config = {
  paths: {
    scripts: [
      'src/*.js'
    ]
  }
};

gulp.task('browserify', function() {
  var b = browserify({
    entries: 'src/disclosures/js/index.js',
    debug: true
  });

  b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/scripts/'))
    // .pipe(browserSync.stream());
});
