import glob from 'fast-glob';
import VueMacros from 'unplugin-vue-macros/rollup';

// vitejs
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// rollup
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';

// built-in method
import { uiRoot, excludeFiles, pkgRoot } from '@ivue-material-plus/build-utils';
import { PlusAlias } from '../plugins/plus-alias';
import { buildConfigEntries, target } from '../build-info';
import { writeBundles, generateExternal } from '../utils';

export const buildModules = async () => {
  // 获取组件路径
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      // packages目录
      cwd: pkgRoot,
      // 返回绝对路径
      absolute: true,
      // 只返回文件
      onlyFiles: true,
    })
  );

  const bundle = await rollup({
    // 打包路径
    input,
    plugins: [
      // 修改别名路径插件
      PlusAlias(),
      // 解析 Json
      json(),
      VueMacros({
        // 禁用功能 setupComponent
        setupComponent: false,
        // 禁用功能 sfc
        setupSFC: false,
        plugins: {
          // 解析vue
          vue: vue({
            // 不是生产环境
            isProduction: false,
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
    // 外部依赖项
    external: await generateExternal({ full: false }),
    // 是否应用 tree-shaking 并微调 tree-shaking 过程。
    // 将此选项设置为false将生成更大的包，但可能会提高构建性能
    treeshake: false,
  });

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
        preserveModulesRoot: uiRoot,
        // 建一个单独的源映射文件
        sourcemap: true,
        // 用于从入口点创建的块的模式 mjs / js
        entryFileNames: `[name].${config.ext}`,
      };
    })
  );
};
