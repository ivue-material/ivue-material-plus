import {
  resolve
} from 'path'

export const projRoot = resolve('../')

// 打包路径
export const buildOutput = resolve(projRoot, 'dist')

// 打包后输出的路径
export const epOutput = resolve(buildOutput, 'ivue-material-plus')

// 打包根目录
export const buildRoot = resolve(projRoot, 'rollup')

// 打包名称
export const PKG_NAME = 'ivue-material-plus'

// 打包根目录
export const pkgRoot = resolve(projRoot, 'src')

// 忽略文件目录
export const excludeFiles = (files) => {
  const excludes = ['node_modules', 'resolvers', 'typings', 'dist', 'styles']

  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}

// 输入模块的目录路径
export const epRoot = resolve(pkgRoot, 'components')
