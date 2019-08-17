# Rollup 使用教程

## 概述
引用官方的一句话 
> Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。ES6 模块可以使你自由、无缝地使用你最喜爱的 library 中那些最有用独立函数，而你的项目不必携带其他未使用的代码。ES6 模块最终还是要由浏览器原生实现，但当前 Rollup 可以使你提前体验。

总而言之，rollup非常适合构建类库

> 本项目提供了多种较为完整使用案例, 体验方式

> npm install && npm run build 


## 安装方法
> 首先必须在node,npm环境下

1. 全局安装： npm install rollup -g
2. 项目安装： npm install rollup --save-dev 或者 yarn add rollup -D

## 使用教程
使用rollup构建js类库方法 有三种

### 全局安装的可以直接使用rollup 命令行工具。

rollup 常用命令 
> rollup 或者 rollup -h roll --help 相关api使用说明
1. rollup -i, --input 必须传递的参数 ，打包的入口文件地址
2. rollup -o 输出文件地址（不传递的话会显示在控制台）

3. rollup -f 输出文件类型
  + amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
  + cjs -- CommonJS, 适用于Node或Browserify/webpack
  + es -- 将软件包保存为ES模块文件。
  + iife -- 一个自动执行的功能，适合作为 script 标签这样的。只能在浏览器中运行
  + umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。

4. rollup -n 生成umd模块名称，使用 umd 格式输出类型必须传递的参数
5. rollup --watch 监听文件 是否改动 改动的话会重新构建打包

6. rollup --silent 取消警告打印
7. rollup --environment 设置构建时的环境变量
   > eg. rollup --enviroment INCLUDE_DEPS,BUILD:production
   > 相当于设置 Build = 'production' INCLUDE_DEPS = 'true'

常用的命令行参数就这些, 比较完整的使用demo

> rollup -i ./src/index.js -o ./dist/index.js -f umd -n test --watch --silent

### 局部安装的 通过使用配置文件 构建类库

相比于命令后，配置文件构建的方式 可提供的配置选项更多，更常用.
使用方法很简单在项目根目录创建 rollup.config.js, rollup 默认使用的是项目根目录的rollup.config.js文件的配置
rollup.config.js的内容是一个es 模块.

同样也可以使用命令行指定配置文件路径
rollup -c,--config ./config/rollup.config.js

配置文件选项具体如下：
```js
   // rollup.config.js
export default {
  // 核心选项
  input,     // 必须
  external,
  plugins,

  // 额外选项
  onwarn,

  // danger zone
  acorn,
  context,
  moduleContext,
  legacy

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file,    // 必须
    format,  // 必须
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,

    // 高危选项
    exports,
    amd,
    indent
    strict
  },
};
```
#### 配置文件选项详解
+ **input** (rollup -i,--input) 打包入口文件路径.
  参数类型: String | String [] | { [entryName: string]: string }
  *eg. input: ./src/index.js*
  *eg. input: [./src/index.js, ./other/index.js]*
  > 注意 ：
  > 使用数组或者字符串作为选项值的时候的时候， 默认使用的是文件的原始名称， 作为文件的basename，可以在output:entryFileNames = 'entry-[name].js' 配置选项作为 '[name]' 动态参数传递进去
  
  *eg. input: { main: './src/index.js', vendor: './other/index.js' }*
  
  > 注意：
  > 使用键值对{key: value}的选项值作为参数，使用的对象的键作为文件的basename， 用来在output:entryFileNames 配置选项作为 '[name]' 动态参数传递进去
 
+ **plugins** 可以提供rollup 很多插件选项. 记住要调用导入的插件函数(即 commonjs(), 而不是 commonjs).
  参数类型：Plugin | (Plugin | void)[]
  ```js
  {
    ...,
    plugins: [
        resolve(), 
        commonjs()， 
        isProduction && (await import('rollup-plugin-terser')).terser()
   ]
  }
  ```
  > 该用例 同时展示了如何动态控制在不同环境变量下构建使用不同的插件.
