const gulp = require( 'gulp' );
const gulpChanged = require( 'gulp-changed' );
const config = require( '../config' ).copy;
const handleErrors = require( '../utils/handle-errors' );

gulp.task( 'copy:files', () => {
  return gulp.src( config.files.src )
    .pipe( gulpChanged( config.files.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( config.files.dest ) );
} );

gulp.task( 'copy:icons', () => {
  return gulp.src( config.icons.src )
    .pipe( gulpChanged( config.icons.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( config.icons.dest ) );
} );

gulp.task( 'copy:libjs', () => {
  return gulp.src( config.libjs.src )
    .pipe( gulpChanged( config.libjs.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( config.libjs.dest ) );
} );

gulp.task( 'copy:vendorjs', () => {
  return gulp.src( config.vendorjs.src )
    .pipe( gulpChanged( config.vendorjs.dest ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( config.vendorjs.dest ) );
} );

gulp.task( 'copy',
  gulp.parallel(
    'copy:files',
    'copy:icons',
    'copy:libjs',
    'copy:vendorjs'
  )
);
