import path from 'path';
import { parallel } from 'gulp';
import VueMacros from 'unplugin-vue-macros/rollup';

// vitejs
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// rollup
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild';

// built-in method
import { uiRoot, uiOutput } from '@ivue-material-plus/build-utils';
import { PKG_CAMELCASE_NAME } from '@ivue-material-plus/build-constants';
import {
  withTaskName,
  generateExternal,
  writeBundles,
  formatBundleFilename,
} from '../utils';
import { PlusAlias } from '../plugins/plus-alias';
import { target } from '../build-info';

// type
import type { TaskFunction } from 'gulp';
import type { Plugin } from 'rollup';

// 构建完整条目
async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    PlusAlias(),
    VueMacros({
      // 禁用功能 setupComponent
      setupComponent: false,
      // 禁用功能 sfc
      setupSFC: false,
      plugins: {
        // 解析vue
        vue: vue({
          // 是生产环境
          isProduction: true,
        }),
        // 解析 jsx
        vueJsx: vueJsx(),
      },
    }),
    // 使用节点解析算法定位模块的汇总插件
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    // 将 CommonJS 模块转换为 ES6
    commonjs(),
    // 最快的 TS/ESNext 到 ES6 编译器和压缩器
    esbuild({
      exclude: [],
      // 生成源映射
      sourceMap: minify,
      // 默认值
      target,
      loaders: {
        // 在 .vue 文件中也启用 ts
        '.vue': 'ts',
      },
      // 此功能提供了一种用常量表达式替换全局标识符的方法
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      // 自动删除无法访问的代码
      treeShaking: true,
      // Move all legal comments to the end of the file
      legalComments: 'eof',
    }),
  ];

  // 缩小包体积
  if (minify) {
    // 如果你只想使用这个插件来缩小你的包：
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    );
  }

  const bundle = await rollup({
    // 入口 ui库目录 index.ts
    input: path.resolve(uiRoot, 'index.ts'),
    // plugins
    plugins,
    // 外部依赖项
    external: await generateExternal({ full: true }),
    // 是否应用 tree-shaking 并微调 tree-shaking 过程。
    // 将此选项设置为false将生成更大的包，但可能会提高构建性能
    treeshake: true,
  });

  // writeBundles
  await writeBundles(bundle, [
    // umd
    {
      // 生产包的格式
      format: 'umd',
      // 输出文件
      file: path.resolve(
        uiOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      // 导出模式 使用命名导出
      exports: 'named',
      // IvueMaterialPlus
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
      },
      // 生成源映射
      sourcemap: minify,
    },
    // esm
    {
      // 生产包的格式
      format: 'esm',
      // 输出文件
      file: path.resolve(
        uiOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      // 生成源映射
      sourcemap: minify,
    },
  ]);
}

export const buildFull = (minify: boolean) => async () => {
  Promise.all([buildFullEntry(minify)]);
};

export const buildFullBundle: TaskFunction = parallel(
  // 缩小包
  withTaskName('buildFullMinified', buildFull(true)),
  // 正常包
  withTaskName('buildFull', buildFull(false))
);
