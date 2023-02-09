import path from 'path';
import { dest, parallel, series, src } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import consola from 'consola';
import chalk from 'chalk';
import rename from 'gulp-rename';

import { uiOutput } from '@ivue-material-plus/build-utils';

// type
import type { TaskFunction } from 'gulp';

// dist->styles
const distBundle = path.resolve(uiOutput, 'styles');
// dist
const distFolder = path.resolve(__dirname, 'dist');

// 将源文件复制到包
export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distBundle, 'src'))
  );
}

/**
 * 编译 styles scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildStylesChalk() {
  const sass = gulpSass(dartSass);

  // 没有前缀的文件
  const noElPrefixFile = /(index|base)/;

  return (
    src(path.resolve(__dirname, 'src/*.scss'))
      .pipe(sass.sync())
      // autoprefixer
      .pipe(autoprefixer({ cascade: false }))
      // 缩小 CSS
      .pipe(
        cleanCSS({}, (details) => {
          consola.success(
            `${chalk.cyan(details.name)}: ${chalk.yellow(
              details.stats.originalSize / 1000
            )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
          );
        })
      )
      // 改名
      .pipe(
        rename((path) => {
          if (!noElPrefixFile.test(path.basename)) {
            path.basename = `ivue-${path.basename}`;
          }
        })
      )
      // 打包输出路径
      .pipe(dest(distFolder))
  );
}

/**
 * 打包默认主题变量
 * @returns
 */
function buildDefaultThemeCssVars() {
  const sass = gulpSass(dartSass);
  return (
    src(path.resolve(__dirname, 'src/theme/default/index.scss'))
      .pipe(sass.sync())
      // autoprefixer
      .pipe(autoprefixer({ cascade: false }))
      .pipe(
        cleanCSS({}, (details) => {
          consola.success(
            `${chalk.cyan(details.name)}: ${chalk.yellow(
              details.stats.originalSize / 1000
            )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
          );
        })
      )
      // dist
      .pipe(dest(`${distFolder}/theme`))
  );
}

// 打包elevation
function buildElevation() {
  const sass = gulpSass(dartSass);

  return (
    src(path.resolve(__dirname, 'src/ivue-elevation/index.scss'))
      .pipe(sass.sync())
      // autoprefixer
      .pipe(autoprefixer({ cascade: false }))
      // 缩小 CSS
      .pipe(
        cleanCSS({}, (details) => {
          consola.success(
            `${chalk.cyan(details.name)}: ${chalk.yellow(
              details.stats.originalSize / 1000
            )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
          );
        })
      )
      // dist
      .pipe(dest(`${distFolder}/elevation`))
  );
}

/**
 * 复制 dist 到 dist/styles/theme-chalk
 * @returns
 */
export function copyStylesBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle));
}

// build
export const build: TaskFunction = parallel(
  copyThemeChalkSource,
  series(
    buildStylesChalk,
    buildDefaultThemeCssVars,
    buildElevation,
    copyStylesBundle
  )
);

export default build;
