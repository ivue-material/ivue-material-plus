import { resolve } from 'path';
import findWorkspacePackages from '@pnpm/find-workspace-packages';

import { projRoot } from './paths';

// type
import type { ProjectManifest } from '@pnpm/types';

// 在工作区内查找包
export const getWorkspacePackages = () => findWorkspacePackages(projRoot);

// 获取工作空间名称
export const getWorkspaceNames = async (dir = projRoot) => {
  const pkgs = await findWorkspacePackages(projRoot);

  return pkgs
    .filter((pkg) => pkg.dir.startsWith(dir))
    .map((pkg) => pkg.manifest.name)
    .filter((name): name is string => !!name);
};

// 获取 package.json 数据
export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest;
};

// 获取 package.json 依赖
export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

// 排除文件
export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist'];

  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};
