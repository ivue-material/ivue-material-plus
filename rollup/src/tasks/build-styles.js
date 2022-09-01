import {
  dest,
  src
} from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import cleanCSS from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import chalk from 'chalk'
import {PKG_NAME} from '../../build-utils'

import {
  resolve
} from 'path'

// 打包样式文件
export const buildStyles = () => {
  // 编译sass
  const sass = gulpSass(dartSass)

  return src(resolve('../', 'src/styles/components/*.scss'))
    // 导入 sass 模块路径
    .pipe(sass({
      includePaths: ['../node_modules/'],
    }).on('error', sass.logError))
    .pipe(sass.sync())
    // autoprefixer
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8']
      })
    )
    // 缩小 CSS
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    // 打包输出路径
    .pipe(dest(`../dist/${PKG_NAME}/styles`));
}
