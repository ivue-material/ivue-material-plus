import {
  defineConfig
} from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

import path from 'path';

const config = defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: path.resolve(__dirname, './dist/types'),
    }),
  ],
  target: 'es2015',
  build: {
    outDir: path.resolve(__dirname, './dist'),
    // 库模式
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'IvueMaterialPlus'
    },
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      // 模块的上下文
      context: 'globalThis',
      // 入口块中创建与相应入口模块中完全相同的导出
      preserveEntrySignatures: 'strict',
      // 核心输入选项
      external: ['vue'],
      // 必需（可以是数组，用于多个输出）
      output: [
        // umd
        {
          // 生产包的格式
          format: 'umd',
          // 导出模式 使用命名导出
          exports: 'named',
          // 生成源映射
          sourcemap: false,
          // 输出文件名称
          entryFileNames: 'ivue-material-plus.min.js',
          // 用于命名代码拆分时创建的共享块的模式
          chunkFileNames: '[name].js',
          // 用于命名自定义发射资产以包含在构建输出中的模式
          assetFileNames: '[name].[ext]',
          // 是否将符合规范.toString()的标签添加到命名空间对象
          namespaceToStringTag: true,
          // 这将内联动态导入，而不是创建新块来创建单个包
          inlineDynamicImports: false,
          // 允许创建自定义共享公共块
          manualChunks: undefined,
          globals: {
            vue: 'Vue'
          }
        },
        // es
        {
          format: 'es',
          // 导出模式 使用命名导出
          exports: 'named',
          // 生成源映射
          sourcemap: false,
          // 输出文件名称
          entryFileNames: 'ivue-material-plus.min.esm.js',
          // 用于命名代码拆分时创建的共享块的模式
          chunkFileNames: '[name].js',
          // 用于命名自定义发射资产以包含在构建输出中的模式
          assetFileNames: '[name].[ext]',
          // 是否将符合规范.toString()的标签添加到命名空间对象
          namespaceToStringTag: true,
          // 这将内联动态导入，而不是创建新块来创建单个包
          inlineDynamicImports: false,
          // 允许创建自定义共享公共块
          manualChunks: undefined,
          globals: {
            vue: 'Vue'
          }
        }
      ]
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
});

export default config;
