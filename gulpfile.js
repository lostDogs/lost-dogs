const gulp = require('gulp');
const ts = require('gulp-typescript');
const server = require('gulp-server-livereload');

gulp.task('typescript', function () {
    return gulp.src(['*.ts', './public/**/*.ts'])
      .pipe(ts({
        noImplicitAny: false,
        removeComments: false,
        preserveConstEnums: true,
        target: 'ES5',
        sourceMap: false,
        listFiles: false
      }))
      .pipe(gulp.dest((file) => {
        return file.base;
      }));
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(server({
      livereload: true,
      open: true,
      defaultFile: '/public/index.html'
    }));
});

gulp.task('default',['typescript', 'webserver']);

