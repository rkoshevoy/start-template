var gulp = require('gulp'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  postcss = require("gulp-postcss"),
  autoprefixer = require('gulp-autoprefixer'),
  mqpacker = require('css-mqpacker'),
  minify = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  beautify = require('gulp-cssbeautify'),
  browserSync = require('browser-sync'),
  imagemin = require('gulp-imagemin'),
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  run = require('run-sequence'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  pump = require('pump');



gulp.task('sass',  function() {
  return gulp.src('sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(autoprefixer({browsers: [
      'last 3 versions'
    ]}))
    .pipe(beautify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(minify())
    .pipe(rename(function (path) {
      path.extname = '.min.css'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(autoprefixer({browsers: [
      'last 3 versions'
    ]}))
    .pipe(beautify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(minify())
    .pipe(rename(function (path) {
      path.extname = '.min.css'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('less', function() {
  return gulp.src('less/**/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(autoprefixer({browsers: [
      'last 3 versions'
    ]}))
    .pipe(beautify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(minify())
    .pipe(rename(function (path) {
      path.extname = '.min.css'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    notify: false
  });
});

gulp.task('watch-sass', ['browser-sync', 'sass'], function() {
  gulp.watch('sass/*.sass', ['sass']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-scss', ['browser-sync', 'scss'], function() {
  gulp.watch('scss/*.scss', ['scss']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-less', ['browser-sync', 'less'], function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('images', function() {
    return gulp.src('build/img/**/*.{png,jpg,gif}')
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
    ]))
      .pipe(gulp.dest('build/img'));
});

gulp.task('scripts', function (cb) {
  pump([
        gulp.src('build/js/**/*.js'),
        uglify(),
        gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('symbols', function() {
    return gulp.src('build/img/icons/*.svg')
      .pipe(svgmin())
      .pipe(svgstore({
        inlineSvg: true
    }))
      .pipe(rename('symbols.svg'))
      .pipe(gulp.dest('build/img'));
});

gulp.task('copy', function() {
    return gulp.src([
        'fonts/**',
        'img/**',
        'js/**',
        'css/**',
        '*.html'
    ], {
        base: "."
    })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
    return del('build');
});

gulp.task('build', function(fn) {
    run(
      'clean',
      'copy',
	    'scripts',
      'images',
      'symbols',
      fn
    );
});
