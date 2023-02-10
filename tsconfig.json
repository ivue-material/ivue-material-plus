import path from 'path';
// 配置Vitest
import { defineConfig } from 'vitest/config';
// 实现尚未被 Vue 正式现实的提案或想法
import VueMacros from 'unplugin-vue-macros/vite';

import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    VueMacros({
      // 禁用功能 setupComponent
      setupComponent: false,
      // 禁用功能 sfc
      setupSFC: false,
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@ivue-material-plus/,//这里必须使用正则表达式
        //把正则匹配到的地方，@->src
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  // 禁用深度优化
  optimizeDeps: {
    disabled: true,
  },
  test: {
    // 清除模拟历史记录
    clearMocks: true,
    // 环境
    environment: 'jsdom',
    // 安装文件的路径。它们将在每个测试文件之前运行
    setupFiles: ['./vitest.setup.ts'],
    // 确定模块的转换方法
    transformMode: {
      // 转换为客户端组件
      web: [/\.[jt]sx$/],
    },
  },
});
