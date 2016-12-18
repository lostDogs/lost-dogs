const gulp = require('gulp');
const ts = require('gulp-typescript');
const server = require('gulp-server-livereload');

gulp.task('typescript', function () {
    return gulp.src(['*.ts', './app/**/*.ts'])
      .pipe(ts({
        noImplicitAny: true,
        removeComments: false,
        preserveConstEnums: true,
        target: 'ES5',
        sourceMap: false,
        moduleResolution: 'node',
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        suppressImplicitAnyIndexErrors: true,
        listFiles: false
      }))
      .pipe(gulp.dest((file) => {
        return file.base;
      }));
});

gulp.task('serve', function() {
  gulp.src('.')
    .pipe(server({
      livereload: true,
      open: true,
    }));
});

gulp.task('default',['typescript', 'serve']);

