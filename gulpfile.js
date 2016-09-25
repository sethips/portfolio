'use strict';

var gulp = require('gulp'),
    postcss    = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    srcDir = 'src', destDir = 'dist';


gulp.task('css', function () {
  return gulp.src( 'styles/**/*.css',{ cwd: srcDir } )
            .pipe( sourcemaps.init() )
            .pipe( postcss([ require('stylelint')({ 'syntax': 'scss' }), 
                             require('postcss-reporter')({ clearMessages: true }),
                             require('autoprefixer'), 
                             require('precss'),
                             //require('css-mqpacker')({'sort': "true"}),
                             //require('gulp-cssnano') 
                  ]) )
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest('styles/',{ cwd: destDir}) )
            .pipe( browserSync.stream() );
});
 
gulp.task('lint', function () {
  var eslint = require('gulp-eslint');
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src( ['scripts/**/*.js'/*,'!node_modules/**'*/], { cwd: srcDir } )
            // eslint() attaches the lint output to the "eslint" property 
            // of the file object so it can be used by other modules. 
            .pipe( eslint({ "env": {
                              "browser": true,
                              "jquery": true
                            },
                            "rules": {
                              "indent": [2, 2],
                              "no-console": "off"
                            },
                            fix:true }) )
            // eslint.format() outputs the lint results to the console. 
            // Alternatively use eslint.formatEach() (see Docs). 
            .pipe( eslint.format() )
            // To have the process exit with an error code (1) on 
            // lint error, return the stream and pipe to failAfterError last. 
            .pipe( eslint.failAfterError() )
            .pipe(gulp.dest('scripts/', { cwd: destDir }));
});

gulp.task('pug', function() {
  gulp.src('./src/*.pug')
    .pipe(require('gulp-pug')({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('default', ['css', 'lint'], function() {
  browserSync({
    server: {
      baseDir: 'dist',
      routes: {
        },
   // tunnel: true // show local at a public URL
    }
  })
  gulp.watch( 'styles/**/*.css', { cwd: srcDir }, ['css'] );
  gulp.watch( 'scripts/**/*.js', { cwd: srcDir }, ['lint'] );
  gulp.watch( '**/*.pug', { cwd: srcDir }, ['pug'] );
  //gulp.watch( 'index.html', { cwd: srcDir }, ['html'] );
  gulp.watch( ['*.html', 'styles/*.css', 'scripts/*.js'], { cwd: destDir }, reload );
});