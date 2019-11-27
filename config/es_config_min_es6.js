import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import os from 'os';

const cpuNums = os.cpus().length;

export default {
    input: {
        main: path.resolve(__dirname, './main/index.js'),
        vendor: path.resolve(__dirname, './utils/index.js')
    },
    external: [
        'jquery',
        'lodash'
    ],
    plugins: [
        resolve({
            mainFields: ['module', 'main'],
            browser: true
        }),
        json(),
        common({
          include: 'node_modules/**', // 包括 
          exclude: [],  // 排除
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        terser({
            output: {
                comments: false
            },
            include: [/^.+\.js$/], // 包括
            exclude: ['node_modules/**'], // 排除
            numWorkers: cpuNums,
            sourcemap: true
        })
    ],
    output: {
        dir: path.resolve(__dirname, 'dist/es-min-es6'),
        format: 'es',
        name: 'rollupTest',
        entryFileNames: '[name]-[hash]-[format].min.js', 
        chunkFileNames: '[name]-[hash]-[format].min.js',
        compact: true,
        banner: '/* JohnApache JSLib */',
        footer: '/* CopyRight @ 2019*/',
        intro: '/* this is a introduction */',
        outro: '/* this is an another introduction */',
        extend: false,
        sourcemap: true,
        sourcemapPathTransform: (relativePath) => {
            return relativePath;
        },
        strictDeprecations: false
    },
    manualChunks: {
        'myLib': [path.resolve(__dirname, './myLib/index.js')]
    }
}