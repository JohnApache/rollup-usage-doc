import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
export default {
    input: {
        main: path.resolve(__dirname, 'main/index.js'),
        vendor: path.resolve(__dirname, 'utils/index.js')
    },
    external: [
        'jquery',
        'lodash'
    ],
    plugins: [
        resolve(),
        common({
          include: 'node_modules/**', // 包括 
          exclude: [],  // 排除
        }),
    ],
    output: {
        dir: path.resolve(__dirname, 'dist/es'),
        format: 'es',
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
    manualChunks: {
        'myLib': [path.resolve(__dirname, './myLib/index.js')]
    }
}