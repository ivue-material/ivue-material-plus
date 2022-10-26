import type { ComponentResolver, ComponentInfo } from './types';

export interface resolverOptions {
  // use commonjs lib & source css or scss for ssr
  ssr?: boolean
  // 是否引入style
  importStyle?: boolean
  // 组件名称
  name?: string
}

// 转换为驼峰
function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, ' $1').trim();
  return result.split(' ').join('-').toLowerCase();
}

// 安装包路径
const pakPath = 'ivue-material-plus/dist/unplugin-vue-components';

// 颜色路径
const basePath = 'ivue-material-plus/dist/styles/base.css';

// 没有样式的组件
const noStylesComponents = [
  'ivue-content',
  'ivue-carousel-item',
  'ivue-bottom-nav-item',
  'ivue-breadcrumbs-item',
  'ivue-checkbox-group',
  'ivue-collapse-panel',
  'ivue-count-down',
  'ivue-count-up',
  'ivue-radio-group',
  'ivue-option',
  'ivue-option-group',
  'ivue-image-preview'
];

// 使用依赖组件
const useDependentComponents = [
  // ivue-table
  {
    name: 'ivue-table',
    dependent: ['IvueTableColumn']
  },
  // ivue-tabs
  {
    name: 'ivue-tabs',
    dependent: ['IvueTabItem', 'IvueTab']
  },
  // ivue-select
  {
    name: 'ivue-select',
    dependent: ['IvueOption', 'IvueOptionGroup']
  },
  // ivue-steps
  {
    name: 'ivue-steps',
    dependent: ['IvueStep']
  }
];

// 设置样式文件
function getSideEffects(componentsName: string, options) {
  // 没有样式文件
  if (!options.importStyle) {
    return;
  }

  // 单文件引入
  if (options.singleFile) {
    return [
      `${pakPath}/styles/${componentsName}.css`
    ];
  }

  return [
    `${pakPath}/styles/reset.css`,
    `${pakPath}/styles/ivue-icon.css`,
    `${basePath}`,
    `${pakPath}/styles/${componentsName}.css`
  ];
}

// 请求组件
const resolveComponent = (componentsName: string, options: resolverOptions): ComponentInfo | undefined => {
  // 使用依赖组件
  let useDependentComponentsData = null;

  useDependentComponents.forEach((item) => {
    item.dependent.forEach((dependent) => {
      // 转换为驼峰
      const _kebabCase = kebabCase(dependent);

      // 匹配输入的组件是否符合
      if (_kebabCase === componentsName) {
        useDependentComponentsData = {
          name: dependent,
          from: `${pakPath}/${options.ssr ? 'lib' : 'es'}`,
        };
      }
    });
  });

  // 注册依赖的组件
  if (useDependentComponentsData) {
    return useDependentComponentsData;
  }

  return {
    name: options.name,
    from: `${pakPath}/${options.ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(componentsName, options)
  };
};

// 请求指令
const resolveDirective = (name: string, options: resolverOptions) => {
  const directives = {
    // loading
    Loading: {
      name: 'IvueLoading',
      importName: 'ivue-loading',
      styleName: 'ivue-loading',
      importStyle: true
    },
    // 水波纹
    Ripple: {
      name: 'Ripple',
      importName: 'ivue-ripple',
      styleName: 'ivue-ripple',
      importStyle: true
    },
    // 点击外层触发
    ClickOutside: {
      name: 'ClickOutside',
      importName: 'ivue-click-outside',
      styleName: 'ivue-click-outside',
      importStyle: false
    },
    // 手指事件
    Touch: {
      name: 'Touch',
      importName: 'ivue-touch',
      styleName: 'ivue-touch',
      importStyle: false
    },
    // 文本缩略
    LineClamp: {
      name: 'LineClamp',
      importName: 'ivue-line-clamp',
      styleName: 'ivue-line-clamp',
      importStyle: true,
      // 单文件引入
      singleFile: true
    },
  };

  const directive = directives[name];

  if (!directive) {
    return;
  }

  console.log('directive.name', name)

  return {
    name: directive.name,
    from: `${pakPath}/${options.ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(directive.styleName, {
      importStyle: directive.importStyle,
      singleFile: directive.singleFile
    })
  };
};

export function IvueMaterialPlusResolver(options: resolverOptions): ComponentResolver[] {

  let optionsResolved = {
    ssr: false,
    ...options,
  }

  return [{
    type: 'component',
    resolve: (name: string) => {
      // 是否是 ivue组件
      if (!name.match(/^Ivue[A-Z]/)) {
        return;
      }

      // 转换为驼峰
      const _kebabCase = kebabCase(name);

      // 没有样式组件
      if ([...noStylesComponents].includes(_kebabCase)) {
        return resolveComponent(_kebabCase, {
          name,
          importStyle: false,
          ...optionsResolved
        });
      }

      // 有样式组件
      return resolveComponent(_kebabCase, {
        name,
        importStyle: true,
        ...optionsResolved
      });
    },
  },
  {
    type: 'directive',
    resolve: (name: string) => {
      return resolveDirective(name, optionsResolved);
    },
  },
  ];
}