+ **external** (rollup -e,--external) 维持包文件指定id文件维持外链，不参与打包构建
    参数类型: String[] | (id: string, parentId: string, isResolved: boolean) => boolean.
    ```js
    {
      ...,
      external: [ 
          'some-externally-required-library',  
          'another-externally-required-library'
      ]
    }
    or 
    {
      ...,
      external: (id, parent, isResolved) => {
        return true; 
      }
    }
    ```
    
    > 1.当format类型为 iife 或者 umd 格式的时候 需要配置 output.globals 选项参数 以提供全局变量名来替换外部导入.
    > 2.当external是一个函数的时候。各个参数代表的含义分别是
    > id: 所有导入的文件id，（import访问的路径）
    > parent：import 所在的文件绝对路径
    > isResolved: 表示文件id是否已通过插件处理过
    
 + **output** 是输出文件的统一配置入口, 包含很多可配置选项
   参数类型：Object
 + **output.dir**(rollup -d,--dir) 配置文件打包后统一输出的基本目录，适用于多文件打包，单文件打包也可以用file选项代替
   参数类型：String
   *eg. ouput: { dir: './dist' }*
 
 + **output.file**(rollup -o,--file) 对于单个文件打包可以使用该选项指定打包内容写入带路径的文件。
   参数类型：String
   *eg. output: { file: './dist/index.js' }*
 + **output.format** (rollup -f,--format) 打包格式类型 ，配置可选项有（amd, cjs, es, iife, umd）选项说明同命令行配置选项.
  参数类型: String
  *eg. output: { format: iife }*
+ **output.name** (rollup -n,--name) 代表你的 iife/umd 包，同一页上的其他脚本可以访问它.
  参数类型: String
  *eg. output: { name: MyLib }*
+ **output.globals** (rollup -g,--globals) 配合配置external选项指定的外链 在**umd** 和 **iife** 文件类型下提供的全局访问变量名
  参数类型: { [id: String]: String } | ((id: String) => String)  
  ```js 
  {
    ...,
    external: ['./src/loadash.js']
    output: { './src/loadash.js': '_' }
  }
  or
  const externalId = path.resolve(__dirname, './src/jquery.js');
  {
    ...,
    external: [externalId],
    output: { 
        [externalId]: '$' 
    }
  }
  or
  {
    ...,
    external: (id, parent, isResolved) => {
        if(id === externalId && !isResolved) {
            return true;
        }
        return false;
    },
    output: (id) => {
        if(id === externalId) {
            return '$'
        }
    }
  }
  ```
  > 注意：当使用函数作为globals指定项的时候 id 表示的是每一个导入文件的id（即访问路径的文件名）。

* * *
* * *
#### 高级参数
+ **manualChunks** 可以提取多个入口文件，共享的公共模块。
  参数类型: { [chunkAlias: String]: String[] } | ((id: String) => String | void)
  ```js
  {
    manualChunks: {
      modal: ['./component/toast.js', './component/dialog.js'],
      vendor: ['./redux.js', './react.js']
    }
  }
  or 
  {
    manualChunks: (id) => {
      // 导入模块id 路径名
      if(id.includes('node_modules')) {
        return vendor;
      }
    } 
  }
  ```
  > 注意：共享模块包包名是键值对模式 的 key + 文件hash 或者 函数返回值 + 文件hash, 在共享文件模块不发生改变的情况下 不会重新构建， 文件名也不会变。

+ **output.banner/output.footer/output.intro / output.outro ** (rollup --banner/rollup --fotter) 额外添加捆绑包头信息和尾内容（可以添加一些版权注释等等）
  参数类型：String | () => String | Promise<String> 
  ```js
    {
      ...,
      output: {
        ...,
        banner: '/* my-library version ' + version + ' */',
        footer: '/* follow me on Twitter! @rich_harris */',
        intro: '/* this is a library */',
        outro: '/* this is end */'
      }
    };
  ```
+ **output.assetFileNames** (rollup --assetFileNames) 资源文件打包变量名
  默认值："assets/[name]-[hash][extname]"
  可以使用的动态变量。
  > 1. [extname] 文件扩展名 包括小数点 eg. .css/.img
  > 2. [ext] 文件扩展名 不包括小数点 eg css/img
  > 3. [hash] 文件名+内容的hash
  > 4. [name] 文件名
  
  默认配置，一般不建议修改 
  
