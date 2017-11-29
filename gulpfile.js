var gulp = require('gulp'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  postcss = require("gulp-postcss"),
  autoprefixer = require('gulp-autoprefixer'),
  mqpacker = require('css-mqpacker'),
  minify = require('gulp-csso'),
  rename = require("gulp-rename"),
  browserSync = require('browser-sync');

gulp.task('sass', function() {
  return gulp.src('sass/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      mqpacker({
          sort: true
      })
    ]))
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss', function() {
  return gulp.src('scss/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      mqpacker({
          sort: true
      })
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('less', function() {
  return gulp.src('less/*.less')
    .pipe(plumber())
    .pipe(less()).pipe(postcss([
      mqpacker({
          sort: true
      })
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('autoprefixer', function() {
  return gulp.src('css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
    }))
    .pipe(gulp.dest('css'))
})

gulp.task('mqpacker', function() {
  return gulp.src('css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
    }))
    .pipe(gulp.dest('css'))
})

// gulp.task('rename', function() {
//   return gulp.src('css/*.css')
//     .pipe(rename())
//     .pipe(gulp.dest('css'))
// })

gulp.task('minify', function() {
  return gulp.src('css/*.css')
    .pipe(minify())
    .pipe(gulp.dest('css'))
})

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    notify: false
  });
});

gulp.task('watch-sass', ['browser-sync', 'sass', 'autoprefixer'], function() {
  gulp.watch('sass/*.sass', ['sass']);
  gulp.watch('css/**/*.css', ['autoprefixer']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-scss', ['browser-sync', 'scss', 'autoprefixer'], function() {
  gulp.watch('scss/*.scss', ['scss']);
  gulp.watch('css/**/*.css', ['autoprefixer']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-less', ['browser-sync', 'less', 'autoprefixer'], function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('css/**/*.css', ['autoprefixer']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});
