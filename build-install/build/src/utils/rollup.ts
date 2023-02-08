import {
  uiPackage,
  getPackageDependencies,
} from '@ivue-material-plus/build-utils';

// 捆绑包
export function writeBundles(bundle: any, options: any) {
  // 将包写入磁盘
  return Promise.all(options.map((option: any) => bundle.write(option)));
}

// 外部依赖项
export const generateExternal = async (options: { full: boolean }) => {
  // ui库依赖
  const { dependencies, peerDependencies } = getPackageDependencies(uiPackage);

  return (id: string) => {
    const packages: string[] = peerDependencies;

    if (!options.full) {
      packages.push('@vue', ...dependencies);
    }

    // 返回对应的依赖项
    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    );
  };
};

// 输出 .min.js
export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? '.min' : ''}.${ext}`;
}