+ **output.chunkFileNames** (rollup --chunkFileNames) 代码分割 共享chunk包的文件名
  默认值："[name]-[hash].js"
  可以使用的动态变量。
  > 1. [format] 文件format 类型 e.g. esm/iife/umd/cjs
  > 3. [hash] 文件名+内容的hash
  > 4. [name] 文件名
  
  默认配置，一般不建议修改   
  
+ **output.entryFileNames** (rollup --entryFileNames) 入口文件input配置所指向的文件包名
  默认值："[name].js"
  可以使用的动态变量。
  > 1. [format] 文件format 类型 e.g. esm/iife/umd/cjs
  > 3. [hash] 文件名+内容的hash
  > 4. [name] 文件名
  
  默认配置，一般不建议修改 
  
+ **output.compact** (rollup --compact/--no-compact) 打包文件是否压缩
  参数类型：Boolean
  默认值： false
  *eg. { output: { compact: isProduction ? true : false }*
  > 该配置只会压缩打包后的有rollup生成的包装代码， 对于用户自己编写的代码不会改变 代码结构
  

+ **output.extend** (rollup --extend,--no-extend) 是否扩展 iife 或者umd格式定义的全局变量
  参数类型：Boolean
  默认值：false
  *eg. { output: { extend: true } }*
  > 简单理解 这个参数的意思就是，当全局有定义 同样name 的全局变量的时候， 使用extend = true 打包的时候使用的是 global.name = global.name || {} 优先使用已经存在的变量， extend = false 的话就会直接覆盖该全局变量 gloabl.name = {};

+ **output.sourcemap**(rollup -m,--sourcemap, --no-sourcemap) 创建源码的sourcemap
  参数类型: Boolean | 'inline'
  默认值: false
  *eg. { output: { sourcemap: 'inline' } }*
  > 当sourcemap属性为true 的时候 ，会单独创建 sourcemap 源图文件， 当值为 inline 则会将源图数据uri 附加到源代码文件底部
  
+ **output.sourcemapPathTransform** 修改sourcemap指向的源文件路径
  参数类型：(SourcePath: String) => String
  ```js
  {
    output: {
        sourcemap: true,
        sourcemapPathTransform: (relativePath) => {
            return relativePath.replace('src', 'anotherSrc');
    }
  }
  ```
  > 应用场景很少， 在特殊场景 需要改变 sourcemap 的指向文件地址时才会用到
  
+ **strictDeprecations** (rollup --strictDeprecations,--no-strictDeprecations) 启用此标志后，当使用不推荐使用的功能时，Rollup将抛出错误而不是显示警告, 此外，标记为接收下一个主要版本的弃用警告的功能在使用时也会引发错误
  参数类型: Boolean
  *eg. { strictDeprecations: true }*
* * *
* * *
#### 危险选项参数 
> 这里只介绍几个会用到的选项配置
+ **acorn** 修改rollup解析js 配置
  > rollup 内部使用的[acorn](https://github.com/acornjs/acorn/tree/master/acorn#interface)库 解析js，[acorn](https://github.com/acornjs/acorn/tree/master/acorn#interface)库提供了解析js的相关 配置api，具体见[文档](https://github.com/acornjs/acorn/tree/master/acorn#interface)，一般很少需要修改，我也没怎么看。
+ **acornInjectPlugins** 注入acornjs解析器插件
  参数类型：AcornPluginFunction | AcornPluginFunction[]
  ```js
    import jsx from 'acorn-jsx';

    export default {
        // … other options …
        acornInjectPlugins: [
            jsx()
        ]
    };
  ```
  > 注意：这个acorn-jsx 插件和 使用babel 并不是同一个意思，这个插件的左右是让 acorn js解析器能认识jsx语法，经过rollup打包后展示的还是jsx 语法，而babel 会直接修改jsx结构成为普通js 语法
+ **treeshake** (rollup --treeshake,--no-treeshake)是否开启树摇 打包特性  
  参数类型：Boolean | { annotations?: boolean, moduleSideEffects?: ModuleSideEffectsOption, propertyReadSideEffects?: boolean }
  默认值： true
  > 不建议修改为false，除非树摇算法出现错误
+ **treeshake.moduleSideEffects** 是否禁止空导入 
  参数类型：Boolean | 'no-external'
  默认值 true
  > 当moduleSideEffects为true 的时候 会删除 代码里面的空导入， eg. import './utils.js';
  > 当moduleSideEffects为'no-external'时，
***
***
#### watch观察选项配置
> 这些选项仅在使用--watch标志运行Rollup 或使用rollup.watch

+ **watch.chokidar** 代替node内置的文件监听 fs.watch 为 chokidar 
  参数类型：Boolean | ChokidarOptions
  默认值：false
  > [chokidar](https://github.com/paulmillr/chokidar) 拥有比fs.watch 更好的展示体验，但是需要额外安装[chokidar](https://github.com/paulmillr/chokidar)
+ **watch.clearScreen** 当rollup rebuild 的时候 是否需要清楚控制台内容
  参数类型: Boolean
  *eg. { watch: { clearScreen: true } }*
+ **watch.exclude** 当rollup监视文件 需要排除的内容
  参数类型: string
  *eg. { watch: { exclude: 'node_modules/**' } }*  
+ **watch.include** 指定rollup需要监听的具体文件
  参数类型: string
  *eg. { watch: { include: 'src/**' } }*  

> 常用的选项配置就是这些 下面提供一个较为完整的 配置文件demo 

```js
import path from 'path';
export default {
    input: ['./src/index.js', './utils/index,js'],
    external: [
        path.resolve(__dirname, './src', 'dependA.js')
    ],
    output: {
        dir: path.resolve(__dirname, '.', 'dist'),
        format: 'cjs',
        name: 'test',
        entryFileNames: 'index-[name].js',
        banner: '/* JohnApache JSLib */',
        footer: '/* CopyRight */',
        intro: 'const ENVIRONMENT = "production";',
        outro: 'const ENVIRONMENT = "development";',
        preserveModules: false,
        sourcemap: true,
        sourcemapPathTransform: (relativePath) => {
             // will transform e.g. "src/main.js" -> "main.js"
             console.log(relativePath);
             console.log(path.relative('src', relativePath));
            return path.relative('src', relativePath)
        }
    },
    preferConst: false,
    manualChunks(id) {
        if (id.includes('dependC')) {
          return 'vendor';
        }
    }
}

```


### 使用Javascript Api的方式构建打包程序
> rollup还提供了在nodejs中使用的api，相比于配置文件，直接使用rollup的nodeapi 可以提供更为复杂深奥的配置方式，以编程方式生成boundle
+ rollup.js 详情  
```js
const rollup = require('rollup');

// see below for details on the options
const inputOptions = {...};
const outputOptions = {...};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate code
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isAsset) {
      // For assets, this contains
      // {
      //   isAsset: true,                 // signifies that this is an asset
      //   fileName: string,              // the asset file name
      //   source: string | Buffer        // the asset source
      // }
      console.log('Asset', chunkOrAsset);
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code
      //   dynamicImports: string[],      // external modules imported dynamically by the chunk
      //   exports: string[],             // exported variable names
      //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
      //   fileName: string,              // the chunk file name
      //   imports: string[],             // external modules imported statically by the chunk
      //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
      //   isEntry: boolean,              // is this chunk a static entry point
      //   map: string | null,            // sourcemaps if present
      //   modules: {                     // information about the modules in this chunk
      //     [id: string]: {
      //       renderedExports: string[]; // exported variable names that were included
      //       removedExports: string[];  // exported variable names that were removed
      //       renderedLength: number;    // the length of the remaining code in this module
      //       originalLength: number;    // the original length of the code in this module
      //     };
      //   },
      //   name: string                   // the name of this chunk as used in naming patterns
      // }
      console.log('Chunk', chunkOrAsset.modules);
    }
  }

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
```
+ inputOptions详情
```js
// inputOptions
const inputOptions = {
  // core input options
  external,
  input, // required
  plugins,

  // advanced input options
  cache,
  inlineDynamicImports,
  manualChunks,
  onwarn,
  preserveModules,
  strictDeprecations,

  // danger zone
  acorn,
  acornInjectPlugins,
  context,
  moduleContext,
  preserveSymlinks,
  shimMissingExports,
  treeshake,

  // experimental
  chunkGroupingSize,
  experimentalCacheExpiry,
  experimentalOptimizeChunks,
  experimentalTopLevelAwait,
  perf
};
```
+ outputOptions 详情
```js
//outputOptions
const outputOptions = {
  // core output options
  dir,
  file,
  format, // required
  globals,
  name,
  
  // advanced output options
  assetFileNames,
  banner,
  chunkFileNames,
  compact,
  entryFileNames,
  extend,
  externalLiveBindings,
  footer,
  interop,
  intro,
  outro,
  paths,
  sourcemap,
  sourcemapExcludeSources,
  sourcemapFile,
  sourcemapPathTransform,
  
  // danger zone
  amd,
  dynamicImportFunction,
  esModule,
  exports,
  freeze,
  indent,
  namespaceToStringTag,
  noConflict,
  preferConst,
  strict
};
```
+ rollup 还提供了 监视api rollup.watch 可在检测到磁盘上的各个模块已更改时重建捆绑软件
```js
const rollup = require('rollup');

const watchOptions = {...};
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
  // event.code can be one of:
  //   START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //   BUNDLE_END   — finished building a bundle
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //   FATAL        — encountered an unrecoverable error
});

// stop watching
watcher.close();
```
+ watchOptions详情
```js
const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {
    chokidar,
    clearScreen,
    exclude,
    include
  }
};
```

### rollup 常用插件介绍
+ **rollup-plugin-node-resolve** 帮助rollup 查找node_modules里的三方模块
  > 使用方法：
  ```js
    import resolve from 'rollup-plugin-node-resolve';
    {
        ...
        plugins: [
           resolve() 
        ]
    }
  ```
+ **rollup-plugin-commonjs** 帮助rollup查找commonjs 规范的模块, 常配合rollup-plugin-node-resolve一起使用
   > 使用方法
   ```js
    import common from 'rollup-plugin-commonjs';
    {
        ...
        plugins: [
           resolve() 
           common({
               include: 'node_modules/**', // 包括
              exclude: [],  // 排除
           })
        ]
    }
  ```
+ **rollup-plugin-terser** 可以打包压缩es6的js代码
  > 使用方法
  ```js
    import {terser} from 'rollup-plugin-terser';
    import os from 'os';
    const cpuNums = os.cpus().length;
    {
        ...
        plugins: [
           terser({
             output: {
                comments: false,
             },
             numWorkers: cpuNums, //多线程压缩
             sourcemap: false,
             include: [/^.+\.js$/],
             exclude: [ 'node_modules/**' ]
           })
        ]
    }
  ```
+ **rollup-plugin-uglify** 可以打包压缩es6的js代码
  > 使用方法 
  ```js
    import {uglify} from 'rollup-plugin-terser';
    import os from 'os';
    const cpuNums = os.cpus().length;
    {
        ...
        plugins: [
           uglify({
             output: {
                comments: false,
             },
             numWorkers: cpuNums, //多线程压缩
             sourcemap: false,
           })
        ]
    }
  ```  
  > 注意 :
  > 1. uglify插件 会运行在每一个chunk包里面
  > 2. uglify 和 babel code frame一起使用会报错
  > 3. uglify 不支持es6语法，
  > 综上建议直接使用rollup-plugin-terser， 完美解决上述所有问题
  
+ **rollup-plugin-babel** 打包的时候使用babel编译js代码 
  > 使用说明 使用前需要安装babel环境, 这里使用的babel 7.x
  > npm install @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/plugin-transform-runtime --save-dev 
  > npm install @babel/runtime-corejs3
  ```js
    // rollup.config.js
    import babel from 'rollup-plugin-babel';
    export default {
        ...,
        plugins: [
            babel({
               runtimeHelpers: true,
            }),
        ]
    }
  ```
  ```js
  // babel.config.js
  const presets = [
    '@babel/env'
  ]

  const plugins = [
      [
          '@babel/plugin-transform-runtime',
          {
              corejs: 3
          }
      ]
  ]
  module.exports = {
      presets,
      plugins,
  }
  ```
## TODO
### rollup 插件的开发
。。。
### rollup 配合gulp 工作流
。。。


