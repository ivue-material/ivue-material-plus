import { resolve } from 'path';

// 根目录
export const projRoot = resolve(__dirname, '..', '..', '..');

// packages目录
export const pkgRoot = resolve(projRoot, 'packages');
// 组件目录
export const compRoot = resolve(pkgRoot, 'components');
// ui库目录
export const uiRoot = resolve(pkgRoot, 'ivue-material-plus');

// 打包运行文件路径
export const buildRoot = resolve(projRoot, 'build-install', 'build');

// dist
export const buildOutput = resolve(projRoot, 'dist');
// /dist/ivue-material-plus
export const ivueMaterialPlusOutput = resolve(
  buildOutput,
  'ivue-material-plus'
);

// 组件目录的 compPackage
export const compPackage = resolve(compRoot, 'package.json');

export const uiPackage = resolve(uiRoot, 'package.json');
