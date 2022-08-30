import {
  defineConfig
} from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';

const config = defineConfig({
  plugins: [vue()],
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
      external: ['vue'],
      output: [
        // umd
        {
          format: 'umd',
          exports: 'named',
          sourcemap: false,
          entryFileNames: 'ivue-material-plus.min.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
          namespaceToStringTag: true,
          inlineDynamicImports: false,
          manualChunks: undefined,
          globals: {
            vue: 'Vue'
          }
        },
        // es
        {
          format: 'es',
          exports: 'named',
          sourcemap: false,
          entryFileNames: 'ivue-material-plus.min.esm.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
          namespaceToStringTag: true,
          inlineDynamicImports: false,
          manualChunks: undefined,
          globals: {
            vue: 'Vue'
          }
        }
      ]
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
});

export default config;
