const gulp = require( 'gulp' );
const gulpChanged = require( 'gulp-changed' );
const configCopy = require( '../config' ).copy;
const handleErrors = require( '../utils/handle-errors' );

gulp.task( 'copy:files', function() {
  return gulp.src( configCopy.files.src )
    .pipe( gulpChanged( configCopy.files.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( configCopy.files.dest ) );
} );

gulp.task( 'copy:libjs', function() {
  return gulp.src( configCopy.libjs.src )
    .pipe( gulpChanged( configCopy.libjs.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( configCopy.libjs.dest ) );
} );

gulp.task( 'copy:vendorjs', function() {
  return gulp.src( configCopy.vendorjs.src )
    .pipe( gulpChanged( configCopy.vendorjs.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( configCopy.vendorjs.dest ) );
} );

gulp.task( 'copy',
  gulp.parallel(
    'copy:files',
    'copy:libjs',
    'copy:vendorjs'
  )
);
