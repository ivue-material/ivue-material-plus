import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { IvueMaterialPlusResolver } from '../packages/resolvers/ivue-material-plus';
import Inspect from 'vite-plugin-inspect';
import mkcert from 'vite-plugin-mkcert';
import VueMacros from 'unplugin-vue-macros/vite';
import esbuild from 'rollup-plugin-esbuild';
import { uiRoot, pkgRoot } from '@ivue-material-plus/build-utils';

import './vite.init';

const esbuildPlugin = () => ({
  ...esbuild({
    target: 'chrome64',
    include: /\.vue$/,
    loaders: {
      '.vue': 'js',
    },
  }),
  enforce: 'post',
});

export default defineConfig(({ mode }): any => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      // 别名修改
      alias: [
        {
          find: /^ivue-material-plus(\/(es|lib))?$/,
          replacement: path.resolve(uiRoot, 'index.ts'),
        },
        {
          find: /^ivue-material-plus\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      VueMacros({
        // 禁用功能 setupComponent
        setupComponent: false,
        // 禁用功能 sfc
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }),
      // 打包文件
      esbuildPlugin(),
      // 按需引入
      Components({
        include: `${__dirname}/**`,
        resolvers: IvueMaterialPlusResolver({ importStyle: 'sass' }),
        dts: false,
      }),
      // 开发服务提供证书支持
      mkcert(),
      // 检查 Vite 插件的中间状态
      Inspect(),
    ],
    optimizeDeps: {
      include: ['vue', '@vue/shared'],
    },
    esbuild: {
      target: 'chrome64',
    },
  };
});
