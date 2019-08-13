import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import os from 'os';

const cpuNums = os.cpus().length;
export default {
    input: {
        main: path.resolve(__dirname, './main/index.js'),
    },
    external: [
        'jquery',
        // 'lodash'
    ],
    plugins: [
        resolve(),
        common({
          include: 'node_modules/**', // 包括 
          exclude: [],  // 排除
        }),
        babel({
            include: [/^.+\.js$/],
            exclude: 'node_modules/**',
            extensions: ['.js'],
            runtimeHelpers: true,
            babelrc: false,
            presets: [
                [
                    "@babel/env",
                    {
                        targets: {
                            edge: "17",
                            firefox: "60",
                            chrome: "67",
                            safari: "11.1",
                        },
                        useBuiltIns: "usage",
                    },
                ]
            ],
        }),
        terser({
            output: {
                comments: false
            },
            include: [/^.+\.js$/],
            exclude: ['node_moudles/**'],
            numWorkers: cpuNums,
            sourcemap: false
        })
    ],
    output: {
        dir: path.resolve(__dirname, 'dist/iife-min-es5'),
        format: 'iife',
        name: 'rollupTest',
        globals: {
            'jquery': '$',
            [path.resolve(__dirname, './myLib/index.js')]: 'myLib'
        },
        entryFileNames: '[name]-[hash]-[format].js', 
        chunkFileNames: '[name]-[hash]-[format].js',
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