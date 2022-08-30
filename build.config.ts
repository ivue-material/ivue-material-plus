import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    // default
    './src/index',
    // mkdist builder transpiles file-to-file keeping original sources structure
    {
      builder: 'mkdist',
      input: './src/components/',
      outDir: './dist/components'
    },
  ],
  clean: true,
  // Generates .d.ts declaration file
  declaration: true,
  // rollup
  rollup: {
    // 生成cjs文件
    emitCJS: true,
  },
});
