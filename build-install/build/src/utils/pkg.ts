import { PKG_NAME, PKG_PREFIX } from '@ivue-material-plus/build-constants';
import { buildConfig } from '../build-info';

import type { Module } from '../build-info';

// ts 类型包路径修改
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module];

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/styles`, `${PKG_NAME}/styles`);
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`);

    return id;
  };
};
