import type { ComponentResolver, ComponentInfo } from './types';

export interface resolverOptions {
  // use commonjs lib & source css or scss for ssr
  ssr?: boolean;
  // 是否引入style
  importStyle?: boolean | 'sass' | 'css';
  // 组件名称
  name?: string;
  // 排除组件名称，如果匹配不解析名称
  exclude?: RegExp;
  // 自动导入指令
  directives?: boolean;
  // 没有样式的组件名称列表，因此应该阻止解析它们的样式文件
  noStylesComponents?: string[];
}

// 转换为驼峰
function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, ' $1').trim();
  return result.split(' ').join('-').toLowerCase();
}

// 没有样式的组件
const noStylesComponents = [
  'ivue-content',
  'ivue-carousel-item',
  'ivue-bottom-nav-item',
  'ivue-breadcrumb-item',
  'ivue-checkbox-group',
  'ivue-collapse-panel',
  'ivue-count-down',
  'ivue-count-up',
  'ivue-radio-group',
  'ivue-option',
  'ivue-option-group',
  'ivue-image-preview',
  'ivue-relative-time',
  'ivue-submenu',
  'ivue-menu-group',
  'ivue-menu-item',
  'ivue-form-item',
  'ivue-skeleton-item',
];

// 使用依赖组件
const useDependentComponents = [
  // ivue-table
  {
    name: 'ivue-table',
    dependent: ['IvueTableColumn'],
  },
  // ivue-tabs
  {
    name: 'ivue-tabs',
    dependent: ['IvueTabItem', 'IvueTab'],
  },
  // ivue-form
  {
    name: 'ivue-form',
    dependent: ['IvueFormItem'],
  },
  // ivue-select
  {
    name: 'ivue-select',
    dependent: ['IvueOption', 'IvueOptionGroup'],
  },
  // ivue-steps
  {
    name: 'ivue-steps',
    dependent: ['IvueStep'],
  },
  // ivue-skeleton
  {
    name: 'ivue-skeleton',
    dependent: ['IvueSkeletonItem'],
  },
];

// 样式
const sideEffects = [
  // ivue-page
  {
    name: 'ivue-page',
    sideEffects: ['ivue-select'],
  },
  // ivue-modal
  {
    name: 'ivue-modal',
    sideEffects: ['ivue-button', 'ivue-spin'],
  },
  // ivue-cascader
  {
    name: 'ivue-cascader',
    sideEffects: ['ivue-input', 'ivue-select', 'ivue-loading'],
  },
  // ivue-auto-complete
  {
    name: 'ivue-auto-complete',
    sideEffects: ['ivue-loading', 'ivue-input', 'ivue-select'],
  },
  // ivue-button
  {
    name: 'ivue-button',
    sideEffects: ['ivue-ripple'],
  },
  // ivue-switch
  {
    name: 'ivue-switch',
    sideEffects: ['ivue-ripple'],
  },
  // ivue-table
  {
    name: 'ivue-table',
    sideEffects: ['ivue-tooltip', 'ivue-checkbox', 'ivue-scrollbar'],
  },
];

// 设置样式文件
// function getSideEffects(componentsName: string, options) {
//   // 没有样式文件
//   if (!options.importStyle) {
//     return;
//   }

//   if (options.importStyle === 'sass') {
//     return [
//       // 'ivue-material-plus/packages/styles/src/base.scss',
//       `ivue-material-plus/packages/styles/components/${componentsName}.scss`,
//     ]
//   }

//   // 单文件引入
//   if (options.singleFile) {
//     return [`${pakPath}/styles/${componentsName}.css`];
//   }

//   let list = [
//     `${pakPath}/styles/reset.css`,
//     `${pakPath}/styles/ivue-icon.css`,
//     `${basePath}`,
//     `${animationPath}`,
//     `${pakPath}/styles/${componentsName}.css`,
//   ];

//   sideEffects.forEach((item) => {
//     if (item.name === componentsName) {
//       item.sideEffects.forEach((sideEffectsItem) => {
//         list.push(`${pakPath}/styles/${sideEffectsItem}.css`);
//       });
//     }
//   });

