import { execSync } from 'child_process';
import fg from 'fast-glob';

const getPackages = (packagePath: string) =>
  fg.sync('*', { cwd: packagePath, onlyDirectories: true });

const scopes = [
  ...getPackages('src'),
  ...getPackages('examples'),
  'resolvers',
  'build',
  'rollup',
  'target',
  'typings',
  'ci',
  'dev',
  // 'deploy',
  // 'other',
  // 'typography',
  // 'color',
  // 'border',
  // 'var',
  // 'ssr',
];

export default {
  /**
   * 类型[作用域]: [功能] 描述
   *      ^^^^^
   *
   * 自定义选择 模块范围 命令行显示信息
   */
  'scope-enum': [2, 'always', scopes],
};
