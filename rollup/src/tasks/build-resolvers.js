import {
  rollup
} from 'rollup';
import {
  nodeResolve
} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

import {
  resolversPath,
  outputResolversPath
} from '../../build-utils';
import {
  writeBundles
} from '../utils';

import {
  target
} from '../build-info';

export const buildResolvers = async () => {

  const bundle = await rollup({
    // 打包路径
    input: resolversPath,
    plugins: [
      // 使用节点解析算法定位模块的汇总插件
      nodeResolve({
        // 插件将操作的文件的扩展名
        extensions: ['.ts'],
      }),
      // 将 CommonJS 模块转换为 ES6
      commonjs(),
      // 最快的 TS/ESNext 到 ES6 编译器和压缩器
      esbuild({
        // 默认
        sourceMap: true,
        // 默认值
        target,
      }),
    ],
    // 是否应用tree-shaking
    // 除了使用 ES6 模块之外，Rollup 还静态分析代码中的 import，并将排除任何未实际使用的代码
    treeshake: false,
  });

  await writeBundles(
    bundle, [{
      // esm
      format: 'esm',
      // dist/ivue-material-plus/resolvers
      dir: outputResolversPath,
      // 指定导出模式（自动、默认、命名、无）
      // Specify export mode (auto, default, named, none)
      exports: undefined,
      // 建一个单独的源映射文件
      sourcemap: true,
      // 用于从入口点创建的块的模式 mjs / js
      entryFileNames: '[name].js',
    }]
  );
};
