module.exports = {
  assetsDir: '',
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'examples/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  // css: {
  //   loaderOptions: {
  //     // 给 sass-loader 传递选项
  //     sass: {

  //     },
  //   }
  // }
};
