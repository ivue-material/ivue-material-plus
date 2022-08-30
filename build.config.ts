import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    // mkdist builder transpiles file-to-file keeping original sources structure
    {
      builder: 'mkdist',
      input: './src/components/',
      outDir: './dist/components'
    },
    {
      builder: 'mkdist',
      input: './src/utils/',
      outDir: './dist/utils'
    },
  ],
  // Generates .d.ts declaration file
  declaration: true,
  // 不退出命令
  failOnWarn: false,
  // rollup
  rollup: {
    // 生成cjs文件
    emitCJS: true,
  },
});
