import {
  resolve
} from 'path'

export const projRoot = resolve('../')

// 打包路径
export const buildOutput = resolve(projRoot, 'dist')

// 打包后输出的路径
export const outputPath = resolve(buildOutput, 'unplugin-vue-components')

// 打包后输出解析器路径
export const outputResolversPath = resolve(projRoot, 'resolvers')

// 打包根目录
export const buildRoot = resolve(projRoot, 'rollup')

// 打包根目录
export const pkgRoot = resolve(projRoot, 'src')

// 打包插件
export const resolversPath = resolve(projRoot, 'src/resolvers/ivue-material-plus.ts')

// 输入模块的目录路径
export const epRoot = resolve(pkgRoot, 'components')

// 打包名称
export const PKG_NAME = 'unplugin-vue-components'

// 忽略文件目录
export const excludeFiles = (files) => {
  const excludes = ['node_modules', 'resolvers', 'typings', 'dist', 'styles']

  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}
