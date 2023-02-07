import { defineBuildConfig } from 'unbuild';

// 支持 typescript 并生成 commonjs
export default defineBuildConfig({
  // 输出目录
  entries: ['src/index'],
  // 清除 dist
  clean: true,
  // 生成 .d.ts 声明文件
  declaration: true,
  // CommonJS
  rollup: {
    emitCJS: true,
  },
});
