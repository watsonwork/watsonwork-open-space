const gulp = require('gulp');
const pump = require('pump');

const handlebars = require('gulp-compile-handlebars');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const rename = require('gulp-rename');

const less = require('gulp-less');
const minifyCSS = require('gulp-csso');

const templateTestData = {
    space: {
        title: 'Beta Rally Team 🏁',
        id: '56e046219932d8c08d4de998'
    }
};

gulp.task('prod-templates', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('lib'));
});

gulp.task('dev-templates', function () {
    return gulp.src('src/index.html')
        .pipe(handlebars(templateTestData))
        .pipe(gulp.dest('lib/test'));
});

gulp.task('prod-scripts', function (cb) {
    pump([
        gulp.src('src/script.js'),
        sourcemaps.init(),
        babel({
            presets: ['es2015']
        }),
        uglify(),
        sourcemaps.write('.'), // relative to dest on next line
        gulp.dest('lib')
    ], cb);
});

gulp.task('dev-scripts', function () {
    return gulp.src('src/script.test.js')
        .pipe(rename('script.js'))
        .pipe(gulp.dest('lib/test'))
});

gulp.task('styles', function () {
  return gulp.src('src/*.less')
      .pipe(less({ strictMath: true }))
      .pipe(gulp.dest('lib/test'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('lib'));
});

gulp.task('icons', function () {
  return gulp.src(['src/img/icon.png', 'src/img/favicon.ico'])
      .pipe(gulp.dest('lib'))
      .pipe(gulp.dest('lib/test'));
});

const tasks = ['prod-templates', 'dev-templates', 'prod-scripts', 'dev-scripts', 'styles', 'icons'];

gulp.task('build', tasks);

gulp.task('default', ['build'], function() {
    gulp.watch('src/*', tasks);
});
