/* eslint-disable */
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// 编译sass
gulp.task('index', function () {
  return gulp
    .src('../src/styles/index.scss')
    .pipe(
      sass({
        includePaths: ['../node_modules/'], // 導入 sass 模塊可能路徑
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('index.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// layout
gulp.task('layout', function () {
  return gulp
    .src('../src/components/ivue-layout/layout.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('layout.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// elevation
gulp.task('elevation', function () {
  return gulp
    .src('../src/components/ivue-elevation/elevation.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('elevation.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// color
gulp.task('color', function () {
  return gulp
    .src('../src/styles/theme/index.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('color.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// animation
gulp.task('animation', function () {
  return gulp
    .src('../src/styles/animation/index.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('animation.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// base
gulp.task('base', function () {
  return gulp
    .src('../src/styles/base.scss')
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('base.css'))
    .pipe(gulp.dest('../dist/styles'));
});

// 拷贝字体文件
gulp.task('fonts', function () {
  return gulp
    .src('../src/styles/material-icons/fonts/*.*')
    .pipe(gulp.dest('../dist/styles/fonts'));
});

gulp.task(
  'default',
  gulp.parallel(
    'index',
    'layout',
    'elevation',
    'color',
    'animation',
    'base',
    'fonts'
  )
);
