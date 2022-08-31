import {
  rollup
} from 'rollup';
import vue from '@vitejs/plugin-vue';
import DefineOptions from 'unplugin-vue-define-options/rollup';
import {
  nodeResolve
} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import glob from 'fast-glob';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-porter';
import postcss from 'rollup-plugin-postcss';


import {
  resolve
} from 'path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projRoot, 'packages');

export function writeBundles(bundle, options = {}) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

export const excludeFiles = (files) => {
  const excludes = ['node_modules', 'gulpfile', 'dist'];

  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};


const buildConfigEntries = Object.entries(
  buildConfig
);

async function build() {
  const input = excludeFiles(
    await glob('src/**/*.{js,ts,vue}', {
      absolute: true,
      onlyFiles: true,
    })
  );


  const bundle = await rollup({
    // 要打包的文件
    input,
    output: {
      file: 'dist',
    },
    plugins: [
      json(),
      css(),
      postcss({
        extract: true
      }),
      DefineOptions(),
      vue({
        isProduction: false,
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    // external: await generateExternal({
    //   full: false
    // }),
    treeshake: false,
  });


  const buildConfig = {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: './dist',
    },
    bundle: {
      path: 'ivue/es',
    },
    dir: './dist'
  };

  // await writeBundles(
  //   bundle,
  //   // buildConfigEntries.map(([module, config]) => {
  //   //   return {
  //   //     format: config.format,
  //   //     dir: config.output.path,
  //   //     exports: module === 'cjs' ? 'named' : undefined,
  //   //     preserveModules: true,
  //   //     sourcemap: true,
  //   //     entryFileNames: `[name].${config.ext}`,
  //   //   };
  //   // })
  //   buildConfig
  // );
  await bundle.write(buildConfig);
}


build();
