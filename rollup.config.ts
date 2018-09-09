import typescript from "rollup-plugin-typescript2";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let config = {
    input: './src/wglut.ts',
    output: [
        {file: 'dist/wglut.umd.js', name: 'wglut', format: 'umd',sourcemap:true},
        {file: 'dist/wglut.es.js',format: 'es'}
    ],
    plugins: [
        typescript({
            tsconfigOverride:{
                compilerOptions:{module:'es2015'}
            },
            useTsconfigDeclarationDir:true
        }),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        commonjs()
    ]
}

export default config;