//   return list;
// }

function getSideEffects(dirName: string, options: resolverOptions) {
  const { importStyle, ssr } = options;

  const themeFolder = 'ivue-material-plus/theme-chalk';
  const esComponentsFolder = 'ivue-material-plus/es/components';

  // scss
  if (importStyle === 'sass') {
    return ssr
      ? `${themeFolder}/src/${dirName}.scss`
      : `${esComponentsFolder}/${dirName}/style/index`;
  }
  // 有样式
  else if (importStyle === true || importStyle === 'css') {
    return ssr
      ? `${themeFolder}/el-${dirName}.css`
      : `${esComponentsFolder}/${dirName}/style/css`;
  }
}

// 请求组件
const resolveComponent = (
  componentsName: string,
  options: resolverOptions
): ComponentInfo | undefined => {
  // 排除组件
  if (options.exclude && componentsName.match(options.exclude)) {
    return;
  }

  // 不是自身属性
  if (!componentsName.match(/^Iv[A-Z]/)) {
    return;
  }

  const partialName = kebabCase(componentsName.slice(4)); // IvueTableColumn -> table-column

  return {
    name: options.name,
    from: `ivue-material-plus/${options.ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(partialName, options),
  };
};

// 请求指令
// const resolveDirective = (name: string, options: resolverOptions) => {
//   const directives = {
//     // loading
//     Loading: {
//       name: 'IvueLoading',
//       importName: 'ivue-loading',
//       styleName: 'ivue-loading',
//       importStyle: true,
//     },
//     // 水波纹
//     Ripple: {
//       name: 'Ripple',
//       importName: 'ivue-ripple',
//       styleName: 'ivue-ripple',
//       importStyle: true,
//     },
//     // 点击外层触发
//     ClickOutside: {
//       name: 'ClickOutside',
//       importName: 'ivue-click-outside',
//       styleName: 'ivue-click-outside',
//       importStyle: false,
//     },
//     // 手指事件
//     Touch: {
//       name: 'Touch',
//       importName: 'ivue-touch',
//       styleName: 'ivue-touch',
//       importStyle: false,
//     },
//     // 文本缩略
//     LineClamp: {
//       name: 'LineClamp',
//       importName: 'ivue-line-clamp',
//       styleName: 'ivue-line-clamp',
//       importStyle: true,
//       // 单文件引入
//       singleFile: true,
//     },
//   };

//   const directive = directives[name];

//   if (!directive) {
//     return;
//   }

//   return {
//     name: directive.name,
//     from: `${pakPath}/${options.ssr ? 'lib' : 'es'}`,
//     sideEffects: getSideEffects(directive.styleName, {
//       importStyle: directive.importStyle,
//       singleFile: directive.singleFile,
//     }),
//   };
// };

export function IvueMaterialPlusResolver(
  options?: resolverOptions
): ComponentResolver[] {
  let optionsResolved: resolverOptions = {
    ssr: false,
    ...options,
  };

  // 加载选项配置
  async function resolveOptions() {
    if (optionsResolved) {
      return optionsResolved;
    }

    optionsResolved = {
      ssr: false,
      importStyle: 'css',
      directives: true,
      exclude: undefined,
      noStylesComponents: options.noStylesComponents || [],
      ...options,
    };

    return optionsResolved;
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        const options = await resolveOptions();

        // 是否是 ivue组件
        if (!name.match(/^Ivue[A-Z]/)) {
          return;
        }

        // 没有样式组件
        // if ([...noStylesComponents].includes(_kebabCase)) {
        //   return resolveComponent(_kebabCase, {
        //     name,
        //     importStyle: false,
        //     ...optionsResolved,
        //   });
        // }

        // 没有样式
        if (
          [...options.noStylesComponents, ...noStylesComponents].includes(name)
        ) {
          return resolveComponent(name, { ...options, importStyle: false });
        }
        // 有样式
        else {
          return resolveComponent(name, options);
        }
      },
    },
    // {
    //   type: 'directive',
    //   resolve: (name: string) => {
    //     return resolveDirective(name, optionsResolved);
    //   },
    // },
  ];
}
