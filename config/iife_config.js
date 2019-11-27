import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
export default {
    input: {
        main: path.resolve(__dirname, 'main/index.js'),
    },
    external: [
        'jquery',
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
    ],
    output: {
        dir: path.resolve(__dirname, 'dist/iife'),
        globals: {
            'jquery': '$',
            [path.resolve(__dirname, './myLib/index.js')]: 'myLib'
        },
        format: 'iife',
        name: 'rollupTest',
        entryFileNames: '[name]-[hash]-[format].js', 
        chunkFileNames: '[name]-[hash]-[format].js',
        compact: false,
        banner: '/* JohnApache JSLib */',
        footer: '/* CopyRight @ 2019*/',
        intro: '/* this is a introduction */',
        outro: '/* this is an another introduction */',
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