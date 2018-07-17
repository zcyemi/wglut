const gulp = require('gulp');
const gulpts = require('gulp-typescript');

gulp.task('build',()=>{
    Build();
});

gulp.task("watch",()=>{
    Build();
    gulp.watch('./src/**/*.ts',Build);
})

function Build(){
    console.log('[build]')
    gulp.src('./src/**/*.ts').pipe(gulpts({
        outFile:'wglut.js',
        module:'amd',
        lib: ['es2015','dom'],
        declarationFiles: true,
    }))
    .pipe(gulp.dest('./dist/'));
}