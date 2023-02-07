const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  assetsDir: '',
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'examples/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  chainWebpack: (config) => {
    // dev环境
    if (!isProduction) {
      const oneOfsMap = config.module.rule('scss').oneOfs.store;

      oneOfsMap.forEach((item) => {
        item
          .use('sass-loader')
          .loader('sass-loader')
          .options({
            // dev覆盖字体路径
            additionalData:
              '$material-icons-font-path: "~packages/styles/material-icons/fonts/material-icons" !default;',
          })
          .end();
      });
      config.resolve
        .plugin('tsconfig-paths')
        .use(require('tsconfig-paths-webpack-plugin'));
    }
  },
};
