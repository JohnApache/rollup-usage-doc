import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import os from 'os';

const cpuNums = os.cpus().length;
export default {
    input: {
        main: path.resolve(__dirname, './ts/index.ts'),
    },
    external: [
        'jquery',
    ],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: "ES2015"
                }
            }
        }),
        resolve({
            mainFields: ['module', 'main'],
            browser: true
        }),
        json(),
        babel({
            runtimeHelpers: true,
            extensions: ['.js', '.ts']
        }),
        common({
            include: 'node_modules/**', // 包括 
            exclude: [],  // 排除
            extensions: ['.js', '.ts']
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        terser({
            output: {
                comments: false
            },
            include: [/^.+\.js$/],
            exclude: ['node_moudles/**'],
            numWorkers: cpuNums,
            sourcemap: false
        }),
    ],
    output: {
        dir: path.resolve(__dirname, 'dist/ts-umd-min-es5'),
        format: 'umd',
        name: 'rollupTest',
        globals: {
            'jquery': '$',
        },
        entryFileNames: '[name]-[hash]-[format].js', 
        chunkFileNames: '[name]-[hash]-[format].js',
        compact: false,
        banner: '/* JohnApache JSLib */',
        footer: '/* CopyRight @ 2019*/',
        intro: '/* this is a introduction */',
        outro: '/* this is an another introduction */',
        compact: true,
        extend: false,
        sourcemap: false,
        sourcemapPathTransform: (relativePath) => {
            return relativePath;
        },
        strictDeprecations: false
    },
    treeshake: {
        moduleSideEffects: true
    },
    // manualChunks: {
    //     'myLib': [path.resolve(__dirname, './myLib/index.js')]
    // }
}