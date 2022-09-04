import {
  rollup
} from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import defineOptions from 'unplugin-vue-define-options/rollup'
import {
  nodeResolve
} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-porter';
import postcss from 'rollup-plugin-postcss';

import {
  epRoot,
  excludeFiles,
  pkgRoot,
} from '../../build-utils'
import {
  writeBundles
} from '../utils'

import {
  buildConfigEntries,
  target
} from '../build-info'

// 包插件
import pkg from '../../../package.json';

// 依赖关系
const dependencies = Object.keys(pkg.dependencies);

export const buildComponents = async () => {
  // 获取组件路径
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  const bundle = await rollup({
    // 打包路径
    input,
    plugins: [
      // 在 <script setup> 中可使用 defineOptions 宏
      defineOptions(),
      // 解析 Json
      json(),
      // 解析 css
      css(),
      // 是一个使用 JS 插件转换样式的工具
      postcss(),
      // 解析vue
      vue({
        // 不是生产环境
        isProduction: false,
      }),
      // 解析 jsx
      vueJsx(),
      // 使用节点解析算法定位模块的汇总插件
      nodeResolve({
        // 插件将操作的文件的扩展名
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      // 将 CommonJS 模块转换为 ES6
      commonjs(),
      // 最快的 TS/ESNext 到 ES6 编译器和压缩器
      esbuild({
        // 默认
        sourceMap: true,
        // 默认值
        target,
        // 添加额外的加载器
        loaders: {
          // 在 .vue 文件中也启用 ts
          '.vue': 'ts',
        },
      }),
    ],
    // 告诉rollup不要将此打包，而作为外部依赖
    external(id) {
      return /^vue/.test(id) || dependencies.some(k => new RegExp('^' + k).test(id));
    },
    // 是否应用tree-shaking
    // 除了使用 ES6 模块之外，Rollup 还静态分析代码中的 import，并将排除任何未实际使用的代码
    treeshake: false,
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]) => {
      return {
        // esm | cjs
        format: config.format,
        // dist/ivue-material-plus -> es / lib
        dir: config.output.path,
        // 指定导出模式（自动、默认、命名、无）
        // Specify export mode (auto, default, named, none)
        exports: module === 'cjs' ? 'named' : undefined,
        // 使用原始模块名称作为文件名为所有模块创建单独的块
        preserveModules: true,
        // 输入模块的目录路径 components
        preserveModulesRoot: epRoot,
        // 建一个单独的源映射文件
        sourcemap: true,
        // 用于从入口点创建的块的模式 mjs / js
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
