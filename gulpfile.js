const gulp = require('gulp');
const child_process = require('child_process');


gulp.task('build',build);

gulp.task('watch',()=>{
    gulp.watch('./src/**/*.ts',build);
})

function build(){
    child_process.exec('tsc --module amd --outFile ./dist/wglut.js --emitDeclarationOnly && rollup -c rollup.config.ts',(err,stdout,stderr)=>{
        if(stdout != null && stdout != '') console.log(stdout);
        if(stderr != null && stderr != '') console.log(stderr);
    })
}