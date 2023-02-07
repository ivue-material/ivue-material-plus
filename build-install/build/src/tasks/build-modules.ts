import glob from 'fast-glob';
import { rollup } from 'rollup';

import { uiRoot, excludeFiles, pkgRoot } from '@ivue-material-plus/build-utils';
import { PlusAlias } from '../plugins/plus-alias';

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

  // const bundle = await rollup({
  //   // 打包路径
  //   input,
  //   plugins: [
  //     // 在 <script setup> 中可使用 defineOptions 宏
  //     defineOptions(),
  //     // 解析 Json
  //     json(),
  //     // 是一个使用 JS 插件转换样式的工具
  //     postcss(),
  //     VueMacros({
  //       setupComponent: false,
  //       setupSFC: false,
  //       plugins: {
  //         // 解析vue
  //         vue: vue({
  //           // 不是生产环境
  //           isProduction: false,
  //         }),
  //         // 解析 jsx
  //         vueJsx: vueJsx(),
  //       },
  //     }),
  //     // 使用节点解析算法定位模块的汇总插件
  //     nodeResolve({
  //       // 插件将操作的文件的扩展名
  //       extensions: ['.mjs', '.js', '.json', '.ts', '.d.ts'],
  //     }),
  //     // 将 CommonJS 模块转换为 ES6
  //     commonjs(),
  //     // 最快的 TS/ESNext 到 ES6 编译器和压缩器
  //     esbuild({
  //       // 默认
  //       sourceMap: true,
  //       // 默认值
  //       target,
  //       // 添加额外的加载器
  //       loaders: {
  //         // 在 .vue 文件中也启用 ts
  //         '.vue': 'ts',
  //       },
  //     }),
  //     alias({
  //       entries: [
  //         {
  //           find: /^@ivue-material-plus/,
  //           replacement: pkgRoot,
  //         },
  //       ],
  //     }),
  //   ],
  //   // 告诉rollup不要将此打包，而作为外部依赖
  //   external(id) {
  //     return (
  //       /^vue/.test(id) ||
  //       dependencies.some((k) => new RegExp('^' + k).test(id))
  //     );
  //   },
  //   // 是否应用tree-shaking
  //   // 除了使用 ES6 模块之外，Rollup 还静态分析代码中的 import，并将排除任何未实际使用的代码
  //   treeshake: false,
  // });
};
