import path from 'path'

import {
  outputPath,
  PKG_NAME
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
      path: path.resolve(outputPath, 'es'),
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
      path: path.resolve(outputPath, 'lib'),
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
