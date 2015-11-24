// include gulp
var 	gulp      = require('gulp')

// include plug-ins
,	jshint      = require('gulp-jshint')
,	changed     = require('gulp-changed')
,	imagemin    = require('gulp-imagemin')
,	concat      = require('gulp-concat')
,	stripDebug  = require('gulp-strip-debug')
,	compass     = require('gulp-compass')
,	uglify      = require('gulp-uglify')
,	autoprefix  = require('gulp-autoprefixer')
,	minifyCSS   = require('gulp-minify-css')
,	browserify  = require('gulp-browserify')
,	plumber     = require('gulp-plumber')
,	livereload  = require('gulp-livereload')
;

// JS hint task
gulp.task('jshint', function() {
	gulp.src(['./js/*.js', './js/**/*.js'])
    .pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './img/*',
      imgDst = './min/img';

  gulp.src(imgSrc)
    .pipe(plumber())
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./js/**/*.js', './js/*.js'])

    // browserify
    /*
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    */

    // plumber for errors
    .pipe(plumber())

    // finally, concatenate files
    .pipe(concat('main.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest('./min/js'))
    .pipe(livereload());
});

// Process compass scss to css
gulp.task('compass', function() {
  gulp.src('./scss/*.scss')
  .pipe(plumber())
  .pipe(compass({
    config_file: './config.rb',
    css: './min/css_src',
    sass: 'scss'
  }))
  .pipe(gulp.dest('./min/css_src'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src([
    './node_modules/angular-material/angular-material.css',
    './node_modules/angular-material-icons/angular-material-icons.css',
    './min/css_src/base.css'])
    .pipe(plumber())
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./min/css'))
    .pipe(livereload());
});

// default task
gulp.task('default', ['imagemin', 'scripts', 'compass', 'styles'], function() {

  // livereload for php
  var server = livereload();
  gulp.watch(['*.php', '**/*.php']).on('change', function(file) {
    server.changed(file.path);
    console.log('PHP file changed' + ' (' + file.path + ')');
  });
  gulp.watch(['*.twig', '**/*.twig']).on('change', function(file) {
    server.changed(file.path);
    console.log('Twig template changed' + ' (' + file.path + ')');
  });


  // watch for JS changes
  gulp.watch(['./js/*.js', './js/**/*.js'], ['scripts']);

  // watch for CSS changes
  gulp.watch('./scss/*.scss', ['compass']);
  gulp.watch('./min/css_src/base.css', ['styles']);

});
