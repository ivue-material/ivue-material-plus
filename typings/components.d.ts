// For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  // 注册组件
  export interface GlobalComponents {
    IvueAffix: typeof import('../packages/ivue-material-plus')['IvueAffix'];
    IvueInput: typeof import('../packages/ivue-material-plus')['IvueInput'];
    IvueIcon: typeof import('../packages/ivue-material-plus')['IvueIcon'];
    IvueSvgLoader: typeof import('../packages/ivue-material-plus')['IvueSvgLoader'];
    IvueButton: typeof import('../packages/ivue-material-plus')['IvueButton'];
  }

  interface ComponentCustomProperties {
    $loading: typeof import('../packages/ivue-material-plus')['IvueLoadingService'];
  }
}

export {};
