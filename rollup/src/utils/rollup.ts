
// 捆绑包
export function writeBundles(bundle, options) {
  // 将包写入磁盘
  return Promise.all(options.map((option) => bundle.write(option)));
}
