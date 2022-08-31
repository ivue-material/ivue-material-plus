import path from 'path'

export const PKG_NAME = 'ivue-material-plus'

import {
  epOutput
} from '../build-utils'

// 模块列表
export const modules = ['esm', 'cjs']

// 打包配置
export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(epOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(epOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
}

// 构建配置条目
export const buildConfigEntries = Object.entries(
  buildConfig
)

export const target = 'es2018'
