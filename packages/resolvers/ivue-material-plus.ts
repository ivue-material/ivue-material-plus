import type { ComponentResolver, ComponentInfo } from './types';

export interface resolverOptions {
  // use commonjs lib & source css or scss for ssr
  ssr?: boolean;
  // 是否引入style
  importStyle?: boolean | 'less' | 'css';
  // 组件名称
  name?: string;
  // 排除组件名称，如果匹配不解析名称
  exclude?: RegExp;
  // 自动导入指令
  directives?: boolean;
  // 没有样式的组件名称列表，因此应该阻止解析它们的样式文件
  noStylesComponents?: string[];
}

export interface options extends resolverOptions {
  // 没有样式的组件名称列表，因此应该阻止解析它们的样式文件
  noStylesComponents: string[];
}

// 转换为驼峰
function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim();
  return result.split(' ').join('-').toLowerCase();
}

// 没有样式的组件
const noStylesComponents: string[] = [
  'IvueFormItem',
  'IvueOptionGroup',
  'IvueOption',
  'IvueSvgLoader',
  'IvueStep',
  'IvueTabItem',
  'IvueTab',
];

function getSideEffects(dirName: string, options: resolverOptions) {
  const { importStyle, ssr } = options;

  const themeFolder = 'ivue-material-plus/styles';
  const esComponentsFolder = 'ivue-material-plus/es/components';

  // scss
  if (importStyle === 'less') {
    return ssr
      ? [
          // 颜色库
          `${themeFolder}/src/colors/index.less`,
          // base
          `${themeFolder}/src/base.less`,
          // component
          `${themeFolder}/src/${dirName}.less`,
        ]
      : [
          // 颜色库
          `${esComponentsFolder}/colors/index`,
          // base
          `${esComponentsFolder}/base/index`,
          // component
          `${esComponentsFolder}/${dirName}/index.less`,
        ];
  }
  // 有样式
  else if (importStyle === true || importStyle === 'css') {
    return ssr
      ? [
          // 颜色库
          `${themeFolder}/colors/index.css`,
          // base
          `${themeFolder}/base.css`,
          // component
          `${themeFolder}/${dirName}.css`,
        ]
      : [
          // 颜色库
          `${themeFolder}/colors/index.css`,
          // base
          `${themeFolder}/base.css`,
          // component
          `${themeFolder}/${dirName}.css`,
        ];
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
  if (!componentsName.match(/^Ivue[A-Z]/)) {
    return;
  }

  const partialName = kebabCase(componentsName); // IvueTableColumn -> table-column

  return {
    name: componentsName,
    from: `ivue-material-plus/${options.ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(partialName, options),
  };
};

// 导入指令
function resolveDirective(
  name: string,
  options: resolverOptions
): ComponentInfo | undefined {
  if (!options.directives) {
    return;
  }

  const directives: Record<string, { importName: string; styleName: string }> =
    {
      // 水波纹
      Ripple: {
        importName: 'RippleDirective',
        styleName: 'ivue-ripple',
      },
      // loading
      Loading: {
        importName: 'IvueLoadingDirective',
        styleName: 'ivue-loading',
      },
    };

  const directive = directives[name];
  if (!directive) {
    return;
  }

  const { ssr } = options;

  return {
    name: directive.importName,
    from: `ivue-material-plus/${ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(directive.styleName, options),
  };
}

export function IvueMaterialPlusResolver(
  options?: resolverOptions
): ComponentResolver[] {
  let optionsResolved: resolverOptions;

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
      noStylesComponents: options?.noStylesComponents || [],
      ...options,
    };

    return optionsResolved;
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        const options = (await resolveOptions()) as options;

        // 是否是 ivue组件
        if (!name.match(/^Ivue[A-Z]/)) {
          return;
        }

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
    {
      type: 'directive',
      resolve: async (name: string) => {
        return resolveDirective(name, await resolveOptions());
      },
    },
  ];
}
