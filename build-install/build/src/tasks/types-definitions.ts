import path from 'path';
import glob from 'fast-glob';
import { Project } from 'ts-morph';
import { mkdir, readFile, writeFile } from 'fs/promises';
import consola from 'consola';
import chalk from 'chalk';
import resolveFrom from 'resolve-from';

// built-in method
import {
  buildOutput,
  uiRoot,
  excludeFiles,
  pkgRoot,
  projRoot,
} from '@ivue-material-plus/build-utils';
import { pathRewriter } from '../utils';

// type
import type { CompilerOptions, SourceFile } from 'ts-morph';

const outDir = path.resolve(buildOutput, 'types');
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json');

let vueCompiler: typeof import('@vue/compiler-sfc');

const getVueCompiler = () => {
  if (!vueCompiler) {
    const id = resolveFrom.silent(process.cwd(), '@vue/compiler-sfc');
    if (!id) {
      throw new Error('@vue/compiler-sfc is not founded in ./node_modules');
    }
    vueCompiler = require(id);
  }

  return vueCompiler;
};

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    // 只发出 .d.ts 文件； 不要发出 .js 文件
    emitDeclarationOnly: true,
    outDir,
    // 基本目录
    baseUrl: projRoot,
    // 不要解析符号链接的真实路径。
    preserveSymlinks: true,
    // 跳过声明文件的类型检查
    skipLibCheck: true,
    // 对具有隐含“任何”类型的表达式和声明引发错误
    noImplicitAny: false,

    allowJs: true,
    declaration: true,
    noEmitOnError: true,
  };

  const project = new Project({
    compilerOptions,
    // 配置文件路径
    tsConfigFilePath: TSCONFIG_PATH,
    // 跳过从 Ts Config 添加文件
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFiles = await addSourceFiles(project);

  consola.success('Added source files');
  typeCheck(project);
  consola.success('Type check passed!');

  // 生成 d.ts 文件
  await project.emit({
    emitOnlyDtsFiles: true,
  });

  // tasks
  const tasks = sourceFiles.map(async (sourceFile) => {
    // packages目录
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());

    // 生成文件定义
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`
      )
    );

    // 获取此源文件的发出输出
    const emitOutput = sourceFile.getEmitOutput();
    // 获取输出文件
    const emitFiles = emitOutput.getOutputFiles();

    // 没有输出文件
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`);
    }

    // 输出文件写入
    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath();

      // 文件目录
      await mkdir(path.dirname(filepath), {
        recursive: true,
      });

      await writeFile(
        filepath,
        pathRewriter('esm')(outputFile.getText()),
        'utf8'
      );

      // 生成完成类型文件
      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      );
    });

    await Promise.all(subTasks);
  });

  // tasks执行
  await Promise.all(tasks);
};

// 添加源文件
async function addSourceFiles(project: Project) {
  const vueCompiler = getVueCompiler();

  // typings/env.d.ts
  project.addSourceFileAtPath(path.resolve(projRoot, 'typings/env.d.ts'));
  project.addSourceFileAtPath(path.resolve(projRoot, 'typings/shims-vue.d.ts'));

  const globSourceFile = '**/*.{js?(x),ts?(x),vue}';

  // 获取文件路径
  const filePaths = excludeFiles(
    await glob([globSourceFile, '!ivue-material-plus/**/*'], {
      // ../packages
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  );

  // ui库组件文件路径
  const uiPaths = excludeFiles(
    await glob(globSourceFile, {
      // ui库目录
      cwd: uiRoot,
      onlyFiles: true,
    })
  );

  // 源文件
  const sourceFiles: SourceFile[] = [];

  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8');
        // 是否是忽略文件
        const hasTsNoCheck = content.includes('@ts-nocheck');

        // sfc
        const sfc = vueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;

        // script ｜ scriptSetup
        if (script || scriptSetup) {
          let content =
            (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '');

          if (scriptSetup) {
            // descriptor
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            });

            content += compiled.content;
          }
          // 文件后缀
          const lang = scriptSetup?.lang || script?.lang || 'js';
          // 创建文件
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),
    ...uiPaths.map(async (file) => {
      // 修改文件
      const content = await readFile(path.resolve(uiRoot, file), 'utf-8');

      // 创建文件
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content)
      );
    }),
  ]);

  return sourceFiles;
}

// typeCheck
function typeCheck(project: Project) {
  /** Gets the pre-emit diagnostics. */
  const diagnostics = project.getPreEmitDiagnostics();

  if (diagnostics.length > 0) {
    /**
     * Formats an array of diagnostics with their color and context into a string.
     * @param diagnostics - Diagnostics to get a string of.
     * @param options - Collection of options. For example, the new line character to use (defaults to the OS' new line character).
     */
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    const err = new Error('Failed to generate dts.');
    consola.error(err);

    throw err;
  }
}
