const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const webp = require('gulp-webp');
var htmlmin = require('gulp-htmlmin');
const gulp = require("gulp");
const sass = require('gulp-sass')(require('node-sass'));

var jsFiles = "assets/js/**/*.js",
  jsDest = "static/js",
  htmlFiles = "templates/**/*.ejs",
  htmlDest = "views",
  sassFiles = "assets/sass/style.scss",
  sassDest = "assets/css",
  cssFiles = "assets/css/**/*.css",
  imagesFiles = "assets/images/**/*",
  imageDest = "static/images",
  cssDest = "static/css";

gulp.task("js", function () {
  return gulp
    .src(jsFiles)
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task("sass", function () {
  return gulp
    .src(sassFiles)
    .pipe(sass({ verbose: false }).on('error', sass.logError))
    .pipe(gulp.dest(sassDest));
});

gulp.task("css", function () {
  return gulp
    .src(cssFiles)
    .pipe(concat("style.min.css"))
    .pipe(cleanCss())
    .pipe(gulp.dest(cssDest));
});

gulp.task("html", function () {
  return gulp
    .src(htmlFiles)
    .pipe(htmlmin({ collapseWhitespace: true, html5: true, removeComments: true, minifyCSS: true, minifyJS: true, minifyURLs: true }))
    .pipe(gulp.dest(htmlDest));
});

gulp.task("webp", function () {
  return gulp
    .src(imagesFiles)
    .pipe(webp())
    .pipe(gulp.dest(imageDest));
});

gulp.task('watch', function (done) {
  gulp.watch(jsFiles, gulp.series('js'));
  gulp.watch(sassFiles, gulp.series('sass'));
  gulp.watch(cssFiles, gulp.series('css'));
  gulp.watch(imagesFiles, gulp.series('webp'));
  gulp.watch(htmlFiles, gulp.series('html'));
  done();
});



gulp.task('default', gulp.series('js', 'sass', 'html', 'css', 'webp', 'watch'));